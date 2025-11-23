import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';

// Types
export interface Transaction {
  id: string;
  title: string;
  amount: number;
  category: string;
  date: string;
  type: 'income' | 'expense';
}

export interface Budget {
  id: string;
  category: string;
  limit: number;
  spent: number;
}

export interface Insight {
  id: string;
  title: string;
  description: string;
  date: string;
}

export interface Notification {
  id: string;
  message: string;
  date: string;
  read: boolean;
}

export interface LinkedAccount {
  id: string;
  bankName: string;
  accountType: string;
  lastSynced: string;
  balance: number;
}

export interface UserProfile {
  fullName: string;
  email: string;
  currency: string;
}

interface DataState {
  transactions: Transaction[];
  budgets: Budget[];
  insights: Insight[];
  notifications: Notification[];
  linkedAccounts: LinkedAccount[];
  profile: UserProfile;
}

type Action =
  | { type: 'ADD_TRANSACTION'; payload: Transaction }
  | { type: 'UPDATE_TRANSACTION'; payload: Transaction }
  | { type: 'DELETE_TRANSACTION'; payload: string }
  | { type: 'ADD_BUDGET'; payload: Budget }
  | { type: 'UPDATE_BUDGET'; payload: Budget }
  | { type: 'DELETE_BUDGET'; payload: string }
  | { type: 'ADD_INSIGHT'; payload: Insight }
  | { type: 'UPDATE_INSIGHT'; payload: Insight }
  | { type: 'DELETE_INSIGHT'; payload: string }
  | { type: 'ADD_NOTIFICATION'; payload: Notification }
  | { type: 'UPDATE_NOTIFICATION'; payload: Notification }
  | { type: 'DELETE_NOTIFICATION'; payload: string }
  | { type: 'MARK_NOTIFICATIONS_READ'; payload: string[] }
  | { type: 'ADD_ACCOUNT'; payload: LinkedAccount }
  | { type: 'UPDATE_ACCOUNT'; payload: LinkedAccount }
  | { type: 'DELETE_ACCOUNT'; payload: string }
  | { type: 'UPDATE_PROFILE'; payload: Partial<UserProfile> }
  | { type: 'INIT_STATE'; payload: DataState };

const initialState: DataState = {
  transactions: [],
  budgets: [],
  insights: [],
  notifications: [],
  linkedAccounts: [],
  profile: {
    fullName: 'John Doe',
    email: 'john@finadapt.com',
    currency: 'USD',
  },
};

// Seed data
const seedData: DataState = {
  transactions: [
    { id: '1', title: 'Salary', amount: 5000, category: 'Income', date: '2025-01-15', type: 'income' },
    { id: '2', title: 'Groceries', amount: 150, category: 'Food', date: '2025-01-18', type: 'expense' },
    { id: '3', title: 'Rent', amount: 1200, category: 'Housing', date: '2025-01-01', type: 'expense' },
    { id: '4', title: 'Freelance Project', amount: 800, category: 'Income', date: '2025-01-20', type: 'income' },
    { id: '5', title: 'Utilities', amount: 120, category: 'Bills', date: '2025-01-05', type: 'expense' },
    { id: '6', title: 'Coffee', amount: 25, category: 'Food', date: '2025-01-22', type: 'expense' },
    { id: '7', title: 'Gym Membership', amount: 50, category: 'Health', date: '2025-01-10', type: 'expense' },
  ],
  budgets: [
    { id: '1', category: 'Food', limit: 500, spent: 175 },
    { id: '2', category: 'Housing', limit: 1500, spent: 1200 },
    { id: '3', category: 'Bills', limit: 300, spent: 120 },
    { id: '4', category: 'Health', limit: 200, spent: 50 },
    { id: '5', category: 'Entertainment', limit: 250, spent: 0 },
  ],
  insights: [
    { id: '1', title: 'Spending Alert', description: 'Food spending increased by 20% this month', date: '2025-01-22' },
    { id: '2', title: 'Budget Achievement', description: 'You stayed within your Bills budget!', date: '2025-01-20' },
    { id: '3', title: 'Income Growth', description: 'Your income is 15% higher than last month', date: '2025-01-18' },
  ],
  notifications: [
    { id: '1', message: 'New transaction: Salary credited', date: '2025-01-15', read: false },
    { id: '2', message: 'Budget alert: Food budget at 80%', date: '2025-01-22', read: false },
    { id: '3', message: 'Account synced successfully', date: '2025-01-10', read: true },
  ],
  linkedAccounts: [
    { id: '1', bankName: 'Chase Bank', accountType: 'Checking', lastSynced: '2025-01-22', balance: 3500 },
    { id: '2', bankName: 'Wells Fargo', accountType: 'Savings', lastSynced: '2025-01-20', balance: 15000 },
    { id: '3', bankName: 'Capital One', accountType: 'Credit Card', lastSynced: '2025-01-21', balance: -450 },
  ],
  profile: {
    fullName: 'John Doe',
    email: 'john@finadapt.com',
    currency: 'USD',
  },
};

