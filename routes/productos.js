import { Router } from "express";
import controller from "../controllers/productos.js";

const router = Router();

/* ------------------------ Product Endpoints ------------------------ */

// GET api/productos
router.get("/productos/:id?", controller.get);

// POST api/productos
router.post("/productos/", controller.post);

// PUT api/productos/:id
router.put("/productos/:id", controller.put);

// DELETE /api/productos/:id
router.delete("/productos/:id", controller.deleteProduct);

export default router;
