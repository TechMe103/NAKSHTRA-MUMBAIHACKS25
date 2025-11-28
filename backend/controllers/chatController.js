import Message from "../models/Message.js";
import User from "../models/User.js";

// Get chat history between two users
export const getChatHistory = async (req, res) => {
  try {
    const { userId } = req.params;
    const currentUserId = req.user._id;

    // Create consistent roomId (smaller ID first)
    const roomId = [currentUserId.toString(), userId]
      .sort()
      .join("-");

    // Fetch messages for this room
    const messages = await Message.find({ roomId })
      .populate("sender", "fullName email")
      .populate("receiver", "fullName email")
      .sort({ timestamp: 1 })
      .limit(100); // Last 100 messages

    res.status(200).json({ messages });
  } catch (error) {
    console.error("Error fetching chat history:", error);
    res.status(500).json({ error: "Failed to fetch chat history" });
  }
};

// Get list of all users (except current user)
export const getAllUsers = async (req, res) => {
  try {
    const currentUserId = req.user._id;

    const users = await User.find({ _id: { $ne: currentUserId } })
      .select("fullName email")
      .sort({ fullName: 1 });

    res.status(200).json({ users });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Failed to fetch users" });
  }
};

// Save a message (called by Socket.io but can also be REST endpoint)
export const saveMessage = async (messageData) => {
  try {
    const message = new Message(messageData);
    await message.save();
    
    // Populate sender info before returning
    await message.populate("sender", "fullName email");
    await message.populate("receiver", "fullName email");
    
    return message;
  } catch (error) {
    console.error("Error saving message:", error);
    throw error;
  }
};