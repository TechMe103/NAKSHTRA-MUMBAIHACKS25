import { body } from "express-validator";

export const createTransactionValidation = [
  body("title")
    .notEmpty()
    .withMessage("Title is required"),

  body("amount")
    .isNumeric()
    .withMessage("Amount must be a valid number"),

  body("type")
    .isIn(["income", "expense"])
    .withMessage("Type must be income or expense"),

  body("category")
    .isIn(["income", "food", "housing", "bills", "health"])
    .withMessage("Invalid category"),

  body("date")
    .notEmpty()
    .withMessage("Date is required"),
];

export const updateTransactionValidation = [
  body("title").optional().notEmpty(),
  body("amount").optional().isNumeric(),
  body("type").optional().isIn(["income", "expense"]),
  body("category")
    .optional()
    .isIn(["income", "food", "housing", "bills", "health"]),
  body("date").optional().notEmpty(),
];
