import express from 'express'
import { Server as HttpServer } from 'http'
import { Server as IOServer } from 'socket.io'
import {MongoDB} from './controller/mongo.js'
import ProductosRouter from './router/productos.js'
import { normalize, denormalize, schema } from 'normalizr'

const app = express()
const httpServer = new HttpServer(app)
const io = new IOServer(httpServer)

app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use('/api', new ProductosRouter())

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

const PORT = 8080

httpServer.listen(PORT, () => {
  console.log('Servidor escuchando en el puerto ' + PORT)
})

// UTILS
import util from 'util'

function print(objeto) {
    console.log(util.inspect(objeto,false,12,true))
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
