import { validationResult } from "express-validator";
import { Budget } from "../models/budgetModel.js";

// Create a Budget
export const createBudget = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const budget = await Budget.create({
      userId: req.user.id,
      category: req.body.category,
      limit: req.body.limit,
      periodType: req.body.periodType,
      startDate: req.body.startDate,
      endDate: req.body.endDate,
    });

    res.status(201).json({ message: "Budget created", budget });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Get all budgets for logged-in user
export const getBudgets = async (req, res) => {
  try {
    const budgets = await Budget.find({ userId: req.user.id });
    res.json({ budgets });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Get single budget by ID
export const getBudgetById = async (req, res) => {
  try {
    const budget = await Budget.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!budget) {
      return res.status(404).json({ message: "Budget not found" });
    }

    res.json({ budget });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Update budget
export const updateBudget = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const updatedBudget = await Budget.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      req.body,
      { new: true }
    );

    if (!updatedBudget) {
      return res.status(404).json({ message: "Budget not found" });
    }

    res.json({ message: "Budget updated", budget: updatedBudget });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Delete Budget
export const deleteBudget = async (req, res) => {
  try {
    const deleted = await Budget.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!deleted) {
      return res.status(404).json({ message: "Budget not found" });
    }

    res.json({ message: "Budget deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