function dataReducer(state: DataState, action: Action): DataState {
  switch (action.type) {
    case 'INIT_STATE':
      return action.payload;

    case 'ADD_TRANSACTION':
      return { ...state, transactions: [...state.transactions, action.payload] };
    case 'UPDATE_TRANSACTION':
      return {
        ...state,
        transactions: state.transactions.map((t) => (t.id === action.payload.id ? action.payload : t)),
      };
    case 'DELETE_TRANSACTION':
      return { ...state, transactions: state.transactions.filter((t) => t.id !== action.payload) };

    case 'ADD_BUDGET':
      return { ...state, budgets: [...state.budgets, action.payload] };
    case 'UPDATE_BUDGET':
      return { ...state, budgets: state.budgets.map((b) => (b.id === action.payload.id ? action.payload : b)) };
    case 'DELETE_BUDGET':
      return { ...state, budgets: state.budgets.filter((b) => b.id !== action.payload) };

    case 'ADD_INSIGHT':
      return { ...state, insights: [...state.insights, action.payload] };
    case 'UPDATE_INSIGHT':
      return { ...state, insights: state.insights.map((i) => (i.id === action.payload.id ? action.payload : i)) };
    case 'DELETE_INSIGHT':
      return { ...state, insights: state.insights.filter((i) => i.id !== action.payload) };

    case 'ADD_NOTIFICATION':
      return { ...state, notifications: [...state.notifications, action.payload] };
    case 'UPDATE_NOTIFICATION':
      return {
        ...state,
        notifications: state.notifications.map((n) => (n.id === action.payload.id ? action.payload : n)),
      };
    case 'DELETE_NOTIFICATION':
      return { ...state, notifications: state.notifications.filter((n) => n.id !== action.payload) };
    case 'MARK_NOTIFICATIONS_READ':
      return {
        ...state,
        notifications: state.notifications.map((n) =>
          action.payload.includes(n.id) ? { ...n, read: true } : n
        ),
      };

    case 'ADD_ACCOUNT':
      return { ...state, linkedAccounts: [...state.linkedAccounts, action.payload] };
    case 'UPDATE_ACCOUNT':
      return {
        ...state,
        linkedAccounts: state.linkedAccounts.map((a) => (a.id === action.payload.id ? action.payload : a)),
      };
    case 'DELETE_ACCOUNT':
      return { ...state, linkedAccounts: state.linkedAccounts.filter((a) => a.id !== action.payload) };

    case 'UPDATE_PROFILE':
      return { ...state, profile: { ...state.profile, ...action.payload } };

    default:
      return state;
  }
}

interface DataContextType {
  state: DataState;
  dispatch: React.Dispatch<Action>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: ReactNode }) {
  const [persistedState, setPersistedState] = useLocalStorage<DataState>('finadapt-data', seedData);
  const [state, dispatch] = useReducer(dataReducer, persistedState);

  // Sync state to localStorage
  useEffect(() => {
    setPersistedState(state);
  }, [state, setPersistedState]);

  // Update budget spent amounts when transactions change
  useEffect(() => {
    const updatedBudgets = state.budgets.map((budget) => {
      const spent = state.transactions
        .filter((t) => t.type === 'expense' && t.category === budget.category)
        .reduce((sum, t) => sum + t.amount, 0);
      return { ...budget, spent };
    });

    const needsUpdate = updatedBudgets.some((b, i) => b.spent !== state.budgets[i].spent);
    if (needsUpdate) {
      updatedBudgets.forEach((budget) => {
        dispatch({ type: 'UPDATE_BUDGET', payload: budget });
      });
    }
  }, [state.transactions]); // Only depend on transactions

  return <DataContext.Provider value={{ state, dispatch }}>{children}</DataContext.Provider>;
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within DataProvider');
  }
  return context;
}
