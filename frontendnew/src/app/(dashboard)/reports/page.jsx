'use client';

import { useState, useEffect } from 'react';
// Using generic <a> tag for compilation safety
const Link = ({ href, children, ...props }) => <a href={href} {...props}>{children}</a>; 

import { 
  FileText, 
  BarChart2, 
  TrendingUp, 
  PieChart, 
  Scale, 
  CheckCircle, 
  XOctagon,
  Loader2,
  List,
  Mail
} from 'lucide-react';

// Default transaction structure expected from backend
const initialReportState = {
  transactions: [],
  income: 0,
  expenses: 0,
  balance: 0,
  count: 0,
};

// Mock data for the report cards
const reportTypes = [
  { title: "Net Balance Overview", icon: Scale, description: "Current total balance (Income - Expenses)." },
  { title: "Expense Category Breakdown", icon: PieChart, description: "Your spending split across food, housing, etc." },
  { title: "Income vs. Expense Trend", icon: BarChart2, description: "Monthly comparison of earnings against spending." },
  { title: "Budget Compliance Check", icon: CheckCircle, description: "Status of all active budget limits." },
  { title: "High-Value Transaction List", icon: List, description: "Review of all transactions above a certain threshold." },
  { title: "Saving Opportunities Insight", icon: TrendingUp, description: "AI-driven suggestions for potential savings." },
];

export default function ReportsPage() {
  const [reportData, setReportData] = useState(initialReportState);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReports = async () => {
      setLoading(true);
      setError(null);
      setReportData(initialReportState); // CRITICAL: Reset data before fetching

      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error("Authentication token missing. Please log in again.");

        // Fetch transactions (which includes income/expense totals)
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/transactions`, {
          headers: { 
            // CRITICAL FIX: Ensure the Bearer token is always sent
            'Authorization': `Bearer ${token}` 
          }
        });
        
        const data = await res.json();

        if (!res.ok) {
          // If the server sends a 401/403 (Unauthorized), it means the token is bad,
          // and we should NOT proceed with any data, even if the payload has an empty list.
          throw new Error(data.message || 'Access Denied. Token issue.');
        }

        // If data is successfully retrieved and authorized, set it.
        setReportData(data);
      } catch (err) {
        // If fetch or authorization fails, show error and leave data as initialReportState (empty)
        setError(err.message);
        console.error("Report Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  // Use the transactions array to check if a user has uploaded *any* data
  const hasData = reportData.transactions && reportData.transactions.length > 0;

  const handleSendEmail = () => {
    alert("Functionality to package and email the report content would be implemented here!");
  };

  return (
    <div className="space-y-10 relative z-10 w-full">
      
      {/* --- HEADER WITH EMAIL BUTTON --- */}
      <header className="mb-8 border-b border-slate-800/50 pb-4 flex items-center justify-between flex-wrap gap-4">
        {/* Title Group */}
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
            <FileText size={28} className="text-indigo-400" /> Financial Reports
          </h1>
          <p className="text-slate-400 mt-1 text-sm">Detailed analysis based on your recorded transactions.</p>
        </div>

        {/* Action Button (Top Right) */}
        {hasData && (
          <button
            onClick={handleSendEmail}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl transition-colors text-sm shadow-lg shadow-indigo-500/20"
          >
            <Mail size={18} /> Send Report
          </button>
        )}
      </header>
      {/* -------------------------------------- */}

      {loading && (
        <div className="flex justify-center py-20 text-slate-500">
          <Loader2 className="animate-spin mr-3"/> Generating reports...
        </div>
      )}

      {error && (
        <div className="bg-red-900/30 border border-red-800 text-red-300 p-4 rounded-xl flex items-center gap-3">
          <XOctagon size={20} />
          <p>Error: {error}</p>
        </div>
      )}

      {!loading && !error && !hasData && (
        // SHOWS IF USER HAS NO DATA
        <div className="text-center py-20 bg-slate-900/50 border border-slate-800 rounded-2xl">
          <h2 className="text-xl font-semibold text-slate-400">No Data to Generate Reports</h2>
          <p className="text-slate-500 mt-2">Please upload your first transaction or receipt to unlock this feature.</p>
          <Link href="/dashboard" className="mt-4 inline-flex items-center text-indigo-400 hover:text-indigo-300 underline">
            Go to Dashboard to Upload
          </Link>
        </div>
      )}

      {!loading && hasData && (
        // SHOWS IF USER HAS DATA
        <section className="space-y-8">
          
          {/* Summary Section (Dynamic Data) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <SummaryCard 
              title="Total Income" 
              value={`₹ ${reportData.income.toFixed(2)}`} 
              color="text-green-400"
            />
            <SummaryCard 
              title="Total Expenses" 
              value={`₹ ${reportData.expenses.toFixed(2)}`} 
              color="text-red-400"
            />
            <SummaryCard 
              title="Current Balance" 
              value={`₹ ${reportData.balance.toFixed(2)}`} 
              color={reportData.balance >= 0 ? "text-indigo-400" : "text-red-400"}
            />
          </div>

          {/* Reports List (Static Reports, Dynamic Data Descriptions) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reportTypes.map((report, index) => (
              <ReportItem 
                key={index}
                title={report.title}
                description={report.description}
                icon={report.icon}
                dynamicData={
                  report.title === "Net Balance Overview" 
                    ? `Balance is ₹ ${reportData.balance.toFixed(2)}.` 
                    : report.title === "Income vs. Expense Trend" 
                    ? `Income is ${((reportData.income / (reportData.income + reportData.expenses)) * 100).toFixed(1)}% of total flow.`
                    : "Data analysis needed."
                }
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

// Helper component for quick data summary
function SummaryCard({ title, value, color }) {
  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5 shadow-lg">
      <p className="text-sm text-slate-500">{title}</p>
      <h2 className={`text-2xl font-bold mt-1 ${color}`}>{value}</h2>
    </div>
  );
}

// Helper component for individual report items
function ReportItem({ title, description, icon: Icon, dynamicData }) {
  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 space-y-3 transition-all duration-300 hover:border-indigo-500/50 cursor-pointer">
      <div className="flex items-center gap-3">
        <Icon size={24} className="text-indigo-400" />
        <h3 className="text-lg font-semibold text-white">{title}</h3>
      </div>
      <p className="text-slate-500 text-sm">{description}</p>
      <div className="border-t border-slate-800 pt-3">
        <p className="text-xs text-indigo-300">Quick Insight:</p>
        <p className="text-sm text-white mt-1">{dynamicData}</p>
      </div>
    </div>
  );
}