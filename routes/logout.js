import { Router } from "express";
import controller from "../controllers/logout.js";
import controllerAuth from "../controllers/requireAuthentication.js";
const router = Router();

router.get(`/logout`, controllerAuth.requireAuthentication, controller.logout);

export default router;
