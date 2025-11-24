import express from "express";
import { protectRoute } from "../middlewares/authMiddleware.js";
import {
  addTransaction,
  getTransactions,
  getTransaction,
  updateTransaction,
  deleteTransaction,
} from "../controllers/transactionsController.js";
import { transactionValidation } from "../validators/transactionsValidator.js";

const router = express.Router();

router.post("/", protectRoute, transactionValidation, addTransaction);
router.get("/", protectRoute, getTransactions);
router.get("/:id", protectRoute, getTransaction);
router.put("/:id", protectRoute, updateTransaction);
router.delete("/:id", protectRoute, deleteTransaction);

export default router;
