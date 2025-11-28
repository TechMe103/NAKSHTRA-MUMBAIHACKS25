export interface FinancialMetrics {
  income: number;
  expenses: number;
  savings: number;
  bills_paid_on_time: number; // percentage (0-1)
  savings_streak_days: number;
  unnecessary_spending: number; // percentage (0-1)
  avg_income_last_3_months: number;
  avg_expenses_last_3_months: number;
}

export interface TreeState {
  trunk: {
    width: number;
    health: number;
  };
  branches: {
    length: number;
    health: number;
  };
  leaves: {
    count: number;
    color: 'green' | 'light-green' | 'yellow' | 'red';
    health: number;
  };
  decorations: {
    has_flowers: boolean;
    has_fruits: boolean;
    is_growing: boolean;
    is_wilting: boolean;
    is_shaking?: boolean;
  };
  score: number;
  last_updated: string;
}

export interface FinancialHealthResponse {
  score: number;
  tree_state: TreeState;
  metrics: {
    income_stability: number;
    income_expense_ratio: number;
    savings_rate: number;
    habit_score: number;
  };
  last_updated: string;
}

export interface FinancialHealthUpdate {
  userId: string;
  metrics: FinancialMetrics;
  previousScore?: number;
}
