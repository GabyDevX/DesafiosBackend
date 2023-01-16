import express from 'express'
import { Server as HttpServer } from 'http'
import { Server as IOServer } from 'socket.io'
import {MongoDB} from './controller/mongo.js'
import ProductosRouter from './router/productos.js'
import { normalize, denormalize, schema } from 'normalizr'
import cookieParser from 'cookie-parser'
import session from 'express-session'
import MongoStore from 'connect-mongo'
import ApiProductosMock from './api/productos.js' 

const app = express()
const httpServer = new HttpServer(app)
const io = new IOServer(httpServer)

const advancedOptions = {useNewUrlParser: true, useUnifiedTopology: true}

app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
// app.use('/api', new ProductosRouter())
app.use(cookieParser())
app.use(session({
  store: MongoStore.create({
    mongoUrl: 'mongodb+srv://coderhouse:coderhouse@cluster0.6zhqh8c.mongodb.net/?retryWrites=true&w=majority',
    mongoOptions: advancedOptions,
  }),
  secret: 'mysecretkey',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 60000,
  },
  rolling: true,
}))

app.set('view engine', 'ejs')
app.set('views', './public/views')

const db = new MongoDB('mongodb+srv://coderhouse:coderhouse@cluster0.6zhqh8c.mongodb.net/?retryWrites=true&w=majority')

let productos
let mensajes

io.on('connection', async (socket) => {
  console.log('Un nuevo cliente se ha conectado')

  const mensajesBD = await db.getAll()

  const chat = {
    id: 'mensajes',
    mensajes: mensajesBD
  }

  const normalized = normalizar(chat)

  socket.emit('mensajes', normalized)

  socket.on('mimensaje', async (data) => {
    
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
      fyh: data.fyh
      }

    await db.save(nuevoMensaje);

    let msjs = await db.getAll()

    let normalizrReload = {
      id: 'mensajes',
      mensajes: msjs
    }
    
    let newChat = normalizar(normalizrReload)

    io.sockets.emit("mensajes", newChat);
  })

})

app.post(`/submit`, (req, res) => {
    req.session.usuario = req.body.nameLogin;
    res.redirect('/api/productos-test');
});

app.get(`/loginSession`, (req, res) => {
    res.render("loginSession");
    req.session.destroy(err => {
        if (!err) {
            console.log(`ok`)
        } else {
            console.log(`error ${err}`)
        }
    });
});

const apiProductos = new ApiProductosMock()

app.get('/api/productos-test', validateSession, async (req, res, next) => {
    
    try {
        const productosFaker = await apiProductos.popular()
        
        const data = {
            productos: productosFaker,
            nameLogin: req.session.usuario
        };
        
        res.render("inicio", data)
    } catch (error) {
        next(error)
    }
})

app.post(`/keepSession`, validateSession, (req, res) => {
    console.log('sigo');
});

app.get(`/logout`, validateSession, (req, res) => {
    let userLogout = req.session.usuario;
    req.session.destroy(err => {
        if (!err) {
            console.log(`ok`)
        } else {
            console.log(`error`)
        }
    });
    res.render("logout", { userLogout, newRoute: '/loginSession' });
});

function validateSession(req, res, next) {
    if (req.session.usuario) {
        next();
    } else {
        res.redirect('/loginSession');
    }
}

const PORT = 8080

httpServer.listen(PORT, () => {
  console.log('Servidor escuchando en el puerto ' + PORT)
})

// UTILS
import util from 'util'

function print(objeto) {
    //console.log(util.inspect(objeto,false,12,true))
}

//NORMALIZAR

const normalizar = (data) => {
  const authorSchema = new schema.Entity('author', {}, {idAttribute: 'id'})

  const mensajeSchema = new schema.Entity('mensaje', {
    author: authorSchema
  }, {idAttribute: '_id'})

  const mensajesSchema = new schema.Entity('mensajes', {
    mensajes: [mensajeSchema]
  })

  const mensajesNorm = normalize(data, mensajesSchema)

  return mensajesNorm
}
