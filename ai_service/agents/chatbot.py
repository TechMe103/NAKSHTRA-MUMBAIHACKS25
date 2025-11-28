import sys
import os

# --- ADD THESE 3 LINES TO FIX THE PATH ERROR ---
# This tells Python to look in the parent directory (ai_service) for rag_engine
current_dir = os.path.dirname(os.path.abspath(__file__))
parent_dir = os.path.dirname(current_dir)
sys.path.append(parent_dir)
# -----------------------------------------------

from phi.agent import Agent
from phi.model.google import Gemini
from dotenv import load_dotenv
import sys
import os

# Import the RAG engine we just built
from rag_engine import get_rag_response

load_dotenv()

# --- THE HYBRID AGENT ---
# We use Gemini for "Chat" but we call the Groq RAG Engine for "Knowledge"
chatbot = Agent(
    name="FinAdapt Chat",
    model=Gemini(id="gemini-2.5-pro"),
    description="You are a financial assistant backed by a powerful knowledge base.",
    instructions=[
        "You are the interface for FinAdapt.",
        "When a user asks a specific question about FinAdapt features, policies, or financial rules:",
        "1. DO NOT guess.",
        "2. Use the 'consult_knowledge_base' tool to get the answer.",
        "3. Rephrase the tool's answer nicely for the user."
    ],
    markdown=True
)

# --- DEFINE THE TOOL ---
def consult_knowledge_base(query: str) -> str:
    """Use this tool to search documents for specific answers about FinAdapt or finance."""
    return get_rag_response(query)

# Add the tool to the agent
chatbot.tools = [consult_knowledge_base]

# --- TEST ---
if __name__ == "__main__":
    print("💬 Asking RAG: 'What is FinAdapt?'")
    response = chatbot.run("What is the core mission of FinAdapt?")
    print(response.content)