import sys
import os
import fitz  # PyMuPDF
from fastapi import FastAPI, HTTPException, Request, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
from dotenv import load_dotenv

# --- 1. PATH SETUP ---
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from agents.cleaner import clean_and_structure_data
from agents.insights import insights_agent
from agents.chatbot import chatbot
from rag_engine import get_rag_response, VectorStore # Import VectorStore to save data

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

# --- 3. HELPER FUNCTIONS ---
def extract_text_from_pdf(file_bytes):
    doc = fitz.open(stream=file_bytes, filetype="pdf")
    text = ""
    for page in doc:
        text += page.get_text()
    return text

# --- 4. DATA MODELS ---
class CleanRequest(BaseModel):
    raw_text: str

class InsightRequest(BaseModel):
    transactions: List[Dict[str, Any]]

class ChatRequest(BaseModel):
    query: str

# --- 5. ENDPOINTS ---

@app.get("/")
def home():
    return {"status": "AI Service is Online 🟢"}

# === NEW! PROCESS UPLOADED FILE (The Fix for your Loophole) ===
@app.post("/process-document")
async def process_document(file: UploadFile = File(...)):
    print(f"📂 Processing file: {file.filename}")
    try:
        # 1. READ FILE
        file_content = await file.read()
        
        # 2. EXTRACT TEXT
        if file.filename.lower().endswith(".pdf"):
            raw_text = extract_text_from_pdf(file_content)
        else:
            # Fallback for txt/csv
            raw_text = file_content.decode("utf-8")

        if not raw_text.strip():
            return {"success": False, "error": "Document appears empty."}

        # 3. AGENT 1: CLEAN DATA
        print("🧹 Agent 1: Cleaning Data...")
        clean_json_str = clean_and_structure_data(raw_text)
        
        # 4. AGENT 4: GENERATE INSIGHTS
        print("🧠 Agent 4: Analyzing Finances...")
        insights_response = insights_agent.run(f"Analyze this financial data: {clean_json_str}")
        
        # 5. SAVE TO VECTOR DB (So Chatbot & Voice Agent know about it)
        print("💾 Saving to Vector Memory...")
        try:
            db = VectorStore()
            # Split text into chunks (simplified)
            chunks = [raw_text[i:i+1000] for i in range(0, len(raw_text), 1000)]
            ids = [f"{file.filename}_chunk_{i}_{os.urandom(4).hex()}" for i in range(len(chunks))]
            metadatas = [{"source": file.filename, "type": "upload"} for _ in chunks]
            
            db.add_documents(chunks, metadatas, ids)
            print("✅ Saved to Vector Memory.")
        except Exception as e:
            print(f"⚠️ Vector DB Warning: {e}")

        # 6. RETURN RESULTS TO DASHBOARD
        return {
            "success": True,
            "filename": file.filename,
            "clean_data": clean_json_str,
            "report": insights_response.content
        }

    except Exception as e:
        print(f"❌ Error processing document: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# === AGENT 1: DIRECT CLEANER (Legacy) ===
@app.post("/clean")
def clean_data(request: CleanRequest):
    try:
        result = clean_and_structure_data(request.raw_text)
        return {"success": True, "data": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# === AGENT 4: DIRECT INSIGHTS (Legacy) ===
@app.post("/insights")
def generate_insights(request: InsightRequest):
    try:
        transaction_str = str(request.transactions)
        response = insights_agent.run(f"Analyze this data: {transaction_str}")
        return {"success": True, "report": response.content}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# === AGENT 5: TEXT CHATBOT ===
@app.post("/chat")
def chat_with_rag(request: ChatRequest):
    try:
        # Uses the Agent (which uses rag_engine internally)
        response = chatbot.run(request.query)
        return {"success": True, "answer": response.content}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# === AGENT 6: VOICE KNOWLEDGE SEARCH (Vapi) ===
@app.post("/api/knowledge-search")
async def handle_knowledge_request(request: Request):
    try:
        data = await request.json()
        print("📞 Vapi called Knowledge Service")
        
        user_query = ""
        
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
        
        # Send answer back to Vapi
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