import { Goal } from "../models/goal.model.js";
import { validationResult } from "express-validator";

export const createGoal = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    const goal = await Goal.create({
      userId: req.user._id,
      ...req.body,
    });

    res.status(201).json({ success: true, goal });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getGoals = async (req, res) => {
  try {
    const goals = await Goal.find({ userId: req.user._id });
    res.json({ success: true, goals });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateGoal = async (req, res) => {
  try {
    const goal = await Goal.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json({ success: true, goal });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteGoal = async (req, res) => {
  try {
    await Goal.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Goal deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
