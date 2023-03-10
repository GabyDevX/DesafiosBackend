import { Router } from "express";
import numCPUs from "os";
const router = Router();
//Change appp. -> router.

router.get("/info", (req, res) => {
  const data = {
    directorioActual: process.cwd(),
    idProceso: process.pid,
    vNode: process.version,
    rutaEjecutable: process.execPath,
    sistemaOperativo: process.platform,
    cantProcesadores: numCPUs.cpus().length,
    memoria: JSON.stringify(process.memoryUsage().rss, null, 2),
  };
  console.log(data);
  return res.render("info", data);
});

export default router;
