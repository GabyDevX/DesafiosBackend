import dotenv from "dotenv";
import { MongoDB } from "../persistence/mongo.js";
import { normalizar } from "../utils/utils.js";
import logger from "../logger/logger.js";

dotenv.config();
const MONGO_DB_URI = process.env.URL_MONGO;

const mensajeDB = new MongoDB(MONGO_DB_URI, "mensajes");

const loggerArchiveError = logger.getLogger(`errorArchive`);

function startChatServer(app, io) {
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
}

export default { startChatServer };
