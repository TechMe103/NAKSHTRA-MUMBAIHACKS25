'use client';

import { useState, useEffect } from 'react';
// Using generic <a> tag for compilation safety in the sandbox
const Link = ({ href, children, ...props }) => <a href={href} {...props}>{children}</a>; 

import { 
  Mic, 
  MessageSquare, 
  FileText, 
  Heart, 
  MessageCircle, 
  Plus,
  BarChart3,
  PieChart,
  LineChart,
  Loader2,
  UploadCloud,
  X,
  Send
} from 'lucide-react';

// TRANSACTION VALIDATION LISTS (from your models/validation)
const TRANSACTION_CATEGORIES = ["income", "food", "housing", "bills", "health"];
const TRANSACTION_TYPES = ["income", "expense"];

// --- SUB-COMPONENTS (Skipped for brevity) ---
// ... (AnalysisCard, DockItem components remain the same)

function AnalysisCard({ icon: Icon, title, subtitle }) {
  return (
    <div className="aspect-video bg-slate-900/50 border border-slate-800 rounded-2xl p-6 flex flex-col items-center justify-center text-slate-500 transition-all cursor-default">
      <Icon size={48} strokeWidth={1} className="mb-4 opacity-50" />
      <span className="text-sm font-medium text-slate-400">{title}</span>
      <p className="text-xs text-slate-600 mt-2">{subtitle}</p>
    </div>
  );
}

function DockItem({ href, icon: Icon, label }) {
  return (
    <Link 
      href={href}
      className="group relative flex flex-col items-center justify-center min-w-[3rem] w-12 h-12 sm:w-14 sm:h-14 rounded-xl hover:bg-slate-200 text-slate-600 hover:text-indigo-600 transition-all duration-200 hover:-translate-y-1"
      title={label}
    >
      <Icon size={24} />
      <span className="absolute -top-10 scale-0 group-hover:scale-100 transition-transform bg-white text-slate-800 text-[10px] px-2 py-1 rounded shadow-lg whitespace-nowrap pointer-events-none">
        {label}
      </span>
    </Link>
  );
}


