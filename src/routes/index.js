import { Router } from "express";
const router = new Router();

router.get("/", (req, res) => {
  return res
    .status(200)
    .json({ FinApp: "It`s a complete finance manager API" });
});

export default router;
