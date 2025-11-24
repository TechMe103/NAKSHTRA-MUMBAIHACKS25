import mongoose from "mongoose";

const goalSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true, 
    index: true 
  },
  title: { 
    type: String, 
    required: true 
  },
  category: {  // Added to align sections (Loans/Rent, Investments)
    type: String,
    enum: ["savings", "debt", "investment", "rent", "other"],
    required: true
  },
  targetAmount: { 
    type: Number, 
    required: true 
  },
  savedAmount: { 
    type: Number, 
    default: 0 
  },
  monthlyContribution: {  // Added for EMI/investment tracking  
    type: Number,
    default: 0
  },
  deadline: { 
    type: Date, 
    required: true 
  },
  source: {  // (e.g., loan/investment)
    type: mongoose.Schema.Types.ObjectId,
    refPath: "sourceModel",  // Dynamic ref (e.g., "Loan" or "Investment")
    default: null
  },
  sourceModel: {  // e.g., "Loan", "Investment", "Expense"
    type: String,
    default: null
  },
  status: {
    type: String,
    enum: ["in-progress", "completed", "failed"],
    default: "in-progress"
  }
}, { timestamps: true });

// Optional: Pre-save hook to auto-update status (e.g., if savedAmount >= targetAmount)
goalSchema.pre("save", function (next) {
  if (this.savedAmount >= this.targetAmount) {
    this.status = "completed";
  } else if (this.deadline < new Date() && this.savedAmount < this.targetAmount) {
    this.status = "failed";
  }
  next();
});

export const Goal = mongoose.model("Goal", goalSchema);