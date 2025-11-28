from fastapi import APIRouter, HTTPException, Depends, status
from pydantic import BaseModel, Field
from typing import Optional, Dict, Any
from datetime import datetime
import logging
import sys
import os

# Add the parent directory to the Python path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from services.financial_health import FinancialHealthService, FinancialMetrics

router = APIRouter()
logger = logging.getLogger(__name__)

# In-memory storage for demonstration
# In a real application, use a database
financial_data_store: Dict[str, Any] = {}

class FinancialHealthRequest(BaseModel):
    user_id: str
    metrics: FinancialMetrics

class FinancialHealthResponse(BaseModel):
    score: float
    tree_state: Dict[str, Any]
    metrics: Dict[str, float]
    last_updated: str
    message: Optional[str] = None

@router.post("/analyze", response_model=FinancialHealthResponse)
async def analyze_financial_health(request: FinancialHealthRequest):
    """
    Analyze financial health and return the tree state and score
    """
    try:
        service = FinancialHealthService()
        
        # Get previous score if exists
        previous_score = None
        if request.user_id in financial_data_store:
            previous_data = financial_data_store[request.user_id]
            previous_score = previous_data.get('score')
        
        # Analyze financial health
        result = service.analyze_financial_health({
            'income': request.metrics.income,
            'expenses': request.metrics.expenses,
            'savings': request.metrics.savings,
            'bills_paid_on_time': request.metrics.bills_paid_on_time,
            'savings_streak_days': request.metrics.savings_streak_days,
            'unnecessary_spending': request.metrics.unnecessary_spending,
            'avg_income_last_3_months': request.metrics.avg_income_last_3_months,
            'avg_expenses_last_3_months': request.metrics.avg_expenses_last_3_months,
        })
        
        # Store the result
        financial_data_store[request.user_id] = {
            'score': result['score'],
            'metrics': request.metrics.dict(),
            'last_updated': datetime.utcnow().isoformat(),
            'tree_state': result['tree_state']
        }
        
        # Prepare response
        response = FinancialHealthResponse(
            score=result['score'],
            tree_state=result['tree_state'],
            metrics=result['metrics'],
            last_updated=datetime.utcnow().isoformat(),
            message="Financial health analyzed successfully"
        )
        
        return response
        
    except Exception as e:
        logger.error(f"Error analyzing financial health: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error analyzing financial health: {str(e)}"
        )

@router.get("/{user_id}", response_model=FinancialHealthResponse)
async def get_financial_health(user_id: str):
    """
    Get the latest financial health data for a user
    """
    try:
        if user_id not in financial_data_store:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="No financial data found for this user"
            )
            
        data = financial_data_store[user_id]
        
        return FinancialHealthResponse(
            score=data['score'],
            tree_state=data['tree_state'],
            metrics=data['metrics'],
            last_updated=data['last_updated'],
            message="Financial data retrieved successfully"
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error retrieving financial health data: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error retrieving financial health data: {str(e)}"
        )

# Register the router in your FastAPI app
# from fastapi import FastAPI
# app = FastAPI()
# app.include_router(router, prefix="/api/financial-health", tags=["Financial Health"])
