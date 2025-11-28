// src/lib/aiService.js

const AI_URL = "http://127.0.0.1:8000"; // Your Python Server Address

export const aiService = {
  // 1. CHATBOT FUNCTION
  async chat(query) {
    try {
      const response = await fetch(`${AI_URL}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });
      return await response.json();
    } catch (error) {
      console.error("AI Service Error:", error);
      return { success: false, answer: "⚠️ AI Brain is offline. Is the Python server running?" };
    }
  },

  // 2. INSIGHTS FUNCTION
  async getInsights(transactions) {
    try {
      const response = await fetch(`${AI_URL}/insights`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transactions }),
      });
      return await response.json();
    } catch (error) {
      console.error("AI Service Error:", error);
      return { success: false, report: "Error fetching insights." };
    }
  },

  // 3. CLEANER FUNCTION
  async cleanData(rawText) {
    try {
      const response = await fetch(`${AI_URL}/clean`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ raw_text: rawText }),
      });
      return await response.json();
    } catch (error) {
      console.error("AI Service Error:", error);
      return { success: false, error: "Error cleaning data." };
    }
  },
};