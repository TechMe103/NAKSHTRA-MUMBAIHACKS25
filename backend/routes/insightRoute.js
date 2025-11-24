import express from "express";
import { auth } from "../middlewares/auth.js";

import {
  createInsight,
  getInsights,
  markInsightRead,
  deleteInsight,
} from "../controllers/insights.controller.js";

import { createInsightValidator } from "../validators/insights.validator.js";

const router = express.Router();

router.post("/", auth, createInsightValidator, createInsight);
router.get("/", auth, getInsights);
router.patch("/:id/read", auth, markInsightRead);
router.delete("/:id", auth, deleteInsight);

export default router;
