import { Router } from "express";
import controller from "../controllers/register.js";
import authRouter from "./midlewares/auth.js";
import passport from "passport";

const router = Router();

router.use(authRouter);

router.get("/register", controller.register);

router.post(
  "/register",
  passport.authenticate("register", {
    failureRedirect: "/failregister",
    successRedirect: "/",
  })
);

router.get("/failregister", controller.failregister);

export default router;
