# knowledge_service.py (FastAPI application for the custom knowledge base)

from fastapi import FastAPI, HTTPException, Request
from pydantic import BaseModel
import json
import os
# Import your vector database client here (e.g., Pinecone, Chroma, etc.)
# from vector_db_client import run_vector_search_rag

app = FastAPI()

# Pydantic model for the request Vapi sends to your webhook
class VapiKnowledgeRequest(BaseModel):
    message: dict # Contains the user's query and full conversation history

# --- Placeholder for your Vector DB/RAG logic ---
def run_vector_search_rag(user_query: str) -> str:
    """
    In a real app, this function:
    1. Embeds the user_query.
    2. Queries your Vector DB for relevant documents.
    3. Combines the documents into a context string (RAG).
    4. Returns the context string.
    """
    # Replace with actual vector DB query
    if "product" in user_query.lower():
        return "CONTEXT: The flagship product, Alpha-Gen, is priced at $499 annually. It features real-time data streaming and a 99.9% uptime guarantee."
    else:
        return "CONTEXT: No relevant product documents found in the database."

@app.post("/api/knowledge-search")
async def handle_knowledge_request(request: Request):
    """
    Webhook endpoint called by Vapi when the LLM decides to use the knowledge base tool.
    """
    try:
        data = await request.json()
        
        # The last user message is usually the most relevant query
        user_query = data['message']['messages'][-1]['content']

        print(f"Vapi requested knowledge for: {user_query}")
        
        # 1. Run your Vector DB Search (RAG)
        retrieved_context = run_vector_search_rag(user_query)

        # 2. Return the retrieved context back to Vapi
        # Vapi's LLM will read this context and formulate a natural spoken answer.
        # This is Vapi's required format for returning documents.
        return {
            "response": {
                "result": retrieved_context,
                "is_successful": True
            }
        }
        
    except Exception as e:
        print(f"Error in knowledge search endpoint: {e}")
        # Inform Vapi that the search failed so the LLM can apologize gracefully
        return {
            "response": {
                "result": "The knowledge base server is currently unavailable.",
                "is_successful": False
            }
        }

# Run the server: uvicorn knowledge_service:app --reload