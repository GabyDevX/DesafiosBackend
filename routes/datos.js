import { Router } from "express";
import ApiProductosMock from "../api/productos.js";
import { User } from "../models/usuario.js";
const router = Router();
//Change appp. -> router.

const apiProductos = new ApiProductosMock();

function requireAuthentication(req, res, next) {
  if (req.isAuthenticated()) {
    console.log("auth");
    next();
  } else {
    console.log("noauth");
    res.redirect("/login");
  }
}

router.get("/datos", requireAuthentication, async (req, res) => {
  const productosFaker = await apiProductos.popular();

  console.log("No pase user");
  const usuario = await User.findOne({ username: req.user.username });
  console.log("pase user");
  res.render("inicio", {
    datos: usuario,
    productos: productosFaker,
  });
});

export default router;
