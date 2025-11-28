import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { createServer } from "http";
import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/authRoute.js";
import transactionRoutes from "./routes/transactionRoute.js";
import budgetRoutes from "./routes/budgetRoute.js";
import insightRoutes from "./routes/insightRoute.js";
import chatRoutes from "./routes/chatRoute.js";
import { saveMessage } from "./controllers/chatController.js";
import User from "./models/User.js";

dotenv.config();
connectDB();

const app = express();
const httpServer = createServer(app);

// Socket.io setup with CORS
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000", // Your frontend URL
    methods: ["GET", "POST"],
    credentials: true
  }
});

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/budgets", budgetRoutes);
app.use("/api/insights", insightRoutes);
app.use("/api/chat", chatRoutes);

app.get("/", (req, res) => {
  res.send("Backend running successfully!");
});

// Socket.io middleware for authentication
io.use(async (socket, next) => {
  try {
    const token = socket.handshake.auth.token;
    
    if (!token) {
      return next(new Error("Authentication error"));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");
    
    if (!user) {
      return next(new Error("User not found"));
    }

    socket.userId = user._id.toString();
    socket.userEmail = user.email;
    socket.userName = user.fullName;
    
    next();
  } catch (error) {
    next(new Error("Authentication error"));
  }
});

// Socket.io connection handling
io.on("connection", (socket) => {
  console.log(`User connected: ${socket.userName} (${socket.userId})`);

  // Join user to their own room
  socket.join(socket.userId);

  // Handle joining a chat room
  socket.on("join-room", ({ otherUserId }) => {
    const roomId = [socket.userId, otherUserId].sort().join("-");
    socket.join(roomId);
    console.log(`${socket.userName} joined room: ${roomId}`);
  });

  // Handle sending messages
  socket.on("send-message", async ({ receiverId, text }) => {
    try {
      const roomId = [socket.userId, receiverId].sort().join("-");
      
      // Save message to database
      const messageData = {
        roomId,
        sender: socket.userId,
        receiver: receiverId,
        text,
        timestamp: new Date()
      };

      const savedMessage = await saveMessage(messageData);

      // Emit to both sender and receiver
      io.to(roomId).emit("receive-message", {
        id: savedMessage._id,
        text: savedMessage.text,
        sender: {
          _id: savedMessage.sender._id,
          fullName: savedMessage.sender.fullName,
          email: savedMessage.sender.email
        },
        receiver: {
          _id: savedMessage.receiver._id,
          fullName: savedMessage.receiver.fullName,
          email: savedMessage.receiver.email
        },
        timestamp: savedMessage.timestamp
      });

    } catch (error) {
      console.error("Error sending message:", error);
      socket.emit("message-error", { error: "Failed to send message" });
    }
  });

  // Handle typing indicator
  socket.on("typing-start", ({ receiverId }) => {
    const roomId = [socket.userId, receiverId].sort().join("-");
    socket.to(roomId).emit("user-typing", {
      userId: socket.userId,
      userName: socket.userName,
      isTyping: true
    });
  });

  socket.on("typing-stop", ({ receiverId }) => {
    const roomId = [socket.userId, receiverId].sort().join("-");
    socket.to(roomId).emit("user-typing", {
      userId: socket.userId,
      userName: socket.userName,
      isTyping: false
    });
  });

  // Handle disconnect
  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.userName}`);
  });
});

const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});