// import express from "express";

// import {
//   getNotifications,
//   createNotification,
//   getNotificationById,
//   updateNotification,
//   deleteNotification,
//   bulkNotificationAction,
//   internalTrigger
// } from "../controllers/notificationController.js";

// import auth from "../middleware/auth.js";
// import validate from "../middleware/validate.js";

// import {
//   createNotificationSchema,
//   updateNotificationSchema
// } from "../validators/notificationValidator.js";

// const router = express.Router();

// //Get all notifications (Unread/Read/All + filters)
// router.get("/", auth, getNotifications);

// //Create new (manual/custom OR event-driven)
// router.post("/", auth, validate(createNotificationSchema), createNotification);

// //Get single notification
// router.get("/:id", auth, getNotificationById);

// //Update read/dismiss (checkmark/trash icons)
// router.put("/:id", auth, validate(updateNotificationSchema), updateNotification);

// //Delete notification
// router.delete("/:id", auth, deleteNotification);

// //Bulk actions: read/delete multiple
// router.post("/bulk/action", auth, bulkNotificationAction);

// //Internal event trigger (for microservices / system events)
// router.post("/trigger", internalTrigger);

// export default router;



/// ignore thisss stuffsss