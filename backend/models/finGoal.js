import mongoose from "mongoose";

// Expense Schema for Monthly Expenses
const expenseSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true
  },
  category: {
    type: String,
    required: true, // e.g., "Rent", "Food", "Transport", etc.  
    trim: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  proofUpload: {
    type: String, // URL/path to uploaded file (e.g., image/PDF for OCR processing)
    default: null
  },
  isMonthly: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

export const Expense = mongoose.model("Expense", expenseSchema);

// Loan Schema for Loans & Rent 
const loanSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true
  },
  type: {
    type: String,
    required: true,
    enum: ["Home Loan", "Personal Loan", "Car Loan", "Rent", "Other"]
  },
  principalAmount: {
    type: Number,
    required: true,
    min: 0
  },
  institutionName: {
    type: String,
    required: true, // "From/Institution name"  
    trim: true
  },
  monthlyEMI: {
    type: Number,
    required: true,
    min: 0
  },
  proofUpload: {
    type: String, // URL/path to uploaded file (e.g., image/PDF for OCR processing)
    default: null
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

export const Loan = mongoose.model("Loan", loanSchema);

// Investment Schema for Investments
const investmentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true
  },
  type: {
    type: String,
    required: true,
    enum: ["SIP", "Stock", "Mutual Fund", "Other"]
  },
  name: {
    type: String,
    required: true, // "Investment name" as per UI
    trim: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  proofUpload: {
    type: String, // URL/path to uploaded file (e.g., image/PDF for OCR processing)
    default: null
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

export const Investment = mongoose.model("Investment", investmentSchema);

