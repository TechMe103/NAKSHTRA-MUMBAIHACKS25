import React, { useState, useEffect } from 'react';
import TreeVisualization from './TreeVisualization';
import { FinancialMetrics } from '@/types/financialHealth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, TrendingUp, TrendingDown, Leaf, Flower, Apple } from 'lucide-react';

interface FinancialHealthDashboardProps {
  userId: string;
  className?: string;
}

const FinancialHealthDashboard: React.FC<FinancialHealthDashboardProps> = ({
  userId,
  className = '',
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [treeState, setTreeState] = useState<any>(null);
  const [metrics, setMetrics] = useState<FinancialMetrics | null>(null);
  const [score, setScore] = useState<number>(0);

  // Mock data - Replace with actual API call
  const fetchFinancialData = async () => {
    try {
      setIsLoading(true);
      // TODO: Replace with actual API call
      // const response = await fetch(`/api/financial-health/${userId}`);
      // const data = await response.json();
      
      // Mock data for demonstration
      const mockData = {
        score: 75,
        tree_state: {
          trunk: {
            width: 55,
            health: 0.75,
          },
          branches: {
            length: 90,
            health: 0.9,
          },
          leaves: {
            count: 70,
            color: 'light-green',
            health: 0.85,
          },
          decorations: {
            has_flowers: true,
            has_fruits: false,
            is_growing: false,
            is_wilting: false,
            is_shaking: false,
          },
          score: 75,
          last_updated: new Date().toISOString(),
        },
        metrics: {
          income_stability: 25,
          income_expense_ratio: 1.1,
          savings_rate: 0.15,
          habit_score: 10,
        },
      };

      setTreeState(mockData.tree_state);
      setScore(mockData.score);
      setMetrics({
        income: 5000,
        expenses: 4500,
        savings: 750,
        bills_paid_on_time: 1.0, // 100%
        savings_streak_days: 14,
        unnecessary_spending: 0.15, // 15%
        avg_income_last_3_months: 4800,
        avg_expenses_last_3_months: 4600,
      });
      
    } catch (err) {
      console.error('Error fetching financial data:', err);
      setError('Failed to load financial data. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFinancialData();
    
    // Poll for updates every 5 minutes
    const interval = setInterval(fetchFinancialData, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, [userId]);

  const getFinancialStatus = (score: number) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Fair';
    return 'Needs Attention';
  };

  const getFinancialStatusColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-blue-600';
    if (score >= 40) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (isLoading) {
return (
  <>
  <div className={`space-y-4 ${className}`}>
    <Skeleton className="h-8 w-48" />
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Skeleton className="h-32" />
      <Skeleton className="h-32" />
      <Skeleton className="h-32" />
    </div>
    </div>  {/* This closing tag doesn't match the opening fragment */}
    <Skeleton className="h-96" />
  </div>    {/* This closing tag has no matching opening tag */}
  </>
);
  }

  if (error) {
    return (
      <Alert variant="destructive" className={className}>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Financial Health</h2>
        <p className="text-muted-foreground">
          Your financial health at a glance
        </p>
      </div>

      {/* Score and Status */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Financial Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">{score}</div>
            <div className={`text-sm mt-1 ${getFinancialStatusColor(score)}`}>
              {getFinancialStatus(score)}
            </div>
            <Progress value={score} className="h-2 mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
              <TrendingUp className="h-4 w-4 mr-2 text-green-600" />
              Income Stability
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {metrics ? (metrics.income / metrics.avg_income_last_3_months).toFixed(2) + 'x' : '--'}
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              vs 3-month average
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
              <TrendingDown className="h-4 w-4 mr-2 text-red-600" />
              Savings Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {metrics ? (metrics.savings / metrics.income * 100).toFixed(0) + '%' : '--'}
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              of income saved
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
              <Leaf className="h-4 w-4 mr-2 text-green-600" />
              Financial Habits
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <div className="flex-1">
                <div className="text-sm font-medium">
                  {metrics?.savings_streak_days || 0} day streak
                </div>
                <div className="text-xs text-muted-foreground">
                  {metrics?.bills_paid_on_time === 1 ? 'All bills paid' : 'Pending bills'}
                </div>
              </div>
              <div className="flex space-x-1">
                {metrics?.savings_rate >= 0.2 && (
                  <Flower className="h-5 w-5 text-pink-500" />
                )}
                {score >= 90 && (
                  <Apple className="h-5 w-5 text-orange-500" />
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tree Visualization */}
      <Card className="overflow-hidden
```
