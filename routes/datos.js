import { Router } from "express";
import controller from "../controllers/datos.js";

const router = Router();

function requireAuthentication(req, res, next) {
  if (req.isAuthenticated()) {
    console.log("auth");
    next();
  } else {
    console.log("noauth");
    res.redirect("/login");
  }
}

router.get("/datos", requireAuthentication, controller.datos);

export default router;
