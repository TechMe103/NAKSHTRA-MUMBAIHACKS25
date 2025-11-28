'use client';

import { useState, useEffect, useRef } from 'react';
import { aiService } from '@/lib/aiService'; 
import ReactMarkdown from 'react-markdown'; 
import { 
  Mic, MessageSquare, FileText, Mail, Heart, MessageCircle, 
  Plus, BarChart3, PieChart, Loader2, UploadCloud 
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart as RechartsPieChart, Pie, Cell, LineChart, Line, Area, AreaChart
} from 'recharts';

// Link Component Helper
const LinkComponent = ({ href, children, ...props }) => <a href={href} {...props}>{children}</a>; 

// --- DUMMY DATA FOR CHARTS (Visuals only) ---
const incomeData = [
  { name: 'Jan', Income: 4000, Expense: 2400 },
  { name: 'Feb', Income: 3000, Expense: 1398 },
  { name: 'Mar', Income: 2000, Expense: 4800 },
  { name: 'Apr', Income: 2780, Expense: 3908 },
  { name: 'May', Income: 1890, Expense: 2800 },
  { name: 'Jun', Income: 2390, Expense: 2500 },
];

const categoryData = [
  { name: 'Food', value: 400 },
  { name: 'Travel', value: 300 },
  { name: 'Bills', value: 300 },
  { name: 'Ent.', value: 200 },
];
const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f43f5e'];

const trendData = [
  { day: '1', spend: 100 },
  { day: '5', spend: 230 },
  { day: '10', spend: 50 },
  { day: '15', spend: 400 },
  { day: '20', spend: 120 },
  { day: '25', spend: 300 },
  { day: '30', spend: 180 },
];

// --- SUB-COMPONENTS ---
function ChartCard({ title, children }) {
  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-4 flex flex-col h-[300px]">
      <h3 className="text-sm font-medium text-slate-400 mb-4 uppercase tracking-wider">{title}</h3>
      <div className="flex-1 w-full min-h-0">
        {children}
      </div>
    </div>
  );
}

