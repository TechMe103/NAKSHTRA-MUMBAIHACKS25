"use client";
import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { FileText, Download, Trash2, Calendar, FileBarChart } from "lucide-react";

export default function ReportsPage() {
  const [reports, setReports] = useState([]);

  // Load reports from Local Storage on mount
  useEffect(() => {
    const saved = localStorage.getItem("finadapt_reports");
    if (saved) {
      setReports(JSON.parse(saved));
    }
  }, []);

  const handleDelete = (id) => {
    const confirmDelete = window.confirm("Delete this report?");
    if (confirmDelete) {
        const updated = reports.filter((r) => r.id !== id);
        setReports(updated);
        localStorage.setItem("finadapt_reports", JSON.stringify(updated));
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8 mt-16 pb-32">
      
      {/* Header */}
      <div className="flex justify-between items-end border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
            <FileBarChart className="text-indigo-500" size={36} />
            Financial Reports
          </h1>
          <p className="text-slate-400">Generated automatically by Agent 2 from your uploads</p>
        </div>
        <span className="bg-slate-800 border border-slate-700 text-indigo-400 px-4 py-1.5 rounded-full text-sm font-mono">
          {reports.length} Document{reports.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Empty State */}
      {reports.length === 0 ? (
        <div className="text-center py-20 bg-slate-900/30 rounded-3xl border border-slate-800 border-dashed animate-in fade-in zoom-in duration-500">
          <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
             <FileText size={40} className="text-slate-600" />
          </div>
          <h3 className="text-2xl font-semibold text-slate-300">No Reports Yet</h3>
          <p className="text-slate-500 mt-2 max-w-md mx-auto">
            Your AI-generated analysis history will appear here. Go to the dashboard and upload a bank statement to get started.
          </p>
          <a href="/dashboard" className="inline-block mt-8 bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-xl font-medium transition-colors">
            Go to Dashboard &rarr;
          </a>
        </div>
      ) : (
        /* Report List */
        <div className="grid gap-8">
          {reports.map((report) => (
            <div key={report.id} className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl transition-all hover:border-indigo-500/30 hover:shadow-2xl hover:shadow-indigo-500/10 animate-in slide-in-from-bottom-4">
              
              {/* Card Header */}
              <div className="bg-slate-950/50 p-5 flex flex-wrap gap-4 justify-between items-center border-b border-slate-800">
                <div className="flex items-center gap-4">
                  <div className="bg-gradient-to-br from-indigo-500/20 to-purple-500/20 p-3 rounded-xl text-indigo-400 border border-indigo-500/20">
                    <FileText size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-white">{report.filename}</h3>
                    <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
                      <div className="flex items-center gap-1">
                        <Calendar size={12} />
                        <span>{report.date}</span>
                      </div>
                      <span>•</span>
                      <span className="bg-slate-800 px-2 py-0.5 rounded text-slate-300">{report.type}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleDelete(report.id)} 
                    className="p-2.5 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors" 
                    title="Delete Report"
                  >
                    <Trash2 size={20} />
                  </button>
                  <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-lg shadow-indigo-500/20">
                    <Download size={18} />
                    Download PDF
                  </button>
                </div>
              </div>

              {/* Card Content (Markdown) */}
              <div className="p-6 prose prose-invert prose-sm max-w-none text-slate-300">
                <div className="max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                    <ReactMarkdown>{report.content}</ReactMarkdown>
                </div>
              </div>
              
              {/* Card Footer */}
              <div className="bg-slate-950/30 px-6 py-3 text-xs text-center text-slate-600 border-t border-slate-800">
                 Generated by Agent 4: Insights • Stored in Vector DB
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}