import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true
  },

  type: {
    type: String,
    enum: [
      "transaction_new",
      "transaction_edit",
      "budget_alert",
      "account_sync",
      "insight_recommendation",
      "custom",
      "achievement"
    ],
    required: true
  },

  title: { type: String, required: true },
  message: { type: String, required: true },

  severity: {
    type: String,
    enum: ["info", "warning", "error"],
    default: "info"
  },

  relatedId: { type: String, default: null }, // can reference txId, budgetId etc.

  isRead: { type: Boolean, default: false },
  dismissed: { type: Boolean, default: false },

  dateGenerated: { type: Date, default: Date.now },
  dateRead: { type: Date, default: null }
}, { timestamps: true });

export default mongoose.model("Notification", notificationSchema);
