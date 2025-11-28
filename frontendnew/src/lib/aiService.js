// src/lib/aiService.js

const AI_URL = "http://127.0.0.1:8000"; // Your Python Server Address

export const aiService = {
  // 1. PROCESS DOCUMENT (The New Super Function)
  // This uploads the file -> Python extracts text -> Cleans it -> Generates Insights -> Saves to Vector DB
  async processDocument(file) {
    try {
      const formData = new FormData();
      formData.append("file", file); // Key must be "file" to match Python

      const response = await fetch(`${AI_URL}/process-document`, {
        method: "POST",
        body: formData,
        // NOTE: We do NOT set 'Content-Type' here. 
        // The browser automatically sets it to 'multipart/form-data' with the correct boundary.
      });
      return await response.json();
    } catch (error) {
      console.error("AI Service Upload Error:", error);
      return { success: false, error: "AI Service Offline or Upload Failed" };
    }
  },

  // 2. CHATBOT FUNCTION (For the Voice/Chat Page)
  async chat(query) {
    try {
      const response = await fetch(`${AI_URL}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });
      return await response.json();
    } catch (error) {
      console.error("AI Service Chat Error:", error);
      return { success: false, answer: "⚠️ AI Brain is offline. Is the Python server running?" };
    }
  },

  // 3. CLEANER FUNCTION (Legacy/Testing - keeps the original endpoint available)
  async cleanData(rawText) {
    try {
      const response = await fetch(`${AI_URL}/clean`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ raw_text: rawText }),
      });
      return await response.json();
    } catch (error) {
      console.error("AI Service Clean Error:", error);
      return { success: false, error: "Error cleaning data." };
    }
  },
  
  // 4. INSIGHTS FUNCTION (Legacy/Testing)
  async getInsights(transactions) {
    try {
      const response = await fetch(`${AI_URL}/insights`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transactions }),
      });
      return await response.json();
    } catch (error) {
      console.error("AI Service Insights Error:", error);
      return { success: false, report: "Error fetching insights." };
    }
  },
};