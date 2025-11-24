import mongoose from "mongoose";

const insightSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
    type: {
      type: String,
      enum: [
        "overspending",
        "saving-opportunity",
        "budget-warning",
        "monthly-summary",
        "income-change",
        "trend-analysis"  // pie/bar trends
      ],
      required: true,
      index: true  // Added for faster type-based queries
    },
    message: {
      type: String,
      required: true
    },
    data: {
      type: Object, // e.g., { category: "Food", amount: 1838, percentage: 20, date: "2025-02-22" }
      default: {}
    },
    isRead: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

export const Insight = mongoose.model("Insight", insightSchema);