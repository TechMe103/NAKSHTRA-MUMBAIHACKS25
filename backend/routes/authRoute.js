import express from "express";
import { signup, login } from "../controllers/authController.js";
import { signupValidation, loginValidation } from "../validators/authValidation.js";
import { protectRoute } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/signup", signupValidation, signup);
router.post("/login", loginValidation, login);

router.get("/profile", protectRoute, (req, res) => {
  res.json({ message: "Protected route accessed", userId: req.user.id });
});

export default router;
