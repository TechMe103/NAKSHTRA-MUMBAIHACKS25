import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { DataProvider } from "@/contexts/DataContext";
import { Sidebar } from "@/components/Sidebar";
import { Topbar } from "@/components/Topbar";
import ExpertAdvice from "./pages/ExpertAdvice";
import BehavioralAnalysis from "./pages/BehaviouralAnalysis";
import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";
import Transactions from "./pages/Transactions";
import Budgets from "./pages/Budgets";
import Insights from "./pages/Insights";
import Notifications from "./pages/Notifications";
import LinkedAccounts from "./pages/LinkedAccounts";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import LoginPage from "./components/ui/loginPage";
import SignUp from "./components/ui/signUp";
import FinancialCoach from "./pages/FinancialCoach";
const queryClient = new QueryClient();

const DashboardLayout = ({ children }: { children: React.ReactNode }) => (
  <div className="flex min-h-screen w-full bg-background">
    <Sidebar />
    <div className="flex-1 ml-64">
      <Topbar />
      <main className="min-h-[calc(100vh-64px)]">{children}</main>
    </div>
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <DataProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/financial-coach" element={<FinancialCoach />} />
            <Route path="/expert-advice" element={<ExpertAdvice />} />
            <Route path="/behavioral-analysis" element={<BehavioralAnalysis />} />
            <Route path="/dashboard" element={<DashboardLayout><Dashboard /></DashboardLayout>} />
            <Route path="/transactions" element={<DashboardLayout><Transactions /></DashboardLayout>} />
            <Route path="/budgets" element={<DashboardLayout><Budgets /></DashboardLayout>} />
            <Route path="/insights" element={<DashboardLayout><Insights /></DashboardLayout>} />
            <Route path="/notifications" element={<DashboardLayout><Notifications /></DashboardLayout>} />
            <Route path="/linked-accounts" element={<DashboardLayout><LinkedAccounts /></DashboardLayout>} />
            <Route path="/profile" element={<DashboardLayout><Profile /></DashboardLayout>} />
            <Route path="/login" element={<LoginPage/>} />
            <Route path="/signup" element={<SignUp/>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </DataProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
