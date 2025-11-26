import express from "express";
import { protectRoute } from "../middlewares/authMiddleware.js";
import { uploadFS } from "../middlewares/upload.js";
import {
  createRecord,
const router = express.Router();
// CREATE (single route)
router.post(
  "/",
  protectRoute,
  uploadFS.single("proofUpload"),
  validateFinancialRecord,
  createRecord
);
router.get("/", protectRoute, getRecords);
router.get("/type/:type", protectRoute, getRecordsByType);
router.put(
  "/:id",
  protectRoute,
  uploadFS.single("proofUpload"),      // allow replacing old file
  validateFinancialRecord,
  updateRecord
);
router.delete("/:id", protectRoute, deleteRecord);
router.patch("/:id/read", protectRoute, markInsightRead);
export default router;
