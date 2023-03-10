import { Router } from "express";
import path from "path";
import { fileURLToPath } from "url";
import authRouter from "./auth.js";
import passport from "passport";

const router = Router();

router.use(authRouter);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

router.get("/register", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/views/register.html"));
});

router.post(
  "/register",
  passport.authenticate("register", {
    failureRedirect: "/failregister",
    successRedirect: "/",
  })
);

router.get("/failregister", (req, res) => {
  res.render("register-error");
});

export default router;
