import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    title: {
      type: String,
      required: true,
    },

    amount: {
      type: Number,
      required: true,
    },

    type: {
      type: String,
      enum: ["income", "expense"],
      required: true,
    },

    category: {
      type: String,
      enum: ["income", "food", "housing", "bills", "health"],
      required: true,
    },

    date: {
      type: Date,
      required: true,
    },

    description: {
      type: String,
      require: false,
      default: "",
    },
  },
  { timestamps: true }
);

export const Transaction = mongoose.model("Transaction", transactionSchema);
