'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link'; // ✅ Use standard Next.js Link
import { useRouter } from 'next/navigation';
import { Zap, LogOut } from 'lucide-react';

export default function Navbar() {
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Get user details from local storage for the profile circle
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 h-16 bg-slate-900/50 backdrop-blur-xl border-b border-slate-800 z-50 px-4 md:px-8 flex items-center justify-between">
      
      {/* 1. Logo Section (Fixed: Removed nested Links) */}
      <Link href="/dashboard" className="flex items-center gap-3 group">
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-600 to-violet-600 shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
          <Zap className="w-4 h-4 text-white fill-white" />
        </div>
        <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
          FinAdapt
        </span>
      </Link>

      {/* 2. Middle Links */}
      <div className="hidden md:flex items-center gap-8">
        <Link href="/dashboard" className="text-sm font-medium text-white hover:text-indigo-400 transition-colors">
          Home
        </Link>
        <Link href="/about" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">
          About
        </Link>
        <Link href="/pricing" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">
          Pricing
        </Link>
        <Link href="/advisior" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">
          Advisor 
        </Link>
      </div>

      {/* 3. Profile & Logout */}
      <div className="flex items-center gap-4">
        
        {/* Profile Circle */}
        <Link href="/accounts">
          <div className="w-9 h-9 rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 p-[1px] cursor-pointer">
            <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center" title={user?.fullName}>
              <span className="font-bold text-xs text-indigo-400">
                {user?.fullName?.charAt(0) || 'U'}
              </span>
            </div>
          </div>
        </Link>

        {/* Logout Button */}
        <button 
          onClick={handleLogout}
          className="flex items-center gap-2 text-sm text-slate-400 hover:text-red-400 transition-colors"
          title="Logout"
        >
          <LogOut size={18} />
        </button>
      </div>
    </nav>
  );
}