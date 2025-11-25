import express from "express";
import { protectRoute } from "../middlewares/authMiddleware.js";

import {
  addTransaction,
  getAllTransactions,
  getTransaction,
  updateTransaction,
  deleteTransaction,
} from "../controllers/transactionController.js";

import {
  createTransactionValidation,
  updateTransactionValidation
} from "../validators/transactionValidation.js";

const router = express.Router();

// Create
router.post("/", protectRoute, createTransactionValidation, addTransaction);

// Read
router.get("/", protectRoute, getAllTransactions);
router.get("/:id", protectRoute, getTransaction);

// Update
router.put("/:id", protectRoute, updateTransactionValidation, updateTransaction);

// Delete
router.delete("/:id", protectRoute, deleteTransaction);

export default router;
