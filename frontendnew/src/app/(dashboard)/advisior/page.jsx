'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Paperclip, User, Video, Phone, MoreVertical } from 'lucide-react';

export default function ExpertAdvisor() {
  const [currentUser, setCurrentUser] = useState('user1'); // Toggle between 'user1' and 'user2'
  const [messages, setMessages] = useState([
    {
      id: 1,
      userId: 'user2',
      userName: 'Financial Expert',
      text: "Hello! I'm here to help you with your financial planning. What would you like to discuss today?",
      timestamp: new Date(Date.now() - 300000)
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef(null);

  const users = {
    user1: {
      name: 'You',
      color: 'from-purple-500 to-pink-500'
    },
    user2: {
      name: 'Financial Expert',
      color: 'from-blue-500 to-cyan-500'
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (!inputValue.trim()) return;

    const newMessage = {
      id: Date.now(),
      userId: currentUser,
      userName: users[currentUser].name,
      text: inputValue,
      timestamp: new Date()
    };

    // Add new message after the most recent message
    setMessages(prevMessages => [...prevMessages, newMessage]);
    setInputValue('');
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-5xl h-[90vh] bg-slate-800/50 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-700/50 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <User className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">
                  {currentUser === 'user1' ? 'Financial Expert' : 'Client'}
                </h2>
                <p className="text-blue-100 text-sm flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                  Online now
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <button className="w-10 h-10 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center transition-colors">
                <Phone className="w-5 h-5 text-white" />
              </button>
              <button className="w-10 h-10 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center transition-colors">
                <Video className="w-5 h-5 text-white" />
              </button>
              <button className="w-10 h-10 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center transition-colors">
                <MoreVertical className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>


        </div>

        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((message) => {
            const isCurrentUser = message.userId === currentUser;
            const userColor = users[message.userId]?.color || 'from-slate-500 to-slate-600';

            return (
              <div
                key={message.id}
                className={`flex gap-3 ${isCurrentUser ? 'flex-row-reverse' : 'flex-row'} animate-[fadeIn_0.3s_ease-in]`}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 bg-gradient-to-br ${userColor}`}>
                  <User className="w-5 h-5 text-white" />
                </div>
                <div className={`flex flex-col max-w-[70%] ${isCurrentUser ? 'items-end' : 'items-start'}`}>
                  <span className="text-xs text-slate-400 mb-1 px-2">
                    {message.userName}
                  </span>
                  <div className={`rounded-2xl px-5 py-3 ${
                    isCurrentUser
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                      : 'bg-slate-700/80 text-slate-100'
                  }`}>
                    <p className="text-sm leading-relaxed break-words">{message.text}</p>
                  </div>
                  <span className="text-xs text-slate-400 mt-1 px-2">
                    {formatTime(message.timestamp)}
                  </span>
                </div>
              </div>
            );
          })}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-6 bg-slate-800/80 border-t border-slate-700/50">
          <div className="flex gap-3 items-end">
            <button className="w-12 h-12 bg-slate-700 hover:bg-slate-600 rounded-xl flex items-center justify-center transition-colors">
              <Paperclip className="w-5 h-5 text-slate-300" />
            </button>
            <div className="flex-1 bg-slate-700 rounded-xl overflow-hidden">
              <textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={`Type your message as ${users[currentUser].name}...`}
                className="w-full bg-transparent text-slate-100 placeholder-slate-400 px-5 py-3 resize-none outline-none"
                rows="1"
              />
            </div>
            <button
              onClick={handleSend}
              disabled={!inputValue.trim()}
              className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl flex items-center justify-center transition-all"
            >
              <Send className="w-5 h-5 text-white" />
            </button>
          </div>
          <div className="mt-3 flex items-center justify-between">
            <p className="text-xs text-slate-400">
              Powered by Agentic AI • Real-time communication
            </p>

          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}



// 'use client';

// import { useState, useRef, useEffect } from 'react';
// import { Send, Paperclip, User, Video, Phone, MoreVertical } from 'lucide-react';
// import { io } from 'socket.io-client';

// export default function ExpertAdvisor() {
//   const [currentUser, setCurrentUser] = useState('user1'); // keep toggle if needed
//   const [messages, setMessages] = useState([
//     {
//       id: 1,
//       userId: 'user2',
//       userName: 'Financial Expert',
//       text: "Hello! I'm here to help you with your financial planning. What would you like to discuss today?",
//       timestamp: new Date().toISOString()
//     }
//   ]);
//   const [inputValue, setInputValue] = useState('');
//   const [typingUsers, setTypingUsers] = useState({});
//   const messagesEndRef = useRef(null);
//   const socketRef = useRef(null);
//   const SCROLL_OPTIONS = { behavior: 'smooth' };

//   // configure socket URL via env (Next public env var), fallback to localhost
//   const SOCKET_URL = (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_SOCKET_URL) || 'http://localhost:4000';

//   useEffect(() => {
//     // create socket connection once
//     socketRef.current = io(SOCKET_URL, { transports: ['websocket'] });

//     const socket = socketRef.current;

//     socket.on('connect', () => {
//       console.log('connected to socket:', socket.id);
//     });

//     // When server emits a message (user or bot)
//     socket.on('message', (message) => {
//       // ensure timestamps are Date objects or ISO string
//       const normalized = { ...message, timestamp: message.timestamp || new Date().toISOString() };
//       setMessages(prev => [...prev, normalized]);
//     });

//     socket.on('typing', ({ userId }) => {
//       setTypingUsers(prev => ({ ...prev, [userId]: true }));
//     });

//     socket.on('stopTyping', ({ userId }) => {
//       setTypingUsers(prev => {
//         const copy = { ...prev };
//         delete copy[userId];
//         return copy;
//       });
//     });

//     return () => {
//       socket.disconnect();
//     };
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []); // run once

//   // scroll
//   const scrollToBottom = () => messagesEndRef.current?.scrollIntoView(SCROLL_OPTIONS);

//   useEffect(() => {
//     scrollToBottom();
//   }, [messages, typingUsers]);

//   const users = {
//     user1: {
//       name: 'You',
//       color: 'from-purple-500 to-pink-500'
//     },
//     user2: {
//       name: 'Financial Expert',
//       color: 'from-blue-500 to-cyan-500'
//     }
//   };

//   const formatTime = (iso) => {
//     const date = new Date(iso);
//     return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
//   };

//   const sendSocketMessage = (message) => {
//     // emit to server — server will broadcast message back to everyone
//     socketRef.current?.emit('sendMessage', message);
//   };

//   const handleSend = () => {
//     if (!inputValue.trim()) return;

//     const newMessage = {
//       id: `msg-${Date.now()}`,
//       userId: currentUser,
//       userName: users[currentUser].name,
//       text: inputValue,
//       timestamp: new Date().toISOString()
//     };

//     // optimistic local add (server will broadcast again and it's okay to have duplicates if IDs differ)
//     setMessages(prev => [...prev, newMessage]);

//     // notify others we're not typing
//     socketRef.current?.emit('stopTyping', { userId: currentUser });

//     // send to server (server will generate AI reply and broadcast it)
//     sendSocketMessage(newMessage);

//     setInputValue('');
//   };

//   const handleKeyPress = (e) => {
//     if (e.key === 'Enter' && !e.shiftKey) {
//       e.preventDefault();
//       handleSend();
//     } else {
//       // emit typing event while typing
//       socketRef.current?.emit('typing', { userId: currentUser, userName: users[currentUser].name });
//       // debounce stopTyping locally (simple quick approach)
//       clearTimeout(handleKeyPress._typingTimeout);
//       handleKeyPress._typingTimeout = setTimeout(() => {
//         socketRef.current?.emit('stopTyping', { userId: currentUser });
//       }, 900);
//     }
//   };

//   const isTyping = Object.keys(typingUsers).length > 0;

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
//       <div className="w-full max-w-5xl h-[90vh] bg-slate-800/50 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-700/50 flex flex-col overflow-hidden">
//         {/* Header */}
//         <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center gap-4">
//               <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
//                 <User className="w-6 h-6 text-white" />
//               </div>
//               <div>
//                 <h2 className="text-2xl font-bold text-white">
//                   {currentUser === 'user1' ? 'Financial Expert' : 'Client'}
//                 </h2>
//                 <p className="text-blue-100 text-sm flex items-center gap-2">
//                   <span className={`w-2 h-2 rounded-full ${isTyping ? 'bg-yellow-400 animate-pulse' : 'bg-green-400 animate-pulse'}`}></span>
//                   {isTyping ? 'Expert is typing…' : 'Online now'}
//                 </p>
//               </div>
//             </div>
            
//             <div className="flex items-center gap-3">
//               <button className="w-10 h-10 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center transition-colors">
//                 <Phone className="w-5 h-5 text-white" />
//               </button>
//               <button className="w-10 h-10 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center transition-colors">
//                 <Video className="w-5 h-5 text-white" />
//               </button>
//               <button className="w-10 h-10 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center transition-colors">
//                 <MoreVertical className="w-5 h-5 text-white" />
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Messages Container */}
//         <div className="flex-1 overflow-y-auto p-6 space-y-4">
//           {messages.map((message) => {
//             const isCurrentUser = message.userId === currentUser;
//             const userColor = users[message.userId]?.color || 'from-slate-500 to-slate-600';

//             return (
//               <div
//                 key={message.id}
//                 className={`flex gap-3 ${isCurrentUser ? 'flex-row-reverse' : 'flex-row'} animate-[fadeIn_0.3s_ease-in]`}
//               >
//                 <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 bg-gradient-to-br ${userColor}`}>
//                   <User className="w-5 h-5 text-white" />
//                 </div>
//                 <div className={`flex flex-col max-w-[70%] ${isCurrentUser ? 'items-end' : 'items-start'}`}>
//                   <span className="text-xs text-slate-400 mb-1 px-2">
//                     {message.userName}
//                   </span>
//                   <div className={`rounded-2xl px-5 py-3 ${
//                     isCurrentUser
//                       ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
//                       : 'bg-slate-700/80 text-slate-100'
//                   }`}>
//                     <p className="text-sm leading-relaxed break-words">{message.text}</p>
//                   </div>
//                   <span className="text-xs text-slate-400 mt-1 px-2">
//                     {formatTime(message.timestamp)}
//                   </span>
//                 </div>
//               </div>
//             );
//           })}

//           {isTyping && (
//             <div className="text-sm text-slate-300 italic">Financial Expert is typing...</div>
//           )}

//           <div ref={messagesEndRef} />
//         </div>

//         {/* Input Area */}
//         <div className="p-6 bg-slate-800/80 border-t border-slate-700/50">
//           <div className="flex gap-3 items-end">
//             <button className="w-12 h-12 bg-slate-700 hover:bg-slate-600 rounded-xl flex items-center justify-center transition-colors">
//               <Paperclip className="w-5 h-5 text-slate-300" />
//             </button>
//             <div className="flex-1 bg-slate-700 rounded-xl overflow-hidden">
//               <textarea
//                 value={inputValue}
//                 onChange={(e) => setInputValue(e.target.value)}
//                 onKeyDown={handleKeyPress}
//                 placeholder={`Type your message as ${users[currentUser].name}...`}
//                 className="w-full bg-transparent text-slate-100 placeholder-slate-400 px-5 py-3 resize-none outline-none"
//                 rows="1"
//               />
//             </div>
//             <button
//               onClick={handleSend}
//               disabled={!inputValue.trim()}
//               className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl flex items-center justify-center transition-all"
//             >
//               <Send className="w-5 h-5 text-white" />
//             </button>
//           </div>
//           <div className="mt-3 flex items-center justify-between">
//             <p className="text-xs text-slate-400">
//               Powered by Agentic AI • Real-time communication
//             </p>

//             <div className="flex gap-2">
//               {/* quick toggle so you can test both roles */}
//               <button onClick={() => setCurrentUser(currentUser === 'user1' ? 'user2' : 'user1')}
//                 className="text-xs px-3 py-1 bg-slate-700/60 rounded-md">
//                 Switch to {currentUser === 'user1' ? 'Client' : 'You'}
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>

//       <style jsx global>{`
//         @keyframes fadeIn {
//           from {
//             opacity: 0;
//             transform: translateY(10px);
//           }
//           to {
//             opacity: 1;
//             transform: translateY(0);
//           }
//         }
//       `}</style>
//     </div>
//   );
// }
