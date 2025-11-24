import express from "express";
import {
  createBudget,
  getBudgets,
  getBudgetById,
  updateBudget,
  deleteBudget,
} from "../controllers/budgetController.js";

import {
  createBudgetValidation,
  updateBudgetValidation,
} from "../validators/budgetValidation.js";

import { protectRoute } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", protectRoute, createBudgetValidation, createBudget);
router.get("/", protectRoute, getBudgets);
router.get("/:id", protectRoute, getBudgetById);
router.put("/:id", protectRoute, updateBudgetValidation, updateBudget);
router.delete("/:id", protectRoute, deleteBudget);

export default router;
