import { Router } from "express";
const router = new Router();

router.post("/", () => {
  return res
    .status(200)
    .json({ FinApp: "It`s a complete finance manager API" });
});

export default router;
