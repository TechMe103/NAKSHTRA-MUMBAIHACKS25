import { body } from "express-validator";

export const createInsightValidator = [
  body("type")
    .isIn([
      "overspending",
      "saving-opportunity",
      "budget-warning",
      "monthly-summary",
      "income-change",
      "trend-analysis",
    ])
    .withMessage("Invalid insight type"),

  body("message")
    .notEmpty()
    .withMessage("Insight message is required"),

  body("data")
    .optional()
    .isObject()
    .withMessage("Data must be an object"),
];
