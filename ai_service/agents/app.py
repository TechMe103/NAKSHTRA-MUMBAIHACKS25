from agno.agent import Agent
from agno.models.openai import OpenAIChat
from agno.models.groq import Groq
# from agno.tools.yfinance import YFinanceTools
# from agno.knowledge.pdf import PDFKnowledge
# from agno.vectordb.lancedb import LanceDb
# from agno.ui.streamlit import StreamlitUI
# from agno.tools.pandas import PandasTools
from agno.tools.duckduckgo import DuckDuckGoTools

# Disable SSL verification for DuckDuckGo (not recommended for production)
import ssl
ssl._create_default_https_context = ssl._create_unverified_context
# from agno.index.tantivy import TantivyIndex

import os
from dotenv import load_dotenv
load_dotenv()
os.environ["OPEN_AI_API_KEY"] = os.getenv("OPEN_AI_API_KEY")
os.environ["GROQ_API_KEY"] = os.getenv("GROQ_API_KEY")  # Fixed: was "GROQ_AI_API_KEY"

agent = Agent(
    model=Groq(id="llama-3.3-70b-versatile"),  # Fixed: Changed to valid model with tool support
    description="You are an ai agent that provides information",
    tools=[DuckDuckGoTools()],
    markdown=True
)

a = input("Enter your query: ")  # Added colon for better UX
agent.print_response(a)
