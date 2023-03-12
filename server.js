import express from "express";
import { Server as HttpServer } from "http";
import { Server as IOServer } from "socket.io";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import cluster from "cluster";
import compression from "compression";
import logger from "./logger/logger.js";
import routes from "./routes/index.js";
import numCPUs from "os";
import mongoose from "mongoose";
import { normalizar } from "./utils/utils.js";
import { MongoDB } from "./persistence/mongo.js";

dotenv.config();

const MONGO_DB_URI = process.env.URL_MONGO;
mongoose.set("strictQuery", true);

const loggerConsole = logger.getLogger(`default`);
const loggerArchiveWarn = logger.getLogger(`warnArchive`);
const loggerArchiveError = logger.getLogger(`errorArchive`);

const envPort = parseInt(process.argv[2]) || 8080;
const PORT = process.env.PORT || envPort;

if (cluster.isMaster) {
  console.log(numCPUs);
  console.log(`PID number: ${process.pid}`);

  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on("exit", (worker) => {
    console.log(`Worker ${worker.process.pid} died: ${new Date().toString()}`);
    cluster.fork();
  });
} else {
  const app = express();

  const envPort = parseInt(process.argv[2]) || 8080;
  const PORT = process.env.PORT || envPort;

  app.get("/", (req, res) => {
    if (!res.headersSent) {
      res.redirect("/datos");
    }
  });

  app.listen(PORT, () => {
    loggerConsole.debug(
      `Servidor escuchando el puerto ${PORT} - PID: ${process.pid}`
    );
  });
}

const app = express();
const httpServer = new HttpServer(app);
const io = new IOServer(httpServer);

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(compression());
app.use(cookieParser());

app.use(routes);

app.set("view engine", "ejs");
app.set("views", "./public/views");

app.use((req, res, next) => {
  loggerConsole.info(`
    Ruta consultada: ${req.originalUrl}
    Metodo ${req.method}`);
  next();
});

app.use((req, res, next) => {
  loggerConsole.warn(`
    Estado: 404
    Ruta consultada: ${req.originalUrl}
    Metodo ${req.method}`);

  loggerArchiveWarn.warn(
    `Estado: 404, Ruta consultada: ${req.originalUrl}, Metodo ${req.method}`
  );

  res.status(404).json({
    error: -2,
    descripcion: `ruta ${req.originalUrl} metodo ${req.method} no implementada`,
  });
  next();
});

//EXPORT TO FETCH DATABASE
const mensajeDB = new MongoDB(MONGO_DB_URI, "mensajes");

io.on("connection", async (socket) => {
  console.log("Un nuevo cliente se ha conectado");

  let mensajesBD;
  try {
    mensajesBD = await mensajeDB.getAll();
  } catch (err) {
    loggerConsole.error(`Error ${err}`);
    loggerArchiveError.error(`Error ${err}`);
  }
  const chat = {
    id: "mensajes",
    mensajes: mensajesBD,
  };

  const normalized = normalizar(chat);

  try {
    socket.emit("mensajes", normalized);

    socket.on("mimensaje", async (data) => {
      const nuevoMensaje = {
        id: socket.id,
        author: {
          id: data.email,
          nombre: data.nombre,
          apellido: data.apellido,
          edad: data.edad,
          alias: data.alias,
          avatar: data.avatar,
        },
        text: data.mensaje,
        fyh: data.fyh,
      };

      await mensajeDB.save(nuevoMensaje);

      let msjs = await mensajeDB.getAll();

      let normalizrReload = {
        id: "mensajes",
        mensajes: msjs,
      };

      let newChat = normalizar(normalizrReload);

      io.sockets.emit("mensajes", newChat);
    });
  } catch (err) {
    loggerConsole.error(`Error ${err}`);
    loggerArchiveError.error(`Error ${err}`);
  }
});

httpServer.listen(PORT, async () => {
  console.log("Servidor escuchando en el puerto " + PORT);
  try {
    const mongo = await mongoose.connect(MONGO_DB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected DB");
  } catch (error) {
    console.log(`Error en conexión de Base de datos: ${error}`);
  }
});
