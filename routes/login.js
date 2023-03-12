import { Router } from "express";
import controller from "../controllers/login.js";
import authRouter from "./midlewares/auth.js";
import passport from "passport";

const router = Router();

router.use(authRouter);

router.get("/login", controller.login);

router.post(
  "/login",
  passport.authenticate("login", {
    failureRedirect: "/faillogin",
    successRedirect: "/datos",
  })
);

router.get("/faillogin", controller.faillogin);

export default router;
