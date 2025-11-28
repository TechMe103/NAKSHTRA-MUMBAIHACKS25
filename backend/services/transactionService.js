// services/transactionService.js
import { Transaction } from "../models/Transaction.js";

export const getUserTransactions = async (userId) => {
  return await Transaction.find({ userId }).sort({ date: -1 }).lean();
};
