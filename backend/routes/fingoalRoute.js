import express from "express";
import { auth } from "../middlewares/auth.js";

import {
  createGoal,
  getGoals,
  updateGoal,
  deleteGoal,
} from "../controllers/goal.controller.js";

import { createGoalValidator } from "../validators/goal.validator.js";

const router = express.Router();

router.post("/", auth, createGoalValidator, createGoal);
router.get("/", auth, getGoals);
router.put("/:id", auth, updateGoal);
router.delete("/:id", auth, deleteGoal);

export default router;
