from typing import Dict, Any, Optional
from datetime import datetime, timedelta
from dataclasses import dataclass
import math

@dataclass
class FinancialMetrics:
    income: float
    expenses: float
    savings: float
    bills_paid_on_time: float  # percentage
    savings_streak_days: int
    unnecessary_spending: float  # percentage
    avg_income_last_3_months: float
    avg_expenses_last_3_months: float

class FinancialHealthAnalyzer:
    @staticmethod
    def calculate_income_stability(income: float, avg_income_3m: float) -> float:
        """Calculate income stability score (0-30)"""
        if avg_income_3m == 0:
            return 30.0 if income > 0 else 0.0
        income_stability = (income / avg_income_3m) * 30
        return min(income_stability, 30.0)

    @staticmethod
    def calculate_income_expense_score(income: float, expenses: float) -> float:
        """Calculate income-expense ratio score (0-30)"""
        if income == 0:
            return 0.0
            
        ratio = income / expenses if expenses > 0 else float('inf')
        
        if ratio >= 1.2:
            return 30.0
        elif ratio >= 1.0:
            return 25.0
        elif ratio >= 0.8:
            return 15.0
        else:
            return 0.0

    @staticmethod
    def calculate_savings_score(income: float, savings: float) -> float:
        """Calculate savings score (0-25)"""
        if income == 0:
            return 0.0
            
        savings_rate = savings / income
        
        if savings_rate >= 0.20:
            return 25.0
        elif savings_rate >= 0.10:
            return 20.0
        elif savings_rate >= 0.05:
            return 10.0
        else:
            return 0.0

    @staticmethod
    def calculate_habit_score(
        bills_paid_on_time: float,
        savings_streak_days: int,
        unnecessary_spending: float
    ) -> float:
        """Calculate habit score (0-15)"""
        score = 0.0
        
        if bills_paid_on_time >= 0.8:
            score += 5.0
            
        if savings_streak_days >= 7:
            score += 5.0
            
        if unnecessary_spending < 0.2:
            score += 5.0
            
        return score

    @classmethod
    def calculate_financial_score(cls, metrics: FinancialMetrics) -> float:
        """Calculate overall financial health score (0-100)"""
        income_stability = cls.calculate_income_stability(
            metrics.income, metrics.avg_income_last_3_months
        )
        
        income_expense = cls.calculate_income_expense_score(
            metrics.income, metrics.expenses
        )
        
        savings = cls.calculate_savings_score(
            metrics.income, metrics.savings
        )
        
        habits = cls.calculate_habit_score(
            metrics.bills_paid_on_time,
            metrics.savings_streak_days,
            metrics.unnecessary_spending
        )
        
        total_score = income_stability + income_expense + savings + habits
        return min(max(total_score, 0), 100)


class TreeStateGenerator:
    @staticmethod
    def get_trunk_width(score: float) -> float:
        """Convert financial score to trunk width (25-70)"""
        if score >= 80:
            return 70.0
        elif score >= 60:
            return 55.0
        elif score >= 40:
            return 40.0
        else:
            return 25.0

    @staticmethod
    def get_branch_length(income: float, expenses: float, base_length: float = 100.0) -> float:
        """Calculate branch length based on income/expense ratio"""
        if expenses == 0:
            return base_length
        ratio = income / expenses
        return min(base_length * ratio, base_length)

    @staticmethod
    def get_leaf_count(savings_rate: float) -> int:
        """Calculate number of leaves based on savings rate"""
        count = int(savings_rate * 100)
        return max(10, min(count, 100))

    @staticmethod
    def get_leaf_color(income: float, expenses: float) -> str:
        """Determine leaf color based on income-expense ratio"""
        if expenses == 0:
            return 'green'
            
        ratio = income / expenses
        if ratio >= 1.2:
            return 'green'
        elif ratio >= 1.0:
            return 'light-green'
        elif ratio >= 0.8:
            return 'yellow'
        else:
            return 'red'

    @classmethod
    def generate_tree_state(cls, metrics: FinancialMetrics, score: float) -> Dict[str, Any]:
        """Generate complete tree state based on financial metrics"""
        savings_rate = metrics.savings / metrics.income if metrics.income > 0 else 0
        
        return {
            'trunk': {
                'width': cls.get_trunk_width(score),
                'health': score / 100.0
            },
            'branches': {
                'length': cls.get_branch_length(metrics.income, metrics.expenses),
                'health': min(metrics.income / metrics.expenses, 1.0) if metrics.expenses > 0 else 1.0
            },
            'leaves': {
                'count': cls.get_leaf_count(savings_rate),
                'color': cls.get_leaf_color(metrics.income, metrics.expenses),
                'health': min(metrics.income / metrics.expenses, 1.5) if metrics.expenses > 0 else 1.5
            },
            'decorations': {
                'has_flowers': savings_rate >= 0.20,
                'has_fruits': score >= 90,
                'is_growing': False,  # Will be set by animation system
                'is_wilting': False  # Will be set by animation system
            },
            'score': score,
            'last_updated': datetime.utcnow().isoformat()
        }


class FinancialHealthService:
    def __init__(self):
        self.analyzer = FinancialHealthAnalyzer()
        self.tree_generator = TreeStateGenerator()
        self.previous_score = None
        self.last_updated = None

    def analyze_financial_health(self, metrics: Dict[str, Any]) -> Dict[str, Any]:
        """Main entry point to analyze financial health and generate tree state"""
        # Convert input to FinancialMetrics
        financial_metrics = FinancialMetrics(**metrics)
        
        # Calculate financial score
        current_score = self.analyzer.calculate_financial_score(financial_metrics)
        
        # Generate tree state
        tree_state = self.tree_generator.generate_tree_state(financial_metrics, current_score)
        
        # Check for significant changes for animations
        if self.previous_score is not None:
            score_diff = current_score - self.previous_score
            
            # Update animation states based on score changes
            tree_state['decorations']['is_growing'] = score_diff >= 10
            tree_state['decorations']['is_wilting'] = score_diff <= -10
            
            # Check for expense surges
            if (financial_metrics.expenses > 
                financial_metrics.avg_expenses_last_3_months * 1.5):
                tree_state['decorations']['is_shaking'] = True
                
            # Check for broken savings streak
            if financial_metrics.savings_streak_days == 0:
                tree_state['decorations']['is_wilting'] = True
        
        # Update previous score and timestamp
        self.previous_score = current_score
        self.last_updated = datetime.utcnow()
        
        return {
            'score': current_score,
            'tree_state': tree_state,
            'metrics': {
                'income_stability': self.analyzer.calculate_income_stability(
                    financial_metrics.income, 
                    financial_metrics.avg_income_last_3_months
                ),
                'income_expense_ratio': financial_metrics.income / financial_metrics.expenses 
                    if financial_metrics.expenses > 0 else float('inf'),
                'savings_rate': (financial_metrics.savings / financial_metrics.income 
                    if financial_metrics.income > 0 else 0.0),
                'habit_score': self.analyzer.calculate_habit_score(
                    financial_metrics.bills_paid_on_time,
                    financial_metrics.savings_streak_days,
                    financial_metrics.unnecessary_spending
                )
            },
            'last_updated': self.last_updated.isoformat()
        }
