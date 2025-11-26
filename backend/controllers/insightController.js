import { FinancialRecord } from "../models/insight.js";
import { validationResult } from "express-validator";
import fs from "fs";

// CREATE RECORD (expense, loan, investment etc)
export const createRecord = async (req, res) => {
  console.log("req.user:", req.user); // <--- check if user exists

  try {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    if (!req.user || !req.user._id) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    const data = { ...req.body };

    if (req.file) {
      data.proofUpload = req.file.path;
    }

    const record = await FinancialRecord.create({
      userId: req.user._id,
      ...data,
    });

    res.status(201).json({ success: true, record });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// GET ALL
export const getRecords = async (req, res) => {
  try {
    if (!req.user || !req.user._id)
      return res.status(401).json({ error: "User not authenticated" });

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
    if (!req.user || !req.user._id)
      return res.status(401).json({ error: "User not authenticated" });

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

    const record = await FinancialRecord.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!record) return res.status(404).json({ error: "Record not found" });

    // If a new file uploaded → delete old file
    if (req.file) {
      if (record.proofUpload && fs.existsSync(record.proofUpload)) {
        fs.unlinkSync(record.proofUpload);
      }
      req.body.proofUpload = req.file.path;
    }

    const updated = await FinancialRecord.findByIdAndUpdate(
      record._id,
      req.body,
      { new: true }
    );

    res.json({ success: true, record: updated });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE
export const deleteRecord = async (req, res) => {
  try {
    const record = await FinancialRecord.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!record) return res.status(404).json({ error: "Record not found" });

    // Delete file from FS
    if (record.proofUpload && fs.existsSync(record.proofUpload)) {
      fs.unlinkSync(record.proofUpload);
    }

    res.json({ success: true, message: "Record + file deleted" });
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

    if (!insight) return res.status(404).json({ error: "Insight not found" });

    res.json({ success: true, insight });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
