import { Router } from "express";
import { User } from "../models/usuario.js";
import notification from "../controllers/notificationController.js"
import { MongoDB } from "../persistence/DAOs/CarritosDAO.js";
const db = new MongoDB(
  "mongodb+srv://coderhouse:coderhouse@cluster0.6zhqh8c.mongodb.net/?retryWrites=true&w=majority",
  "carrito"
);
import controllerAuth from "../controllers/requireAuthentication.js";

const router = Router();

/* ------------------------ Cart Endpoints ------------------------ */

// POST /api/carrito
router.post("/carrito", async (req, res) => {
  const { body } = req;
  console.log(body)
  body.timestamp = new Date().toLocaleString();
  body.products = [];
  const newCartId = await db.save(body);

  newCartId
    ? res.status(200).json({ success: "cart added with ID: " + newCartId })
    : res
        .status(400)
        .json({ error: "invalid key. Please verify the body content" });
});

// DELETE /api/carrito/id
router.delete("/carrito/:id", async (req, res) => {
  const { id } = req.params;
  const wasDeleted = await db.deleteById(id);

  wasDeleted
    ? res.status(200).json({ success: "cart successfully removed" })
    : res.status(404).json({ error: "cart not found" });
});

// POST /api/carrito/:id/productos
router.post("/carrito/:id/productos/:id_prod", async (req, res) => {
  const { id, id_prod } = req.params;

  const product = await db.getById(id_prod, "producto");

  if (product) {
    const cartExist = await db.addToArrayById(id, id_prod);
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
router.get("/carrito/:id/productos", async (req, res) => {
  const { id } = req.params;
  const cart = await db.getById(id, 'carrito');
  console.log(cart)
  console.log(cart[0].products)

  cart
    ? res.status(200).json(cart[0].products)
    : res.status(404).json({ error: "cart not found" });
});

// GET /api/carrito/pedir/:id
router.get("/carrito/pedir/:id", controllerAuth.requireAuthentication, async (req, res) => {
  const username = req.user[0].username
  const { id } = req.params;
  const cart = await db.getById(id);
  console.log(cart);
  if (cart) {
    notification.sendSMSMailCheckout(username, cart)
    res.send("Pedido en proceso, espere mensaje de confirmacion");
  } else {
    res.status(404).json({ error: "cart not found" });
  }
});

// DELETE /api/carrito/:id/productos/:id_prod
router.delete("/carrito/:id/productos/:id_prod", async (req, res) => {
  const { id, id_prod } = req.params;
  const productExists = await db.getById(id_prod, "producto");
  if (productExists) {
    const cartExists = await db.removeFromArrayById(id, id_prod);
    cartExists
      ? res.status(200).json({ success: "product removed" })
      : res.status(404).json({ error: "cart not found" });
  } else {
    res.status(404).json({ error: "product not found" });
  }
});

export default router;
