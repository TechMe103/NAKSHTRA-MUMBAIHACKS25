import express from "express";
import { auth } from "../middlewares/auth.js";

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

// CREATE
router.post("/", auth, validateFinancialRecord, createRecord);

// GET ALL
router.get("/", auth, getRecords);

// GET BY TYPE
router.get("/type/:type", auth, getRecordsByType);

// UPDATE
router.put("/:id", auth, validateFinancialRecord, updateRecord);

// DELETE
router.delete("/:id", auth, deleteRecord);

// MARK INSIGHT AS READ
router.patch("/:id/read", auth, markInsightRead);

export default router;
//insightRoute.js