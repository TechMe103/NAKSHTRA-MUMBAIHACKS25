from phi.agent import Agent                # Changed from agno.agent
from phi.model.google import Gemini        # Changed from agno.models.google
from pydantic import BaseModel, Field
from typing import List
import json
import os
from dotenv import load_dotenv
load_dotenv()

# --- 1. MONGODB TARGET SCHEMA ---
# This is exactly how the data will look inside your MongoDB "transactions" collection
class MongoTransaction(BaseModel):
    merchant: str = Field(..., description="The clean name of the place (e.g., 'Starbucks').")
    amount: float = Field(..., description="The numeric amount. Negative for expense, Positive for income.")
    category: str = Field(..., description="One of: Food, Travel, Bills, Salary, Shopping, Entertainment, Investment.")
    payment_method: str = Field(..., description="UPI, Card, Netbanking, or Cash.")
    flagged: bool = Field(False, description="True if the transaction looks suspicious or very high.")
    summary: str = Field(..., description="A short 3-word summary of the transaction.")

class TransactionList(BaseModel):
    transactions: List[MongoTransaction]

# --- 2. THE AGENT ---
cleaner_agent = Agent(
    name="Data Cleaner",
    model=Gemini(id="gemini-2.5-flash", api_key=os.getenv("GOOGLE_API_KEY")),
    description="You are a data normalization engine for a MongoDB database.",
    instructions=[
        "You will receive raw transaction text strings.",
        "Extract the merchant, amount, and payment method.",
        "Categorize the transaction intelligently.",
        "Detect if the transaction is 'Income' (Salary/Credit) or 'Expense'.",
        "If the text is messy (e.g., 'UPI-4392-UBER-MUM'), clean it to 'Uber'.",
        "Return ONLY the JSON list matching the MongoTransaction schema."
    ],
    response_model=TransactionList,
    markdown=False
)

# --- 3. API FUNCTION ---
def clean_and_structure_data(raw_text_data: str):
    try:
        # We pass the raw string to the Agent
        response = cleaner_agent.run(f"Clean and structure this data for MongoDB: {raw_text_data}")
        
        # Return valid JSON string
        return response.content.model_dump_json()
    except Exception as e:
        return json.dumps({"error": str(e)})

# --- 4. TEST (Simulating generic data) ---
if __name__ == "__main__":
    # Simulate raw data coming from a CSV upload or User Input
    messy_inputs = """
    1. 2024-11-20 | UPI/29384/DOMINOS PIZZA | -450.00
    2. 2024-11-21 | ACH CR SALARY CRED | +85000.00
    3. 2024-11-22 | NETFLIX.COM / MUMBAI | -649.00
    4. 2024-11-23 | LOCAL TRAIN TICKET UTS | -15.00
    """

    print("Checking Raw Data...")
    print(messy_inputs)
    print("\n---------\n")
    print("🤖 Agent is creating MongoDB Documents...")
    
    clean_json = clean_and_structure_data(messy_inputs)
    
    # Pretty print the result
    parsed = json.loads(clean_json)
    print(json.dumps(parsed, indent=2))