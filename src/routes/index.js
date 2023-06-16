import { Router } from "express";
import { userController } from "../controllers";
import { authMiddleware } from "../middlewares";
const router = new Router();

router.get("/", (req, res) => {
  return res
    .status(200)
    .json({ FinApp: "It`s a complete finance manager API" });
});

router.post("/user", userController.post);
router.post("/login", userController.login);
router.post("/forgot-password", userController.forgotPassword);

//------------------------------- Auth Routes ----------------------------
router.use(authMiddleware.validateJWT);

router.put("/user", userController.put);
router.put("/user/avatar", userController.avatar);
router.get("/user", userController.get);

export default router;
