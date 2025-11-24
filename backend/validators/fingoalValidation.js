import { body } from "express-validator";

export const createGoalValidator = [
  body("title").notEmpty().withMessage("Title is required"),

  body("category")
    .isIn(["savings", "debt", "investment", "rent", "other"])
    .withMessage("Invalid category"),

  body("targetAmount")
    .isNumeric()
    .withMessage("Target amount is required"),

  body("monthlyContribution")
    .optional()
    .isNumeric()
    .withMessage("Monthly contribution must be numeric"),

  body("deadline")
    .isISO8601()
    .toDate()
    .withMessage("Deadline must be a valid date"),

  body("sourceModel")
    .optional()
    .isString(),

  body("source")
    .optional()
    .isMongoId()
];
