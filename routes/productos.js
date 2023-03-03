import { Router } from "express";

// import {Container} from '../controller/contenedor.js'
// const contenedor = new Container('./files/productos', [
//   'title',
//   'price',
//   'description',
//   'code',
//   'image',
//   'stock',
//   'timestamp',
// ])

// import { FirebaseDB } from "../controller/firebase.js";
// const fb = new FirebaseDB("producto");

import { MongoDB } from "../controller/mongo.js";
const db = new MongoDB(
  "mongodb+srv://coderhouse:coderhouse@cluster0.6zhqh8c.mongodb.net/?retryWrites=true&w=majority",
  "producto"
);

const router = Router();

const admin = true;

/* ------------------------ Product Endpoints ------------------------ */

// GET api/productos
router.get("/:id?", async (req, res) => {
  const { id } = req.params;
  if (id) {
    // const product = await contenedor.getById(id)
    // const product = await fb.getById(id)
    const product = await db.getById(id);

    product
      ? res.status(200).json(product)
      : res.status(400).json({ error: "product not found" });
  } else {
    const products = await db.getAll();
    //work
    res.status(200);
    // res.status(200).json(products)
  }
});

// POST api/productos
router.post("/", async (req, res, next) => {
  if (admin) {
    const { body } = req;

    body.timestamp = new Date().toLocaleString();

    // const newProductId = await contenedor.save(body)
    // const newProductId = await fb.save(body)
    const newProductId = await db.save(body);

    newProductId
      ? res
          .status(200)
          .json({ success: "product added with ID: " + newProductId })
      : res
          .status(400)
          .json({ error: "invalid key. Please verify the body content" });
  } else {
    res.json({
      error: -1,
      descripcion: "ruta api/productos metodo post no autorizada",
    });
  }
});

// PUT api/productos/:id
router.put("/:id", async (req, res, next) => {
  if (admin) {
    const { id } = req.params;
    const { body } = req;

    // const wasUpdated = await contenedor.updateById(id, body)
    // const wasUpdated = await fb.updateById(id, body)
    const wasUpdated = await db.updateById(id, body);

    wasUpdated
      ? res.status(200).json({ success: "product updated" })
      : res.status(404).json({ error: "product not found" });
  } else {
    res.json({
      error: -1,
      descripcion: "ruta api/productos metodo post no autorizada",
    });
  }
});

// DELETE /api/productos/:id
router.delete("/:id", async (req, res, next) => {
  if (admin) {
    const { id } = req.params;
    // const wasDeleted = await contenedor.deleteById(id)
    // const wasDeleted = await fb.deleteById(id)
    const wasDeleted = await db.deleteById(id);

    wasDeleted
      ? res.status(200).json({ success: "product successfully removed" })
      : res.status(404).json({ error: "product not found" });
  } else {
    res.json({
      error: -1,
      descripcion: "ruta api/productos metodo post no autorizada",
    });
  }
});

export const ProductosRoutes = router;
