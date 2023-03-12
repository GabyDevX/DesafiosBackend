import { Router } from "express";
import controller from "../controllers/logout.js";
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

router.get(`/logout`, requireAuthentication, controller.logout);

export default router;
