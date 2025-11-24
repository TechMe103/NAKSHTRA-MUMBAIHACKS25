// controllers/notificationController.js

import Notification from "../models/Notification.js";
import { createNotificationSchema, updateNotificationSchema } from "../validators/notificationValidator.js";

// ------------------------
// GET /notifications (list with filters)
// ------------------------
export const getNotifications = async (req, res) => {
  const userId = req.user._id;

  const {
    tab,
    search,
    type,
    severity,
    date_from,
    date_to,
    limit = 20
  } = req.query;

  const filter = { userId, dismissed: false };

  if (tab === "unread") filter.isRead = false;
  if (tab === "read") filter.isRead = true;

  if (type) filter.type = type;
  if (severity) filter.severity = severity;

  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: "i" } },
      { message: { $regex: search, $options: "i" } }
    ];
  }

  if (date_from || date_to) {
    filter.dateGenerated = {};
    if (date_from) filter.dateGenerated.$gte = new Date(date_from);
    if (date_to) filter.dateGenerated.$lte = new Date(date_to);
  }

  const notifications = await Notification.find(filter)
    .sort({ dateGenerated: -1 })
    .limit(Number(limit));

  const unreadCount = await Notification.countDocuments({ userId, isRead: false, dismissed: false });

  return res.json({ notifications, unreadCount });
};

// ------------------------
// POST /notifications (manual/custom create)
// ------------------------
export const createNotification = async (req, res) => {
  const parsed = createNotificationSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json(parsed.error);

  const newNotif = await Notification.create({
    userId: req.user._id,
    ...parsed.data
  });

  return res.status(201).json(newNotif);
};


// ------------------------
// GET /notifications/:id
// ------------------------
export const getNotificationById = async (req, res) => {
  const notif = await Notification.findOne({
    _id: req.params.id,
    userId: req.user._id
  });

  if (!notif) return res.status(404).json({ message: "Not found" });

  return res.json(notif);
};


// ------------------------
// PUT /notifications/:id
// ------------------------
export const updateNotification = async (req, res) => {
  const parsed = updateNotificationSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json(parsed.error);

  const notif = await Notification.findOneAndUpdate(
    { _id: req.params.id, userId: req.user._id },
    { ...parsed.data, dateRead: parsed.data.isRead ? new Date() : null },
    { new: true }
  );

  if (!notif) return res.status(404).json({ message: "Not found" });

  return res.json(notif);
};


// ------------------------
// DELETE /notifications/:id
// ------------------------
export const deleteNotification = async (req, res) => {
  await Notification.findOneAndUpdate(
    { _id: req.params.id, userId: req.user._id },
    { dismissed: true }
  );

  return res.json({ message: "Deleted" });
};


// ------------------------
// POST /notifications/bulk
// ------------------------
export const bulkNotificationAction = async (req, res) => {
  const { action, ids } = req.body;

  if (!ids || !Array.isArray(ids)) {
    return res.status(400).json({ message: "IDs required" });
  }

  if (action === "read") {
    await Notification.updateMany(
      { _id: { $in: ids }, userId: req.user._id },
      { isRead: true, dateRead: new Date() }
    );
  }

  if (action === "delete") {
    await Notification.updateMany(
      { _id: { $in: ids }, userId: req.user._id },
      { dismissed: true }
    );
  }

  res.json({ message: "Bulk updated", affected: ids.length });
};


// ------------------------
// INTERNAL TRIGGER (POST /notifications/trigger)
// ------------------------
export const internalTrigger = async (req, res) => {
  const parsed = createNotificationSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json(parsed.error);

  const notif = await Notification.create(parsed.data);

  return res.status(201).json({ id: notif._id });
};
