import { Router } from "express";
import path from "path";
import { fileURLToPath } from "url";
import authRouter from "./auth.js";
import passport from "passport";

const router = Router();

router.use(authRouter);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

router.get("/login", (req, res) => {
  if (req.isAuthenticated()) {
    console.log("sii");
    res.redirect("/datos");
  }
  console.log("fuera del else");
  const loginPagePath = path.resolve(
    __dirname,
    "..",
    "public",
    "views",
    "login.html"
  );
  res.sendFile(loginPagePath);
});

router.post(
  "/login",
  passport.authenticate("login", {
    failureRedirect: "/faillogin",
    successRedirect: "/datos",
  })
);

router.get("/faillogin", (req, res) => {
  res.render("login-error");
});

export default router;
