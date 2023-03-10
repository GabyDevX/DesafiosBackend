import { Router } from "express";
// Importar todos los routers;
import authRouter from "./auth.js";
import datosRouter from "./datos.js";
import infoRouter from "./info.js";
import loginRouter from "./login.js";
import logoutRouter from "./logout.js";
import randomsRouter from "./randoms.js";
import registerRouter from "./register.js";

const router = Router();

router.get("/", (req, res) => {
  if (!res.headersSent) {
    res.redirect("/datos");
  }
});

router.use(authRouter);
router.use("/", datosRouter);
router.use("/", infoRouter);
router.use("/", loginRouter);
router.use("/", logoutRouter);
router.use("/", registerRouter);
router.use("/api", randomsRouter);

export default router;
