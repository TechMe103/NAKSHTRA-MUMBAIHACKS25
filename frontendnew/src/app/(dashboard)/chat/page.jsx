'use client';

   import { useEffect, useState } from 'react';
   import ChatRoom from '@/components/ChatRoom';
   import { useRouter } from 'next/navigation';

   export default function ChatPage() {
     const router = useRouter();
     const [token, setToken] = useState(null);
     const [currentUser, setCurrentUser] = useState(null);

     useEffect(() => {
       const storedToken = localStorage.getItem('token');
       const storedUser = localStorage.getItem('user');
       
       if (storedToken && storedUser) {
         setToken(storedToken);
         setCurrentUser(JSON.parse(storedUser));
       } else {
         router.push('/login');
       }
     }, [router]);

     if (!token || !currentUser) {
       return (
         <div className="flex items-center justify-center min-h-screen bg-[#0a0e1a]">
           <p className="text-white">Loading...</p>
         </div>
       );
     }

     return <ChatRoom token={token} currentUser={currentUser} />;
   }