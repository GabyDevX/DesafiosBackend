import { Router } from "express";
import { User } from "./../models/usuario.js";

import { createTransport } from 'nodemailer'

const TEST_MAIL = 'gabo.ramirez0811@gmail.com'
const PASS = 'nhlaxgvcdovtziyf'

const transporter = createTransport({
  service: 'gmail',
  port: 587,
  auth: {
    user: TEST_MAIL,
    pass: PASS
  }
})

// import {Container} from '../controller/contenedor.js'
// const carrito = new Container('./files/carrito', ['timestamp', 'products'])

import { MongoDB } from "../controller/mongo.js";
const db = new MongoDB(
  "mongodb+srv://coderhouse:coderhouse@cluster0.6zhqh8c.mongodb.net/?retryWrites=true&w=majority",
  "carrito"
);

// import {FirebaseDB} from '../controller/firebase.js'
// const fb = new FirebaseDB('carrito')

const router = Router();

/* ------------------------ Cart Endpoints ------------------------ */

// POST /api/carrito

router.post("/", async (req, res) => {
  const { body } = req;
  console.log(body)
  //const cart = body;
  body.timestamp = new Date().toLocaleString();
  body.products = [];
  // const newCartId = await carrito.save(body)
  const newCartId = await db.save(body);
  // const newCartId = await fb.save(body)

  newCartId
    ? res.status(200).json({ success: "cart added with ID: " + newCartId })
    : res
        .status(400)
        .json({ error: "invalid key. Please verify the body content" });
});

// DELETE /api/carrito/id
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  // const wasDeleted = await carrito.deleteById(id)
  const wasDeleted = await db.deleteById(id);
  // const wasDeleted = await fb.deleteById(id)

  wasDeleted
    ? res.status(200).json({ success: "cart successfully removed" })
    : res.status(404).json({ error: "cart not found" });
});

// POST /api/carrito/:id/productos
router.post("/:id/productos/:id_prod", async (req, res) => {
  const { id, id_prod } = req.params;

  // const product = await carrito.getById(id_prod)
  const product = await db.getById(id_prod, "producto");
  // const product = await fb.getById(id_prod, 'producto')

  if (product) {
    // const cartExist = await carrito.addToArrayById(id, { products: product })
    const cartExist = await db.addToArrayById(id, id_prod);
    // const cartExist = await fb.addToArrayById(id, id_prod)
    console.log(cartExist);
    cartExist
      ? res.status(200).json({ success: "product added" })
      : res.status(404).json({ error: "cart not found" });
  } else {
    res.status(404).json({
      error: "product not found, verify the ID in the body content is correct.",
    });
  }
});

// GET /api/carrito/:id/productos
router.get("/:id/productos", async (req, res) => {
  const { id } = req.params;
  // const cart = await carrito.getById(id)
  const cart = await db.getById(id, 'carrito');
  console.log(cart)
  console.log(cart[0].products)
  // const cart = await fb.getById(id)

  cart
    ? res.status(200).json(cart.products)
    : res.status(404).json({ error: "cart not found" });
});

// // GET /api/carrito/pedir/:id
// router.get("/pedir/:id", async (req, res) => {
//   const usuario = await User.findOne({ username: req.user.username });
//   const { id } = req.params;
//   // const cart = await carrito.getById(id)
//   const cart = await db.getById(id);
//   // const cart = await fb.getById(id)

//   if (cart) {
//     let mailOptions = {
//       from: 'Servidor Nodejs',
//       to: 'gabrielramirezacosta@hotmail.com',
//       subject: 'nuevo registro',
//       html: `<h1 style="color: blue;"> Nuevo Usuario Registrado</h1>
//              <p>${cart.products}</p>
//              `
//     }
//     try {
//       const info = await transporter.sendMail(mailOptions)
//       console.log(info)
//     } catch (error) {
//       console.log(error)
//     }
//     res.send('Pedido en proceso, espere mensaje de confirmacion')
//   } else {
//     res.status(404).json({ error: "cart not found" });
//   }

// })

// DELETE /api/carrito/:id/productos/:id_prod
router.delete("/:id/productos/:id_prod", async (req, res) => {
  const { id, id_prod } = req.params;
  // const productExists = await carrito.getById(id_prod)
  const productExists = await db.getById(id_prod, "producto");
  // const productExists = await fb.getById(id_prod, 'producto')
  if (productExists) {
    //Archivo
    // const cartExists = await fb.removeFromArrayById(
    //   id,
    //   id_prod,
    //   'products',
    // )
    //manejar por bds
    const cartExists = await db.removeFromArrayById(id, id_prod);
    // const cartExists = await fb.removeFromArrayById(id, id_prod)
    cartExists
      ? res.status(200).json({ success: "product removed" })
      : res.status(404).json({ error: "cart not found" });
  } else {
    res.status(404).json({ error: "product not found" });
  }
});

export const CarritoRoutes = router;
