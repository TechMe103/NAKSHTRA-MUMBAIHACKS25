import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/authRoute.js";
import transactionRoutes from "./routes/transactionRoute.js";
import budgetRoutes from "./routes/budgetRoute.js";
import insightRoutes from "./routes/insightRoute.js";

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));


// Routes
app.use("/api/auth", authRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/budgets", budgetRoutes);
app.use("/api/insights", insightRoutes);

app.get("/", (req, res) => {
  res.send("Backend running successfully!");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
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
