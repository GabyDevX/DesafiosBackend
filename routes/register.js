import { Router } from "express";
import controller from "../controllers/register.js";
import authRouter from "./midlewares/auth.js";

const router = Router();

router.use(authRouter);

router.get("/register", controller.register);

router.post("/register", controller.registerPost);

router.get("/failregister", controller.failregister);

export default router;
