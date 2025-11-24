import mongoose from "mongoose";

const budgetSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },

    category: {
      type: String,
      enum: ["Food", "Housing", "Bills", "Health", "Entertainment", "Other"],
      required: true
    },

    limit: {
      type: Number,
      required: true,
      min: 1
    },

    periodType: {
      type: String,
      enum: ["monthly", "weekly", "yearly"],
      default: "monthly"
    },

    startDate: {
      type: Date,
      required: true
    },

    endDate: {
      type: Date,
      required: true
    },

  },
  { timestamps: true }
);

export const Budget = mongoose.model("Budget", budgetSchema);
