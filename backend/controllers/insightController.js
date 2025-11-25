import { FinancialRecord } from "../models/insight.js";
import { validationResult } from "express-validator";

// CREATE RECORD (expense, loan, investment, insight)
export const createRecord = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    const record = await FinancialRecord.create({
      userId: req.user._id,
      ...req.body,
    });

    res.status(201).json({ success: true, record });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET ALL
export const getRecords = async (req, res) => {
  try {
    const records = await FinancialRecord.find({ userId: req.user._id }).sort({
      createdAt: -1,
    });

    res.json({ success: true, records });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET BY TYPE
export const getRecordsByType = async (req, res) => {
  try {
    const { type } = req.params;

    const records = await FinancialRecord.find({
      userId: req.user._id,
      recordType: type,
    }).sort({ createdAt: -1 });

    res.json({ success: true, records });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// UPDATE
export const updateRecord = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    const record = await FinancialRecord.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      req.body,
      { new: true }
    );

    if (!record)
      return res.status(404).json({ error: "Record not found" });

    res.json({ success: true, record });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE
export const deleteRecord = async (req, res) => {
  try {
    const deleted = await FinancialRecord.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!deleted)
      return res.status(404).json({ error: "Record not found" });

    res.json({ success: true, message: "Record deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// MARK INSIGHT READ
export const markInsightRead = async (req, res) => {
  try {
    const insight = await FinancialRecord.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id, recordType: "insight" },
      { isRead: true },
      { new: true }
    );

    if (!insight)
      return res.status(404).json({ error: "Insight not found" });

    res.json({ success: true, insight });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
