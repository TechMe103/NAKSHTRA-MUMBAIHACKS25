"use client";
import { useState, useEffect, useRef } from "react";
import { aiService } from "@/lib/aiService";

export default function ChatbotPage() {
  const [messages, setMessages] = useState([
    { role: "ai", text: "Hello! I am FinAdapt AI. Ask me about your finances or the platform." }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  
  // Auto-scroll to bottom
  const messagesEndRef = useRef(null);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    // 1. Add User Message
    const userMsg = { role: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    // 2. Call AI
    const result = await aiService.chat(userMsg.text);

    // 3. Add AI Response
    const aiMsg = { role: "ai", text: result.answer || "Sorry, I couldn't understand that." };
    setMessages((prev) => [...prev, aiMsg]);
    setLoading(false);
  };

  return (
    // MAIN CONTAINER: Dark background, subtle border
    <div className="flex flex-col h-[80vh] max-w-3xl mx-auto p-1 mt-10">
      
      {/* HEADER */}
      <div className="bg-gray-900 border border-gray-700 rounded-t-xl p-4 flex items-center justify-between shadow-lg">
        <h2 className="text-xl font-bold text-blue-400 flex items-center gap-2">
          <span>🤖</span> FinAdapt AI Assistant
        </h2>
        <span className="text-xs text-gray-400 bg-gray-800 px-2 py-1 rounded-full">Online</span>
      </div>
      
      {/* CHAT AREA: Very dark gray (almost black) */}
      <div className="flex-1 overflow-y-auto p-6 bg-gray-950 border-x border-gray-700 space-y-6">
        {messages.map((msg, index) => (
          <div key={index} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            
            {/* AVATAR (Optional visual polish) */}
            {msg.role === "ai" && (
              <div className="w-8 h-8 rounded-full bg-blue-900/50 flex items-center justify-center mr-2 border border-blue-800 text-xs text-blue-200">
                AI
              </div>
            )}

            {/* MESSAGE BUBBLE */}
            <div className={`p-3.5 rounded-2xl max-w-[80%] text-sm leading-relaxed shadow-md ${
              msg.role === "user" 
                ? "bg-blue-600 text-white rounded-tr-sm" // User: Blue bubble
                : "bg-gray-800 text-gray-200 border border-gray-700 rounded-tl-sm" // AI: Dark Gray bubble
            }`}>
              {msg.text}
            </div>
          </div>
        ))}
        
        {/* LOADING INDICATOR */}
        {loading && (
          <div className="flex justify-start items-center gap-2 text-gray-500 text-sm ml-10">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce delay-100"></div>
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce delay-200"></div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* INPUT AREA */}
      <div className="bg-gray-900 border border-gray-700 rounded-b-xl p-4">
        <div className="flex gap-2">
          <input
            type="text"
            className="flex-1 bg-gray-800 text-white p-3 rounded-xl border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-500 transition-all"
            placeholder="Ask about your finances..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
          />
          <button 
            onClick={handleSend}
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors shadow-lg shadow-blue-900/20"
          >
            Send 🚀
          </button>
        </div>
      </div>
    </div>
  );
}