function DockItem({ href, icon: Icon, label }) {
  return (
    <LinkComponent 
      href={href}
      className="group relative flex flex-col items-center justify-center min-w-[3rem] w-12 h-12 sm:w-14 sm:h-14 rounded-xl hover:bg-slate-200 text-slate-600 hover:text-indigo-600 transition-all duration-200 hover:-translate-y-1"
      title={label}
    >
      <Icon size={24} />
      <span className="absolute -top-10 scale-0 group-hover:scale-100 transition-transform bg-white text-slate-800 text-[10px] px-2 py-1 rounded shadow-lg whitespace-nowrap pointer-events-none">
        {label}
      </span>
    </LinkComponent>
  );
}

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [hasData, setHasData] = useState(false); 
  const [uploadHover, setUploadHover] = useState(false);
  const [cfoReport, setCfoReport] = useState(null); 
  const [analyzing, setAnalyzing] = useState(false); 

  const fileInputRef = useRef(null);

  // --- 1. NEW LOGIC: CHECK HISTORY ON LOAD ---
  useEffect(() => {
    // Check if user has ANY uploaded reports in storage
    const savedReports = JSON.parse(localStorage.getItem('finadapt_reports') || '[]');
    
    if (savedReports.length > 0) {
      setHasData(true); // Unlock Dashboard immediately
      // Set the CFO report to the MOST RECENT upload (first item)
      setCfoReport(savedReports[0].content); 
    }
    
    setLoading(false);
  }, []);

  const handleUploadClick = () => fileInputRef.current?.click();

  const handleFileChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setAnalyzing(true);
    
    try {
        // --- REAL AI INTEGRATION ---
        const result = await aiService.processDocument(file);
        
        if (result.success) {
          let reportText = result.report;
          if (typeof reportText === 'object' && reportText.summary_markdown) {
             reportText = reportText.summary_markdown;
          } else if (typeof reportText === 'object') {
             reportText = JSON.stringify(reportText, null, 2);
          }

          // Update UI
          setCfoReport(reportText); 
          setHasData(true); 

          // Save to History (So it persists on reload)
          const newDoc = {
            id: Date.now(),
            filename: file.name,
            date: new Date().toLocaleDateString(),
            type: "Bank Statement",
            content: reportText
          };

          const existingDocs = JSON.parse(localStorage.getItem('finadapt_reports') || '[]');
          localStorage.setItem('finadapt_reports', JSON.stringify([newDoc, ...existingDocs]));

        } else {
          alert("AI Error: " + (result.error || "Unknown error"));
        }

    } catch (e) {
        console.error(e);
        alert("Error connecting to AI. Make sure Python app.py is running!");
    } finally {
        setAnalyzing(false);
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
    <div className="space-y-12 relative z-10 animate-in fade-in duration-500 pb-32" suppressHydrationWarning>
      
      <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept=".pdf,.png,.jpg,.jpeg,.txt"/>

      {/* --- 1. UPLOAD AREA (Changes text if data exists) --- */}
      <div 
        className="w-full max-w-xl mx-auto mt-8"
        onMouseEnter={() => setUploadHover(true)}
        onMouseLeave={() => setUploadHover(false)}
      >
        <button 
          onClick={handleUploadClick}
          disabled={analyzing} 
          className={`w-full h-48 border-2 border-dashed rounded-3xl flex flex-col items-center justify-center gap-4 transition-all duration-300 group ${
            uploadHover 
              ? 'border-indigo-500 bg-indigo-500/5 shadow-lg shadow-indigo-500/10' 
              : 'border-slate-700 bg-slate-900/30'
          }`}
        >
          {analyzing ? (
            <div className="flex flex-col items-center text-indigo-400">
               <Loader2 size={48} className="animate-spin mb-4" />
               <p>AI Agents are analyzing your finances...</p>
               <span className="text-xs text-slate-500 mt-2">Reading PDF • Saving to Vector DB • Generating Insights</span>
            </div>
          ) : (
            <>
              <div className={`p-4 rounded-full transition-colors ${uploadHover ? 'bg-indigo-500 text-white' : 'bg-slate-800 text-slate-400'}`}>
                {uploadHover ? <UploadCloud size={32} /> : <Plus size={32} />}
              </div>
              <div className="text-center">
                 <h2 className={`text-xl font-semibold transition-colors ${uploadHover ? 'text-white' : 'text-slate-300'}`}>
                   {hasData ? "UPLOAD NEW DOCUMENT" : "UPLOAD TRANSACTIONS / RECEIPTS"}
                 </h2>
                 <p className="text-slate-500 mt-1">
                    {hasData ? "Add more data to refine your financial profile" : "PDF, PNG, JPG supported"}
                 </p>
              </div>
            </>
          )}
        </button>
      </div>

      {/* --- 2. ANALYSIS SECTION (Visible if hasData is true) --- */}
      {hasData && (
        <div className="animate-in slide-in-from-bottom-8 fade-in duration-700">
           
           {/* AI CFO REPORT */}
           {cfoReport && (
             <div className="bg-slate-900/80 border border-slate-700 rounded-2xl p-6 mb-8 max-w-4xl mx-auto shadow-2xl">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-2xl">🧠</span>
                  <h3 className="text-xl font-bold text-indigo-400">Latest AI Insights</h3>
                </div>
                <div className="prose prose-invert max-w-none text-sm text-slate-300">
                  <ReactMarkdown>{cfoReport}</ReactMarkdown>
                </div>
             </div>
           )}

           <div className="flex items-center gap-4 mb-6">
             <h3 className="text-lg font-semibold text-slate-400 uppercase tracking-wider">Visual Analysis</h3>
             <div className="h-[1px] flex-1 bg-slate-800"></div>
           </div>
           
           {/* CHARTS GRID */}
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
             <ChartCard title="Income vs Expense">
               <ResponsiveContainer width="100%" height="100%">
                 <BarChart data={incomeData}>
                   <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                   <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                   <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                   <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#f8fafc' }} itemStyle={{ color: '#f8fafc' }} />
                   <Legend wrapperStyle={{ paddingTop: '10px' }} />
                   <Bar dataKey="Income" fill="#6366f1" radius={[4, 4, 0, 0]} />
                   <Bar dataKey="Expense" fill="#ec4899" radius={[4, 4, 0, 0]} />
                 </BarChart>
               </ResponsiveContainer>
             </ChartCard>

             <ChartCard title="Category Breakdown">
               <ResponsiveContainer width="100%" height="100%">
                 <PieChart>
                   <Pie data={categoryData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                     {categoryData.map((entry, index) => (
                       <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="rgba(0,0,0,0)" />
                     ))}
                   </Pie>
                   <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px' }} />
                   <Legend verticalAlign="bottom" height={36} iconType="circle" />
                 </PieChart>
               </ResponsiveContainer>
             </ChartCard>

             <ChartCard title="Spending Trends">
               <ResponsiveContainer width="100%" height="100%">
                 <AreaChart data={trendData}>
                   <defs>
                     <linearGradient id="colorSpend" x1="0" y1="0" x2="0" y2="1">
                       <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                       <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                     </linearGradient>
                   </defs>
                   <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                   <XAxis dataKey="day" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                   <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b' }} />
                   <Area type="monotone" dataKey="spend" stroke="#8b5cf6" fillOpacity={1} fill="url(#colorSpend)" />
                 </AreaChart>
               </ResponsiveContainer>
             </ChartCard>
           </div>
        </div>
      )}

      {/* --- 3. DOCK (Visible if hasData is true) --- */}
      {hasData && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40 animate-in slide-in-from-bottom-12 fade-in duration-700 delay-200 w-full px-4 flex justify-center pointer-events-none">
          <div className="bg-white border border-gray-300 shadow-2xl shadow-gray-800/20 rounded-2xl px-3 sm:px-6 py-3 flex items-center gap-2 sm:gap-4 md:gap-6 pointer-events-auto overflow-x-auto max-w-full no-scrollbar">
            <DockItem href="/voice-system" icon={Mic} label="Voice agent" />
            <DockItem href="/chatbot" icon={MessageSquare} label="Chatbot" />
            <DockItem href="/reports" icon={FileText} label="Reports" />
            <DockItem href="/accounts" icon={Mail} label="Accounts" />
            <DockItem href="/habits" icon={Heart} label="Habits" />
            <DockItem href="/feedback" icon={MessageCircle} label="Feedback" />
          </div>
        </div>
      )}

      {!hasData && !analyzing && (
        <div className="text-center mt-12 opacity-50 animate-pulse">
           <p className="text-slate-500 italic">
             Upload your first document above to unlock Analysis and AI Features
           </p>
        </div>
      )}

    </div>
  );
}