import { body } from "express-validator";

export const validateFinancialRecord = [
  body("recordType")
    .isIn(["expense", "loan", "investment", "insight"])
    .withMessage("Invalid record type"),

  // EXPENSE
  body("category")
    .if(body("recordType").equals("expense"))
    .notEmpty()
    .withMessage("Category is required"),

  body("amount")
    .if(body("recordType").equals("expense"))
    .isNumeric()
    .withMessage("Amount must be numeric"),

  // LOAN
  body("loanType")
    .if(body("recordType").equals("loan"))
    .isIn(["Home Loan", "Personal Loan", "Car Loan", "Rent", "Other"])
    .withMessage("Invalid loan type"),

  body("principalAmount")
    .if(body("recordType").equals("loan"))
    .isNumeric()
    .withMessage("Principal Amount must be numeric"),

  body("monthlyEMI")
    .if(body("recordType").equals("loan"))
    .isNumeric()
    .withMessage("Monthly EMI must be numeric"),

  // INVESTMENT
  body("investmentType")
    .if(body("recordType").equals("investment"))
    .isIn(["SIP", "Stock", "Mutual Fund", "Other"])
    .withMessage("Invalid investment type"),

  body("investmentName")
    .if(body("recordType").equals("investment"))
    .notEmpty()
    .withMessage("Investment name is required"),

  body("amount")
    .if(body("recordType").equals("investment"))
    .isNumeric()
    .withMessage("Amount must be numeric"),

  // INSIGHT
  body("insightType")
    .if(body("recordType").equals("insight"))
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
    .if(body("recordType").equals("insight"))
    .notEmpty()
    .withMessage("Insight message is required"),
];
