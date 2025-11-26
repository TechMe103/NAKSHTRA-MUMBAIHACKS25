import express from "express";
// FIX: Changed import to the correct file name and correct function name
import { protectRoute } from "../middlewares/authMiddleware.js";

import {
  createRecord,
  getRecords,
  getRecordsByType,
  updateRecord,
  deleteRecord,
  markInsightRead,
} from "../controllers/insightController.js";

import { validateFinancialRecord } from "../validators/insightValidation.js";

const router = express.Router();

// FIX: Replaced 'auth' with 'protectRoute' in all lines below

// CREATE
router.post("/", protectRoute, validateFinancialRecord, createRecord);

// GET ALL
router.get("/", protectRoute, getRecords);
router.get("/", protectRoute, getRecords);

// GET BY TYPE
router.get("/type/:type", protectRoute, getRecordsByType);
router.get("/type/:type", protectRoute, getRecordsByType);

// UPDATE
router.put("/:id", protectRoute, validateFinancialRecord, updateRecord);

// DELETE
router.delete("/:id", protectRoute, deleteRecord);
router.delete("/:id", protectRoute, deleteRecord);

// MARK INSIGHT AS READ
router.patch("/:id/read", protectRoute, markInsightRead);
router.patch("/:id/read", protectRoute, markInsightRead);

export default router;