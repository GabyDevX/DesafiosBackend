import { Router } from "express";
import controller from "../controllers/carritos.js";
import controllerAuth from "../controllers/requireAuthentication.js";

const router = Router();

/* ------------------------ Cart Endpoints ------------------------ */

// POST /api/carrito
router.post("/carrito", controller.post);

// DELETE /api/carrito/id
router.delete("/carrito/:id", controller.deleteCarrito);

// POST /api/carrito/:id/productos
router.post("/carrito/:id/productos/:id_prod", controller.postProductoCarrito);

// GET /api/carrito/:id/productos
router.get("/carrito/:id/productos", controller.getProductoCarrito);

// GET /api/carrito/pedir/:id
router.get("/carrito/pedir/:id", controllerAuth.requireAuthentication, controller.pedir);

// DELETE /api/carrito/:id/productos/:id_prod
router.delete("/carrito/:id/productos/:id_prod", controller.deleteProductoCarrito);

export default router;
