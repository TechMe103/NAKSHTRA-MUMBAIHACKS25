import mongoose from "mongoose";

const financialRecordSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    recordType: {
      type: String,
      required: true,
      enum: ["expense", "loan", "investment", "insight"],
      index: true,
    },

    // COMMON
    amount: { type: Number, min: 0, default: null },
    proofUpload: { type: String, default: null },

    // EXPENSE
    category: { type: String, default: null },
    isMonthly: { type: Boolean, default: null },

    // LOAN
    loanType: {
      type: String,
      enum: ["Home Loan", "Personal Loan", "Car Loan", "Rent", "Other"],
      default: null,
    },
    principalAmount: { type: Number, min: 0, default: null },
    institutionName: { type: String, trim: true, default: null },
    monthlyEMI: { type: Number, min: 0, default: null },
    isActiveLoan: { type: Boolean, default: null },

    // INVESTMENT
    investmentType: {
      type: String,
      enum: ["SIP", "Stock", "Mutual Fund", "Other"],
      default: null,
    },
    investmentName: { type: String, trim: true, default: null },
    isActiveInvestment: { type: Boolean, default: null },

    // INSIGHTS
    insightType: {
      type: String,
      enum: [
        "overspending",
        "saving-opportunity",
        "budget-warning",
        "monthly-summary",
        "income-change",
        "trend-analysis",
      ],
      default: null,
    },
    message: { type: String, default: null },
    data: { type: Object, default: {} },
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const FinancialRecord = mongoose.model(
  "FinancialRecord",
  financialRecordSchema
);
