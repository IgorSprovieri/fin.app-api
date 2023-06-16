import { Router } from "express";
import {
  categoryController,
  colorController,
  iconController,
  userController,
} from "../controllers";
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

router.get("/icons", iconController.getAll);
router.get("/colors", colorController.getAll);

//------------------------------- Auth Routes ----------------------------
router.use(authMiddleware.validateJWT);

router.put("/user", userController.put);
router.put("/user/avatar", userController.avatar);
router.get("/user", userController.get);

router.post("/category", categoryController.post);
router.put("/category/:id", categoryController.put);

export default router;