export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [hasData, setHasData] = useState(false);
  const [uploadHover, setUploadHover] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false); // New state for modal

  // Transaction form state for the modal
  const [transactionForm, setTransactionForm] = useState({
    title: 'New Transaction',
    amount: 100,
    type: TRANSACTION_TYPES[1], // 'expense'
    category: TRANSACTION_CATEGORIES[1], // 'food'
    date: new Date().toISOString().substring(0, 10), // Current date in YYYY-MM-DD format
    description: ''
  });
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState(null);


  // 1. CHECK DATABASE FOR DOCUMENTS/TRANSACTIONS
  useEffect(() => {
    const checkUserStatus = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/transactions`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        const data = await res.json();

        if (res.ok && (data.count > 0 || (data.transactions && data.transactions.length > 0))) {
          setHasData(true);
        } else {
          setHasData(false);
        }

      } catch (err) {
        console.error("Failed to check status", err);
        setHasData(false);
      } finally {
        setLoading(false);
      }
    };

    checkUserStatus();
  }, []);

  // 2. REAL TRANSACTION SUBMISSION LOGIC (for the modal)
  const handleTransactionSubmit = async (e) => {
    e.preventDefault();
    setModalLoading(true);
    setModalError(null);

    // Minor validation check
    if (transactionForm.amount <= 0) {
      setModalError("Amount must be greater than zero.");
      setModalLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/transactions`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify(transactionForm),
      });

      const data = await res.json();

      if (!res.ok) {
        // Handle backend validation errors (e.g., missing title)
        setModalError(data.message || (data.errors && data.errors[0].msg) || "Transaction submission failed.");
        throw new Error("Submission failed.");
      }

      // SUCCESS: Close modal, set hasData to true
      setIsModalOpen(false);
      setHasData(true); 
      setTransactionForm({
        title: 'New Transaction',
        amount: 100,
        type: TRANSACTION_TYPES[1],
        category: TRANSACTION_CATEGORIES[1],
        date: new Date().toISOString().substring(0, 10),
        description: ''
      });

    } catch (err) {
      console.error("Transaction Error:", err);
      // If modalError was already set by the response handler, use that.
      if (!modalError) setModalError("Network error or invalid data sent.");
    } finally {
      setModalLoading(false);
    }
  };

  const handleFormChange = (e) => {
    setTransactionForm({ ...transactionForm, [e.target.name]: e.target.value });
  };


  if (loading) {
    return (
      <div className="flex h-[50vh] w-full items-center justify-center text-slate-500">
        <Loader2 className="animate-spin mr-2"/> Checking records...
      </div>
    );
  }

  return (
    <div className="space-y-12 relative z-10 animate-in fade-in duration-500">
      
      {/* --- 1. UPLOAD AREA (ALWAYS VISIBLE) --- */}
      <div 
        className="w-full max-w-3xl mx-auto mt-8"
        onMouseEnter={() => setUploadHover(true)}
        onMouseLeave={() => setUploadHover(false)}
      >
        <button 
          onClick={() => setIsModalOpen(true)} // Open the modal on click
          className={`w-full h-48 border-2 border-dashed rounded-3xl flex flex-col items-center justify-center gap-4 transition-all duration-300 group ${
            uploadHover 
              ? 'border-indigo-500 bg-indigo-500/5 shadow-lg shadow-indigo-500/10' 
              : 'border-slate-700 bg-slate-900/30'
          }`}
        >
          <div className={`p-4 rounded-full transition-colors ${uploadHover ? 'bg-indigo-500 text-white' : 'bg-slate-800 text-slate-400'}`}>
            {uploadHover ? <UploadCloud size={32} /> : <Plus size={32} />}
          </div>
          <div className="text-center">
             <h2 className={`text-xl font-semibold transition-colors ${uploadHover ? 'text-white' : 'text-slate-300'}`}>
               UPLOAD TRANSACTIONS / RECEIPTS
             </h2>
             <p className="text-slate-500 mt-1">Click to manually add a transaction</p>
          </div>
        </button>
      </div>


      {/* --- 2. ANALYSIS SECTION (CONDITIONAL) --- */}
      {hasData && (
        <div className="animate-in slide-in-from-bottom-8 fade-in duration-700">
           <div className="flex items-center gap-4 mb-6">
             <h3 className="text-lg font-semibold text-slate-400 uppercase tracking-wider">Analysis</h3>
             <div className="h-[1px] flex-1 bg-slate-800"></div>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <AnalysisCard icon={BarChart3} title="Income vs Expense" subtitle="Visual Graph" />
              <AnalysisCard icon={PieChart} title="Category Breakdown" subtitle="Pie Chart" />
              <AnalysisCard icon={LineChart} title="Spending Trends" subtitle="Line Graph" />
           </div>
        </div>
      )}

      {/* --- 3. BOTTOM DOCK (CONDITIONAL) --- */}
      {hasData && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40 animate-in slide-in-from-bottom-12 fade-in duration-700 delay-200 w-full px-4 flex justify-center pointer-events-none">
          <div className="bg-white border border-gray-300 shadow-2xl shadow-gray-800/20 rounded-2xl px-3 sm:px-6 py-3 flex items-center gap-2 sm:gap-4 md:gap-6 pointer-events-auto overflow-x-auto max-w-full no-scrollbar">
            
            <DockItem href="/voice-system" icon={Mic} label="Voice agent page" />
            <DockItem href="/chatbot" icon={MessageSquare} label="Chatbot page" />
            <DockItem href="/reports" icon={FileText} label="Reports page" />
            <DockItem href="/habits" icon={Heart} label="Habit page" />
            <DockItem href="/feedback" icon={MessageCircle} label="Feedback page" />

          </div>
        </div>
      )}

      {/* --- NEW USER MESSAGE --- */}
      {!hasData && (
        <div className="text-center mt-12 opacity-50 animate-pulse">
           <p className="text-slate-500 italic">
             Upload your first transaction to unlock Analysis and AI Features
           </p>
        </div>
      )}

      {/* --- TRANSACTION MODAL --- */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4 transition-opacity duration-300 animate-in fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 w-full max-w-md animate-in zoom-in-95 duration-300">
            <div className="flex justify-between items-center pb-4 border-b border-slate-800">
              <h2 className="text-xl font-bold text-white">Add New Transaction</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleTransactionSubmit} className="mt-6 space-y-4">
              
              {modalError && (
                <div className="p-3 bg-red-900/30 border border-red-800 text-red-300 rounded-lg text-sm">
                  {modalError}
                </div>
              )}

              {/* Type (Income/Expense) */}
              <div>
                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-1">Type</label>
                <select 
                  name="type" 
                  value={transactionForm.type} 
                  onChange={handleFormChange}
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white transition-all"
                >
                  {TRANSACTION_TYPES.map(type => (
                    <option key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</option>
                  ))}
                </select>
              </div>

              {/* Title */}
              <div>
                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-1">Title</label>
                <input 
                  type="text" 
                  name="title" 
                  value={transactionForm.title} 
                  onChange={handleFormChange}
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white transition-all"
                  placeholder="e.g., Grocery Shopping"
                  required
                />
              </div>

              {/* Amount */}
              <div>
                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-1">Amount (₹)</label>
                <input 
                  type="number" 
                  name="amount" 
                  value={transactionForm.amount} 
                  onChange={handleFormChange}
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white transition-all"
                  min="0.01"
                  step="0.01"
                  required
                />
              </div>

              {/* Category */}
              <div>
                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-1">Category</label>
                <select 
                  name="category" 
                  value={transactionForm.category} 
                  onChange={handleFormChange}
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white transition-all"
                >
                  {TRANSACTION_CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
                  ))}
                </select>
              </div>

              {/* Date */}
              <div>
                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-1">Date</label>
                <input 
                  type="date" 
                  name="date" 
                  value={transactionForm.date} 
                  onChange={handleFormChange}
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white transition-all"
                  required
                />
              </div>
              
              {/* Description (Optional) */}
              <div>
                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-1">Description (Optional)</label>
                <textarea
                  name="description"
                  value={transactionForm.description} 
                  onChange={handleFormChange}
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white transition-all"
                  rows="2"
                />
              </div>


              <button 
                type="submit"
                disabled={modalLoading}
                className={`w-full flex items-center justify-center gap-2 py-3 px-4 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg ${
                  modalLoading 
                    ? 'bg-indigo-700 opacity-70 cursor-not-allowed' 
                    : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-500/20 hover:shadow-indigo-500/40'
                }`}
              >
                {modalLoading ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
                {modalLoading ? 'Saving...' : 'Save Transaction'}
              </button>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}