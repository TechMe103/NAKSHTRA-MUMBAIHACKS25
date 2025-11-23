from phi.agent import Agent
from phi.model.google import Gemini
from pydantic import BaseModel, Field
from typing import List
from dotenv import load_dotenv

load_dotenv()

# --- 1. DEFINE THE OUTPUT FORMAT ---
# We want the advice to be structured so the Frontend can display it nicely.
class FinancialInsight(BaseModel):
    title: str = Field(..., description="A short, catchy headline for the insight (e.g., 'Stop ordering so much pizza!').")
    severity: str = Field(..., description="High, Medium, or Low urgency.")
    message: str = Field(..., description="The detailed advice explained in a friendly but professional tone.")
    savings_potential: float = Field(..., description="Estimated rupees the user could save next month.")

class CFOReport(BaseModel):
    total_spend: float
    primary_expense_category: str
    insights: List[FinancialInsight]
    summary_markdown: str = Field(..., description="A 2-paragraph executive summary formatted in Markdown.")

# --- 2. THE CFO AGENT ---
insights_agent = Agent(
    name="FinAdapt CFO",
    # Using the latest Gemini 3 Pro for advanced reasoning
    model=Gemini(id="gemini-2.5-pro", temperature=0.3), 
    description="You are a world-class Personal CFO (Chief Financial Officer).",
    instructions=[
        "Analyze the provided list of transactions strictly.",
        "Identify spending patterns (e.g., too much 'Food' or 'Entertainment').",
        "Calculate the total spend and identify the biggest category.",
        "Generate 3 specific, actionable insights to help the user save money.",
        "Be direct but empathetic. If they spend too much on food, suggest cooking at home.",
        "Output the result as a structured JSON report."
    ],
    response_model=CFOReport,
    markdown=True 
)

# --- 3. TEST FUNCTION ---
if __name__ == "__main__":
    # We will pass the EXACT JSON output you just got from Agent 1
    sample_clean_data = """
    [
        {"merchant": "Dominos Pizza", "amount": -450.0, "category": "Food"},
        {"merchant": "Employer", "amount": 85000.0, "category": "Salary"},
        {"merchant": "Netflix", "amount": -649.0, "category": "Entertainment"},
        {"merchant": "Local Train", "amount": -15.0, "category": "Travel"},
        {"merchant": "Starbucks", "amount": -350.0, "category": "Food"},
        {"merchant": "Uber", "amount": -250.0, "category": "Travel"}
    ]
    """
    
    print("🧠 CFO is analyzing your finances using Gemini 3 Pro...")
    try:
        response = insights_agent.run(f"Analyze this financial data: {sample_clean_data}")
        
        # Print the structured result
        print(response.content.model_dump_json(indent=2))
    except Exception as e:
        print(f"Error: {e}")