import { Router } from "express";
import { userController } from "../controllers";
const router = new Router();

router.get("/", (req, res) => {
  return res
    .status(200)
    .json({ FinApp: "It`s a complete finance manager API" });
});

router.post("/user", userController.post);

export default router;
