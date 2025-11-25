from agno.agent import Agent
from agno.models.openai import OpenAIChat
from agno.models.groq import Groq
from agno.team import Team
from agno.tools.duckduckgo import DuckDuckGoTools
from agno.tools.yfinance import YFinanceTools

import os
from dotenv import load_dotenv
load_dotenv()

# Set only Groq key
os.environ["GROQ_API_KEY"] = os.getenv("GROQ_API_KEY")

web_agent = Agent(
    name="Web Agent",
    role="Search the web for latest news, growth drivers, and risks",
    model=Groq(id="llama-3.3-70b-versatile"),  # ✅ CHANGED
    tools=[DuckDuckGoTools()],
    instructions="Always include sources at the end. Focus on November 2025 updates.",
    markdown=True,
)

finance_agent = Agent(
    name="Finance Agent",
    role="Fetch and table-ize latest financials (revenue, EPS, etc.)",
    model=Groq(id="llama-3.3-70b-versatile"),  # ✅ CHANGED
    tools=[YFinanceTools()],
    instructions="Display data in clear tables. Include YTD returns and valuations.",
    markdown=True,
)

agent_team = Team(
    members=[web_agent, finance_agent],
    model=Groq(id="llama-3.3-70b-versatile"),  # ✅ CHANGED
    instructions=["Include sources", "Use tables for financials", "Base on Nov 2025 data"],
    markdown=True,
)

# Your query—will now work with live data
agent_team.print_response(
    "Analyze Tesla (TSLA), NVDA, and Apple (AAPL): latest financials, growth drivers, risks, "
    "and suggest the best long-term buy as of November 2025."
)
