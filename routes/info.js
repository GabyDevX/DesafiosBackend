import { Router } from "express";
import controller from "../controllers/info.js";
const router = Router();

router.get("/info", controller.info);

export default router;
