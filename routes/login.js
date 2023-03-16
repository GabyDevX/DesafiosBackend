import { Router } from "express";
import controller from "../controllers/login.js";
import authRouter from "./midlewares/auth.js";

const router = Router();

router.use(authRouter);

router.get("/login", controller.login);

router.post("/login", controller.loginPost);

router.get("/faillogin", controller.faillogin);

export default router;
