'use client';

import { useState, useEffect } from 'react';
// Assuming Link is a global or automatically resolved React element/component in the sandbox environment
const Link = ({ href, children, ...props }) => <a href={href} {...props}>{children}</a>; 

import { 
  Mic, 
  MessageSquare, 
  FileText, 
  Mail, 
  Heart, 
  MessageCircle, 
  Plus,
  BarChart3,
  PieChart,
  LineChart,
  Loader2,
  UploadCloud
} from 'lucide-react';

// --- SUB-COMPONENTS ---

// AnalysisCard - Static, no hover effects as requested
function AnalysisCard({ icon: Icon, title, subtitle }) {
  return (
    <div className="aspect-video bg-slate-900/50 border border-slate-800 rounded-2xl p-6 flex flex-col items-center justify-center text-slate-500 transition-all cursor-default">
      <Icon size={48} strokeWidth={1} className="mb-4 opacity-50" />
      <span className="text-sm font-medium text-slate-400">{title}</span>
      <p className="text-xs text-slate-600 mt-2">{subtitle}</p>
    </div>
  );
}

// DockItem - White/light theme for the bottom bar
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
  const [hasData, setHasData] = useState(false); // <--- THE KEY LOGIC SWITCH
  const [uploadHover, setUploadHover] = useState(false);

  // 1. CHECK DATABASE FOR DOCUMENTS/TRANSACTIONS
  useEffect(() => {
    const checkUserStatus = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        // Fetch transactions to see if user is "active"
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/transactions`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (res.ok) {
          const data = await res.json();
          // LOGIC: If transactions exist, unlock the dashboard features
          if (data.count > 0 || (data.transactions && data.transactions.length > 0)) {
            setHasData(true);
          } else {
            setHasData(false);
          }
        }
      } catch (err) {
        console.error("Failed to check status", err);
      } finally {
        setLoading(false);
      }
    };

    checkUserStatus();
  }, []);

  // 2. MOCK UPLOAD HANDLER
  const handleUploadClick = () => {
    // In the future, this will open a Modal or navigate to an upload page
    const confirmUpload = window.confirm("Simulate uploading a file?\n(This will unlock the dashboard features)");
    
    if (confirmUpload) {
      // FOR DEMO: Manually set state to true to show the UI transition
      setHasData(true);
    }
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
        className="w-full max-w-xl mx-auto mt-8"
        onMouseEnter={() => setUploadHover(true)}
        onMouseLeave={() => setUploadHover(false)}
      >
        <button 
          onClick={handleUploadClick}
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
             <p className="text-slate-500 mt-1">PDF, PNG, JPG supported</p>
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
              {/* Graph 1 (Graphs in sketch) */}
              <AnalysisCard 
                icon={BarChart3} 
                title="Income vs Expense" 
                subtitle="Visual Graph"
              />

              {/* Graph 2 (Charts in sketch) */}
              <AnalysisCard 
                icon={PieChart} 
                title="Category Breakdown" 
                subtitle="Pie Chart"
              />

              {/* Graph 3 (Other insight in sketch) */}
              <AnalysisCard 
                icon={LineChart} 
                title="Spending Trends" 
                subtitle="Line Graph"
              />
           </div>
        </div>
      )}

      {/* --- 3. BOTTOM DOCK (CONDITIONAL) --- */}
      {hasData && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40 animate-in slide-in-from-bottom-12 fade-in duration-700 delay-200 w-full px-4 flex justify-center pointer-events-none">
          {/* White Dock Container */}
          <div className="bg-white border border-gray-300 shadow-2xl shadow-gray-800/20 rounded-2xl px-3 sm:px-6 py-3 flex items-center gap-2 sm:gap-4 md:gap-6 pointer-events-auto overflow-x-auto max-w-full no-scrollbar">
            
            <DockItem href="/voice-system" icon={Mic} label="Voice agent page" />
            <DockItem href="/chatbot" icon={MessageSquare} label="Chatbot page" />
            <DockItem href="/reports" icon={FileText} label="Reports page" />
            <DockItem href="/accounts" icon={Mail} label="Send email button" />
            <DockItem href="/habits" icon={Heart} label="Habit page" />
            <DockItem href="/feedback" icon={MessageCircle} label="Feedback page" />

          </div>
        </div>
      )}

      {/* --- NEW USER MESSAGE --- */}
      {!hasData && (
        <div className="text-center mt-12 opacity-50 animate-pulse">
           <p className="text-slate-500 italic">
             Upload your first document above to unlock Analysis and AI Features
           </p>
        </div>
      )}

    </div>
  );
}