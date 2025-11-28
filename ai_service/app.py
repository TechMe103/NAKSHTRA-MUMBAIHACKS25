import sys
import os
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
from dotenv import load_dotenv

# --- 1. PATH SETUP ---
# This ensures we can find 'rag_engine.py' and 'agents/'
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from agents.cleaner import clean_and_structure_data
from agents.insights import insights_agent
from agents.chatbot import chatbot
from rag_engine import get_rag_response # <--- Importing your RAG Brain

load_dotenv()

app = FastAPI(title="FinAdapt AI Service")

# --- 2. CORS (Allows Next.js to talk to Python) ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- 3. DATA MODELS ---
class CleanRequest(BaseModel):
    raw_text: str

class InsightRequest(BaseModel):
    transactions: List[Dict[str, Any]]

class ChatRequest(BaseModel):
    query: str

# --- 4. ENDPOINTS ---

@app.get("/")
def home():
    return {"status": "AI Service is Online 🟢"}

# === AGENT 1: DATA CLEANER ===
@app.post("/clean")
def clean_data(request: CleanRequest):
    try:
        result = clean_and_structure_data(request.raw_text)
        return {"success": True, "data": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# === AGENT 4: CFO INSIGHTS ===
@app.post("/insights")
def generate_insights(request: InsightRequest):
    try:
        transaction_str = str(request.transactions)
        response = insights_agent.run(f"Analyze this data: {transaction_str}")
        return {"success": True, "report": response.content}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# === AGENT 5: TEXT CHATBOT (Next.js Chat) ===
@app.post("/chat")
def chat_with_rag(request: ChatRequest):
    try:
        # Uses the Agent (which uses rag_engine internally)
        response = chatbot.run(request.query)
        return {"success": True, "answer": response.content}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# === NEW! AGENT 6: VOICE KNOWLEDGE SEARCH (For Vapi) ===
@app.post("/api/knowledge-search")
async def handle_knowledge_request(request: Request):
    """
    Vapi calls this URL when the user speaks.
    """
    try:
        data = await request.json()
        print("📞 Vapi called Knowledge Service")
        
        user_query = ""
        
        # LOGIC: Extract the user's spoken question from Vapi's complex payload
        # 1. Check message history
        if 'message' in data and 'messages' in data['message']:
             messages = data['message']['messages']
             for msg in reversed(messages):
                 if msg['role'] == 'user':
                     user_query = msg['content']
                     break
        
        # 2. Check tool arguments (Backup)
        if not user_query and 'message' in data and 'toolCalls' in data['message']:
             user_query = data['message']['toolCalls'][0]['function']['arguments'].get('query')

        if not user_query:
            return {"response": {"result": "I'm listening, but I didn't hear a question.", "is_successful": False}}

        print(f"🗣️ Voice Query: {user_query}")
        
        # CALL THE BRAIN (Your Vector DB)
        retrieved_context = get_rag_response(user_query)
        
        # Send answer back to Vapi so it can speak it
        return {
            "response": {
                "result": retrieved_context,
                "is_successful": True
            }
        }
        
    except Exception as e:
        print(f"❌ Error in knowledge search: {e}")
        return {"response": {"result": "My financial brain is offline momentarily.", "is_successful": False}}

# Run with: uvicorn app:app --reload --port 8000