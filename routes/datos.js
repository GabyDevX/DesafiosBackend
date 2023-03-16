import { Router } from "express";
import controller from "../controllers/datos.js";
import controllerAuth from "../controllers/requireAuthentication.js";

const router = Router();

router.get("/datos", controllerAuth.requireAuthentication, controller.datos);

export default router;
