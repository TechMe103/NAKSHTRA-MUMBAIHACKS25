import express from "express";
import { getChatHistory, getAllUsers } from "../controllers/chatController.js";
import { protectRoute } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Get all users (to select who to chat with)
router.get("/users", protectRoute, getAllUsers);

// Get chat history with a specific user
router.get("/history/:userId", protectRoute, getChatHistory);

export default router;