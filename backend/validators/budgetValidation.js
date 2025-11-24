import { body } from "express-validator";

export const createBudgetValidation = [
  body("category")
    .isIn(["Food", "Housing", "Bills", "Health", "Entertainment", "Other"])
    .withMessage("Invalid category"),

  body("limit")
    .isNumeric()
    .withMessage("Limit must be a valid number")
    .custom((value) => value > 0)
    .withMessage("Limit must be greater than 0"),

  body("periodType")
    .optional()
    .isIn(["monthly", "weekly", "yearly"])
    .withMessage("Invalid period type"),

  body("startDate").isISO8601().withMessage("Start date required"),
  body("endDate").isISO8601().withMessage("End date required")
];

export const updateBudgetValidation = [
  body("limit").optional().isNumeric(),
  body("startDate").optional().isISO8601(),
  body("endDate").optional().isISO8601(),
];
