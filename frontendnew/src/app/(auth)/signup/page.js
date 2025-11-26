'use client';

import React, { useState } from 'react';
import { Eye, EyeOff, Loader2, Zap, ArrowRight, CheckCircle, AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SignupPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ fullName: '', email: '', password: '' });
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors.length > 0) setErrors([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors([]);
    setLoading(true);

    // DEBUG: Check if the URL is correct
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    console.log("Checking API URL:", apiUrl); // Open F12 Console to see this

    if (!apiUrl) {
      setErrors(["Configuration Error: NEXT_PUBLIC_API_URL is missing. Restart your server!"]);
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${apiUrl}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      // CHECK: Did we get HTML instead of JSON?
      const contentType = res.headers.get("content-type");
      if (contentType && contentType.indexOf("application/json") === -1) {
        throw new Error("Server returned HTML instead of JSON. Check your API URL.");
      }

      const data = await res.json();

      if (!res.ok) {
        if (data.errors) {
            setErrors(data.errors.map(err => err.msg));
        } else {
            setErrors([data.message || 'Signup failed']);
        }
        throw new Error('Signup failed');
      }

      // SUCCESS
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      setSuccess(true);
      setTimeout(() => {
        router.push('/dashboard');
      }, 1500);

    } catch (err) {
      console.error("Signup Error:", err);
      if (err.message.includes("HTML")) {
        setErrors(["Connection Error: We are hitting the wrong URL. Check console for details."]);
      } else {
        // Only set error if not already set by logic above
        if (errors.length === 0) setErrors([err.message || "Something went wrong"]);
      }
    } finally {
      if (!success) setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#0B0F19] text-slate-200 relative overflow-hidden font-sans selection:bg-indigo-500/30">
      
      {/* --- Ambient Background Effects --- */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
      
      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none mix-blend-soft-light"></div>
      
      {/* --- Navigation / Logo --- */}
      <nav className="absolute top-6 left-6 z-20">
        <Link 
          href="/" 
          className="flex items-center gap-3 group"
        >
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform duration-300">
            <Zap className="w-5 h-5 text-white fill-white" />
            <div className="absolute inset-0 rounded-xl ring-1 ring-white/20 inset-shadow"></div>
          </div>
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400 tracking-tight">
            FinAdapt
          </span>
        </Link>
      </nav>

      {/* --- Main Content Container --- */}
      <div className="w-full max-w-md px-6 py-24 relative z-10">
        
        {/* Glass Card */}
        <div className="relative bg-slate-900/40 backdrop-blur-xl border border-slate-800/50 rounded-2xl shadow-2xl overflow-hidden">
          
          {/* Decorative top border gradient */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-blue-500" />

          <div className="p-8 sm:p-10">
            
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-white tracking-tight mb-2">
                Create an account
              </h1>
              <p className="text-slate-400 text-sm">
                Join FinAdapt to manage your finances smarter.
              </p>
            </div>

            {/* Success State */}
            {success ? (
              <div className="flex flex-col items-center justify-center py-8 animate-in fade-in zoom-in duration-300">
                <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle className="w-8 h-8 text-green-400" />
                </div>
                <h3 className="text-xl font-semibold text-white">Welcome aboard!</h3>
                <p className="text-slate-400 text-sm mt-2">Redirecting you to dashboard...</p>
              </div>
            ) : (
              /* Form */
              <form onSubmit={handleSubmit} className="space-y-5">
                
                {/* Error Banner */}
                {errors.length > 0 && (
                  <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3 animate-in slide-in-from-top-2">
                    <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      {errors.map((err, i) => (
                        <p key={i} className="text-sm text-red-400 font-medium">{err}</p>
                      ))}
                    </div>
                  </div>
                )}

                {/* Full Name */}
                <div className="space-y-1.5">
                  <label htmlFor="fullName" className="text-xs font-semibold text-slate-300 uppercase tracking-wider ml-1">
                    Full Name
                  </label>
                  <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-slate-950/50 border border-slate-800 rounded-xl text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all duration-200"
                    placeholder="John Doe"
                  />
                </div>

                {/* Email */}
                <div className="space-y-1.5">
                  <label htmlFor="email" className="text-xs font-semibold text-slate-300 uppercase tracking-wider ml-1">
                    Email Address
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-slate-950/50 border border-slate-800 rounded-xl text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all duration-200"
                    placeholder="you@example.com"
                  />
                </div>

                {/* Password */}
                <div className="space-y-1.5">
                  <label htmlFor="password" className="text-xs font-semibold text-slate-300 uppercase tracking-wider ml-1">
                    Password
                  </label>
                  <div className="relative group">
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      required
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-slate-950/50 border border-slate-800 rounded-xl text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all duration-200 pr-10"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors p-1"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  <p className="text-[11px] text-slate-500 ml-1">Must be at least 6 characters</p>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-2 py-3.5 px-4 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-semibold rounded-xl shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-indigo-500 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
                >
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      Create Account
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                    </>
                  )}
                </button>
              </form>
            )}

            {/* Footer */}
            <div className="mt-8 text-center">
              <p className="text-slate-400 text-sm">
                Already have an account?{' '}
                <Link 
                  href="/login" 
                  className="font-medium text-indigo-400 hover:text-indigo-300 hover:underline transition-all"
                >
                  Log in
                </Link>
              </p>
            </div>

          </div>
        </div>

        {/* Branding Footer */}
        <div className="mt-8 text-center opacity-40 hover:opacity-100 transition-opacity duration-500">
           <p className="text-xs text-slate-500 flex items-center justify-center gap-1.5">
             <Zap size={12} /> Powered by Agentic AI
           </p>
        </div>
      </div>
    </div>
  );
}