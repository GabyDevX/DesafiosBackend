import { Router } from "express";
const router = Router();
//Change appp. -> router.

router.get(`/randoms`, (req, res) => {
  res.render(`objectRandomIN`);
});

router.post(`/randoms`, (req, res) => {
  const { cantBucle } = req.body;
  process.env.CANT_BUCLE = cantBucle;

  const objectRandom = fork(`../controller/getObjectRandom`);
  objectRandom.on(`message`, (dataRandom) => {
    return res.send(dataRandom);
  });
});

export default router;
