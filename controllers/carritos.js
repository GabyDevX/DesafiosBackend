import notification from "./notificationController.js"
// import { MongoDB } from "../persistence/DAOs/CarritosDAO.js";
// const db = new MongoDB(
//   "mongodb+srv://coderhouse:coderhouse@cluster0.6zhqh8c.mongodb.net/?retryWrites=true&w=majority",
//   "carrito"
// );

import CarritosRepository from "../persistence/Repositories/CarritosRepository.js";
const carritosRepo = new CarritosRepository();

import ProductosRepository from "../persistence/Repositories/ProductosRepository.js";
const productosRepo = new ProductosRepository();

/* ------------------------ Cart Endpoints ------------------------ */

// POST /api/carrito
const post = async (req, res) => {
    const { body } = req;
    console.log(body)
    body.timestamp = new Date().toLocaleString();
    body.products = [];
    const newCartId = await carritosRepo.save(body);
  
    newCartId
      ? res.status(200).json({ success: "cart added with ID: " + newCartId })
      : res
          .status(400)
          .json({ error: "invalid key. Please verify the body content" });
  };
  
  // DELETE /api/carrito/id
  const deleteCarrito = async (req, res) => {
    const { id } = req.params;
    const wasDeleted = await carritosRepo.deleteById(id);
  
    wasDeleted
      ? res.status(200).json({ success: "cart successfully removed" })
      : res.status(404).json({ error: "cart not found" });
  };
  
  // POST /api/carrito/:id/productos
  const postProductoCarrito = async (req, res) => {
    const { id, id_prod } = req.params;
  
    const product = await productosRepo.getById(id_prod, "producto");
  
    if (product) {
      const cartExist = await carritosRepo.addToArrayById(id, id_prod);
      console.log(cartExist);
      cartExist
        ? res.status(200).json({ success: "product added" })
        : res.status(404).json({ error: "cart not found" });
    } else {
      res.status(404).json({
        error: "product not found, verify the ID in the body content is correct.",
      });
    }
  };
  
  // GET /api/carrito/:id/productos
  const getProductoCarrito = async (req, res) => {
    const { id } = req.params;
    const cart = await carritosRepo.getById(id);
    console.log(cart)
    console.log(cart[0].products)
  
    cart
      ? res.status(200).json(cart[0].products)
      : res.status(404).json({ error: "cart not found" });
  };
  
  // GET /api/carrito/pedir/:id
  const pedir = async (req, res) => {
    const username = req.user[0].username
    const { id } = req.params;
    const cart = await carritosRepo.getById(id);
    console.log(cart);
    if (cart) {
      notification.sendSMSMailCheckout(username, cart)
      res.send("Pedido en proceso, espere mensaje de confirmacion");
    } else {
      res.status(404).json({ error: "cart not found" });
    }
  };
  
  // DELETE /api/carrito/:id/productos/:id_prod
  const deleteProductoCarrito = async (req, res) => {
    const { id, id_prod } = req.params;
    const productExists = await productosRepo.getById(id_prod);
    if (productExists) {
      const cartExists = await carritosRepo.removeFromArrayById(id, id_prod);
      cartExists
        ? res.status(200).json({ success: "product removed" })
        : res.status(404).json({ error: "cart not found" });
    } else {
      res.status(404).json({ error: "product not found" });
    }
  };
  
  export default { post, deleteCarrito, postProductoCarrito, getProductoCarrito, pedir, deleteProductoCarrito}