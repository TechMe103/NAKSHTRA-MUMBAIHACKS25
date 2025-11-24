import { Transaction } from "../models/Transaction.js";
import { validationResult } from "express-validator";

// ADD TRANSACTION  
export const addTransaction = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, amount, type, category, date, description } = req.body;

    const transaction = await Transaction.create({
      userId: req.user.id,
      title,
      amount,
      type,
      category,
      date,
      description,
    });

    res.status(201).json({
      message: "Transaction added",
      transaction,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// GET ALL TRANSACTIONS  
export const getTransactions = async (req, res) => {
  try {
    const { search, type, category, date_from, date_to } = req.query;

    const filter = { userId: req.user.id };

    if (search) {
      filter.title = { $regex: search, $options: "i" };
    }

    if (type && type !== "all") {
      filter.type = type;
    }

    if (category && category !== "all") {
      filter.category = category;
    }

    if (date_from || date_to) {
      filter.date = {};
      if (date_from) filter.date.$gte = new Date(date_from);
      if (date_to) filter.date.$lte = new Date(date_to);
    }

    const transactions = await Transaction.find(filter).sort({ date: -1 });

    // totals
    const income = transactions
      .filter((t) => t.type === "income")
      .reduce((acc, curr) => acc + curr.amount, 0);

    const expenses = transactions
      .filter((t) => t.type === "expense")
      .reduce((acc, curr) => acc + curr.amount, 0);

    const balance = income - expenses;

    res.json({
      count: transactions.length,
      income,
      expenses,
      balance,
      transactions,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// GET SINGLE TRANSACTION  
export const getTransaction = async (req, res) => {
  try {
    const id = req.params.id;

    const transaction = await Transaction.findOne({
      _id: id,
      userId: req.user.id,
    });

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    res.json(transaction);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// UPDATE TRANSACTION  
export const updateTransaction = async (req, res) => {
  try {
    const id = req.params.id;

    const transaction = await Transaction.findOneAndUpdate(
      { _id: id, userId: req.user.id },
      req.body,
      { new: true }
    );

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    res.json({ message: "Updated", transaction });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// DELETE TRANSACTION  
export const deleteTransaction = async (req, res) => {
  try {
    const id = req.params.id;

    const transaction = await Transaction.findOneAndDelete({
      _id: id,
      userId: req.user.id,
    });

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    res.json({ message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
