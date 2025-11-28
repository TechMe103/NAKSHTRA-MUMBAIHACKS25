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


// // server.js
// import express from "express";
// import http from "http";
// import { Server } from "socket.io";
// import cors from "cors";
// import dotenv from "dotenv";
// import fetch from "node-fetch";

// import { connectDB } from "./config/db.js";
// import authRoutes from "./routes/authRoute.js";
// import transactionRoutes from "./routes/transactionRoute.js";
// import budgetRoutes from "./routes/budgetRoute.js";
// import insightRoutes from "./routes/insightRoute.js";

// dotenv.config();
// connectDB();

// const app = express();

// // --- MIDDLEWARE ---
// app.use(cors());
// app.use(express.json());
// app.use("/uploads", express.static("uploads"));

// // --- ROUTES ---
// app.use("/api/auth", authRoutes);
// app.use("/api/transactions", transactionRoutes);
// app.use("/api/budgets", budgetRoutes);
// app.use("/api/insights", insightRoutes);

// app.get("/", (req, res) => {
//   res.send("Backend + Real-time Chat running successfully!");
// });

// // --- CREATE HTTP SERVER ---
// const server = http.createServer(app);

// // --- INIT SOCKET.IO ---
// const io = new Server(server, {
//   cors: {
//     origin: process.env.CORS_ORIGIN || "*",
//   },
// });

// // --- OPENAI ---
// const OPENAI_KEY = process.env.OPENAI_API_KEY || null;

// async function getAIReply(userText) {
//   if (!OPENAI_KEY) {
//     const fallback = [
//       "That's interesting — can you share more details?",
//       "I recommend breaking that into smaller steps.",
//       "I can help with budgeting, saving, or planning. What do you prefer?",
//     ];
//     return `Auto-reply: ${fallback[userText.length % fallback.length]} (add OPENAI_API_KEY for real AI reply)`;
//   }

//   try {
//     const resp = await fetch("https://api.openai.com/v1/chat/completions", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${OPENAI_KEY}`,
//       },
//       body: JSON.stringify({
//         model: "gpt-3.5-turbo",
//         messages: [
//           {
//             role: "system",
//             content: "You are Financial Expert assistant.",
//           },
//           { role: "user", content: userText },
//         ],
//         temperature: 0.25,
//         max_tokens: 200,
//       }),
//     });

//     if (!resp.ok) return "Error contacting AI.";

//     const data = await resp.json();
//     return data.choices?.[0]?.message?.content || "No reply generated.";
//   } catch (err) {
//     console.error("AI Error:", err);
//     return "Something went wrong getting the AI reply.";
//   }
// }

// // --- SOCKET EVENTS ---
// io.on("connection", (socket) => {
//   console.log("Socket connected:", socket.id);

//   socket.on("sendMessage", async (message) => {
//     io.emit("message", message); // broadcast user message

//     io.emit("typing", { userId: "user2", userName: "Financial Expert" });

//     const aiReply = await getAIReply(message.text);

//     const botMessage = {
//       id: `bot-${Date.now()}`,
//       userId: "user2",
//       userName: "Financial Expert",
//       text: aiReply,
//       timestamp: new Date().toISOString(),
//     };

//     io.emit("stopTyping", { userId: "user2" });
//     io.emit("message", botMessage);
//   });

//   socket.on("typing", (payload) => {
//     socket.broadcast.emit("typing", payload);
//   });

//   socket.on("stopTyping", (payload) => {
//     socket.broadcast.emit("stopTyping", payload);
//   });

//   socket.on("disconnect", () => {
//     console.log("Socket disconnected:", socket.id);
//   });
// });

// // --- START SERVER ---
// const PORT = process.env.PORT || 5000;
// server.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });
