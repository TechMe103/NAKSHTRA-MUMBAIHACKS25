// validators/notificationValidator.js
import Joi from "joi";

export const createNotificationSchema = Joi.object({
  type: Joi.string()
    .valid(
      "transaction_new",
      "transaction_edit",
      "budget_alert",
      "account_sync",
      "insight_recommendation",
      "custom",
      "achievement"
    )
    .required(),

  title: Joi.string().min(2).required(),

  message: Joi.string().min(2).required(),

  severity: Joi.string().valid("info", "warning", "error").optional(),

  relatedId: Joi.string().optional(),
});

export const updateNotificationSchema = Joi.object({
  isRead: Joi.boolean().optional(),

  dismissed: Joi.boolean().optional(),
});
