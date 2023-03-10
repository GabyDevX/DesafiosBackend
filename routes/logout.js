import { Router } from "express";
// import { requireAuthentication } from "./midlewares/auth.js";
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

router.get(`/logout`, requireAuthentication, (req, res) => {
  let userLogout = req.session.usuario;
  req.session.destroy((err) => {
    if (!err) {
      console.log(`ok`);
    } else {
      console.log(`error`);
    }
  });
  res.render("logout", { userLogout, newRoute: "/login" });
});

export default router;
