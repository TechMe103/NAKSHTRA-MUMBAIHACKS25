'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../../components/Navbar'; // Import the Navbar component
import { Loader2 } from 'lucide-react';

export default function DashboardLayout({ children }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  // AUTH GUARD: Protect all pages inside the (dashboard) group
  useEffect(() => {
    const token = localStorage.getItem('token');
    // If no token is found, redirect to login page
    if (!token) {
      router.push('/login');
    } else {
      setLoading(false);
    }
  }, [router]);

  if (loading) {
    return (
      <div className="h-screen w-full bg-[#0B0F19] flex items-center justify-center text-indigo-500">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-[#0B0F19] text-slate-200 font-sans selection:bg-indigo-500/30">
      
      {/* Navbar Component Integration */}
      <Navbar />

      {/* Main Page Content */}
      {/* Responsive Padding Rules:
        pt-20 md:pt-24: Ensures adequate space below the fixed navbar.
        px-4 md:px-8: Controls horizontal gutters.
        pb-32: Essential padding bottom to clear the fixed dock on all screens.
      */}
      <main className="w-full max-w-7xl mx-auto pt-20 md:pt-24 px-4 md:px-8 pb-32 relative min-h-screen">
         {/* Ambient Background Spot - Now uses relative width for mobile fluidity */}
         <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[80vw] h-[40vw] max-w-[600px] max-h-[400px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />
         
         {children}
      </main>

    </div>
  );
}