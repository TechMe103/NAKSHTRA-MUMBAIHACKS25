import express from "express";
import { protectRoute } from "../middlewares/authMiddleware.js";
import { uploadFS } from "../middlewares/upload.js";

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
router.post(
  "/",
  protectRoute,
  uploadFS.single("proofUpload"),
  validateFinancialRecord,
  createRecord
);

// GET ALL
router.get("/", protectRoute, getRecords);

// GET BY TYPE
router.get("/type/:type", protectRoute, getRecordsByType);

// UPDATE
router.put(
  "/:id",
  protectRoute,
  uploadFS.single("proofUpload"), // allow new proof upload
  validateFinancialRecord,
  updateRecord
);

// DELETE
router.delete("/:id", protectRoute, deleteRecord);

// MARK INSIGHT AS READ
router.patch("/:id/read", protectRoute, markInsightRead);

export default router;
