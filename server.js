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
import passport from 'passport'
import { Strategy as LocalStrategy } from 'passport-local'
import bCrypt from "bcrypt"
import { User } from "./models/usuario.js"
import mongoose from "mongoose";
import path from 'path';
import { fileURLToPath } from 'url';

const MONGO_DB_URI =
	"mongodb+srv://coderhouse:coderhouse@cluster0.6zhqh8c.mongodb.net/?retryWrites=true&w=majority"

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

passport.use(
	"register",
	new LocalStrategy(
		{
			passReqToCallback: true,
		},
		function (req, username, password, done) {
      const { direccion } = req.body
			const findOrCreateUser = function () {
				User.findOne({ username: username }, async function (err, user) {
					if (err) {
						console.log("Error in SignUp: " + err);
						return done(err);
					}
					if (user) {
						console.log("User already exists");
						done(null, false);
					} else {
						var newUser = new User();
						newUser.username = username;
						newUser.password = createHash(password);
            newUser.direccion = direccion;
						newUser = await newUser.save()
            done(null, newUser)
					}
				});
			};
			process.nextTick(findOrCreateUser);
		}
	)
);

passport.use(
	"login",
	new LocalStrategy(
		{
			passReqToCallback: true,
		},
		async (req, username, password, done) => {
			User.findOne({ username: username }, (err, user) => {
				if (err) return done(err);
				if (!user) {
					console.log("User Not Found with username " + username);
					return done(null, false);
				}
				if (!validatePassword(user, password)) {
					console.log("Invalid Password");
					return done(null, false);
				}
				return done(null, user);
			});
		}
	)
);

const validatePassword = (user, password) => {
	return bCrypt.compareSync(password, user.password);
};

var createHash = function (password) {
	return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
};

passport.serializeUser((user, done) => {
	done(null, user._id);
});

passport.deserializeUser((id, done) => {
	User.findById(id, function (err, user) {
		done(err, user);
	});
});

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
    mongoUrl: MONGO_DB_URI,
    mongoOptions: advancedOptions,
  }),
  secret: 'mysecretkey',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 600000,
  },
  rolling: true,
}))

app.use(passport.initialize())
app.use(passport.session())

app.set('view engine', 'ejs')
app.set('views', './public/views')



const mensajeDB = new MongoDB('mongodb+srv://coderhouse:coderhouse@cluster0.6zhqh8c.mongodb.net/?retryWrites=true&w=majority', 'mensajes')
const usuarioDB = new MongoDB('mongodb+srv://coderhouse:coderhouse@cluster0.6zhqh8c.mongodb.net/?retryWrites=true&w=majority', 'usuarios')

let productos
let mensajes

io.on('connection', async (socket) => {
  console.log('Un nuevo cliente se ha conectado')

  const mensajesBD = await mensajeDB.getAll()

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

    await mensajeDB.save(nuevoMensaje);

    let msjs = await mensajeDB.getAll()

    let normalizrReload = {
      id: 'mensajes',
      mensajes: msjs
    }
    
    let newChat = normalizar(normalizrReload)

    io.sockets.emit("mensajes", newChat);
  })

})

app.get('/register', (req, res) => {
    res.sendFile(__dirname + '/public/views/register.html')
})

app.post('/register', passport.authenticate('register', { failureRedirect: '/failregister', successRedirect: '/'}))

app.get('/failregister', (req, res)=> {
    res.render('register-error')
})

app.get('/login', (req, res) => {
    if (req.isAuthenticated()) {
        res.redirect('/datos')
    }

    res.sendFile(__dirname  + '/public/views/login.html')
})

app.post('/login', passport.authenticate('login', { failureRedirect: '/faillogin', successRedirect: '/datos' }))

app.get('/faillogin', (req, res) => {
    res.render('login-error')
})

function requireAuthentication(req, res, next) {
    if (req.isAuthenticated()) {
        next()
    } else {
        res.redirect('/login')
    }
}

const apiProductos = new ApiProductosMock()

app.get('/datos', requireAuthentication, async (req, res) => {

    const productosFaker = await apiProductos.popular()
    
    const usuario = await User.findOne({username : req.user.username})

    res.render('inicio', {
      datos: usuario,
      productos: productosFaker,
    })
  })

// app.post(`/submit`, (req, res) => {
//     req.session.usuario = req.body.nameLogin;
//     res.redirect('/api/productos-test');
// });

// app.get(`/loginSession`, (req, res) => {
//     res.render("loginSession");
//     req.session.destroy(err => {
//         if (!err) {
//             console.log(`ok`)
//         } else {
//             console.log(`error ${err}`)
//         }
//     });
// });


// app.post(`/keepSession`, validateSession, (req, res) => {
//     console.log('sigo');
// });

app.get(`/logout`, requireAuthentication, (req, res) => {
    let userLogout = req.session.usuario;
    req.session.destroy(err => {
        if (!err) {
            console.log(`ok`)
        } else {
            console.log(`error`)
        }
    });
    res.render("logout", { userLogout, newRoute: '/login' });
});

app.get('/', (req, res) => {
    res.redirect('/datos')
})

// function validateSession(req, res, next) {
//     if (req.session.usuario) {
//         next();
//     } else {
//         res.redirect('/loginSession');
//     }
// }

const PORT = 8080

httpServer.listen(PORT, async () => {
  console.log('Servidor escuchando en el puerto ' + PORT)
  try {
		const mongo = await mongoose.connect(MONGO_DB_URI, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		});
		console.log("Connected DB");
	} catch (error) {
		console.log(`Error en conexión de Base de datos: ${error}`);
	}
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
