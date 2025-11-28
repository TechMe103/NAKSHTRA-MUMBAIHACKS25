import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Users, ArrowLeft } from 'lucide-react';
import { getSocket, initializeSocket } from '../utils/socket';

const ChatRoom = ({ token, currentUser }) => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const socketRef = useRef(null);

  // Initialize socket connection
  useEffect(() => {
    socketRef.current = initializeSocket(token);
    
    socketRef.current.on('connect', () => {
      setIsConnected(true);
      fetchUsers();
    });

    socketRef.current.on('disconnect', () => {
      setIsConnected(false);
    });

    socketRef.current.on('receive-message', (message) => {
      setMessages(prev => [...prev, message]);
    });

    socketRef.current.on('user-typing', ({ userId, isTyping }) => {
      if (selectedUser && userId === selectedUser._id) {
        setIsTyping(isTyping);
      }
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [token]);

  // Fetch all users
  const fetchUsers = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/chat/users', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      setUsers(data.users);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  // Fetch chat history when user is selected
  const handleUserSelect = async (user) => {
    setSelectedUser(user);
    setMessages([]);
    setIsTyping(false);

    // Join room
    socketRef.current.emit('join-room', { otherUserId: user._id });

    // Fetch chat history
    try {
      const response = await fetch(`http://localhost:5000/api/chat/history/${user._id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      setMessages(data.messages);
    } catch (error) {
      console.error('Error fetching chat history:', error);
    }
  };

  // Scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Format time
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  // Handle typing
  const handleTyping = () => {
    if (!selectedUser) return;

    socketRef.current.emit('typing-start', { receiverId: selectedUser._id });

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      socketRef.current.emit('typing-stop', { receiverId: selectedUser._id });
    }, 1000);
  };

  // Send message
  const handleSendMessage = () => {
    if (inputMessage.trim() === '' || !selectedUser || !isConnected) return;

    socketRef.current.emit('send-message', {
      receiverId: selectedUser._id,
      text: inputMessage
    });

    setInputMessage('');
    socketRef.current.emit('typing-stop', { receiverId: selectedUser._id });
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#0a0e1a] p-4">
      <div className="w-full max-w-6xl h-[700px] bg-[#141824] rounded-2xl shadow-2xl flex border border-[#1e2539]">
        
        {/* Users Sidebar */}
        <div className={`${selectedUser ? 'hidden md:flex' : 'flex'} w-full md:w-80 bg-[#1e2539] rounded-l-2xl flex-col border-r border-[#2a3349]`}>
          <div className="bg-gradient-to-r from-[#6C5CE7] to-[#8B7CE7] px-6 py-4 flex items-center gap-3">
            <Users className="w-6 h-6 text-white" />
            <h2 className="text-white font-semibold text-lg">Contacts</h2>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            {users.map((user) => (
              <div
                key={user._id}
                onClick={() => handleUserSelect(user)}
                className={`px-6 py-4 cursor-pointer hover:bg-[#141824] transition-colors border-b border-[#2a3349] ${
                  selectedUser?._id === user._id ? 'bg-[#141824]' : ''
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#6C5CE7] rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-medium truncate">{user.fullName}</p>
                    <p className="text-white/60 text-sm truncate">{user.email}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className={`${selectedUser ? 'flex' : 'hidden md:flex'} flex-1 flex-col`}>
          {selectedUser ? (
            <>
              {/* Chat Header */}
              <div className="bg-gradient-to-r from-[#6C5CE7] to-[#8B7CE7] px-6 py-4 flex items-center gap-3">
                <button
                  onClick={() => setSelectedUser(null)}
                  className="md:hidden text-white"
                >
                  <ArrowLeft className="w-6 h-6" />
                </button>
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-[#6C5CE7]" />
                </div>
                <div>
                  <h2 className="text-white font-semibold text-lg">{selectedUser.fullName}</h2>
                  <p className="text-white/80 text-sm">{selectedUser.email}</p>
                </div>
                <div className={`ml-auto w-3 h-3 rounded-full ${isConnected ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`}></div>
              </div>

              {/* Messages Container */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-[#141824]">
                {messages.map((message) => {
                  const isSentByMe = message.sender._id === currentUser.id;
                  return (
                    <div
                      key={message._id || message.id}
                      className={`flex items-end gap-3 ${
                        isSentByMe ? 'flex-row-reverse' : 'flex-row'
                      }`}
                    >
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                          isSentByMe ? 'bg-[#1e2539]' : 'bg-[#6C5CE7]'
                        }`}
                      >
                        <User className="w-5 h-5 text-white" />
                      </div>

                      <div
                        className={`max-w-[70%] rounded-2xl px-4 py-3 ${
                          isSentByMe
                            ? 'bg-[#6C5CE7] text-white rounded-br-none'
                            : 'bg-[#1e2539] text-white rounded-bl-none'
                        }`}
                      >
                        <p className="text-sm leading-relaxed">{message.text}</p>
                        <p className="text-xs mt-1 opacity-60">
                          {formatTime(message.timestamp)}
                        </p>
                      </div>
                    </div>
                  );
                })}

                {isTyping && (
                  <div className="flex items-end gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#6C5CE7] flex items-center justify-center">
                      <User className="w-5 h-5 text-white" />
                    </div>
                    <div className="bg-[#1e2539] rounded-2xl rounded-bl-none px-4 py-3">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                        <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                        <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="p-4 border-t border-[#1e2539] bg-[#141824]">
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => {
                      setInputMessage(e.target.value);
                      handleTyping();
                    }}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your message..."
                    disabled={!isConnected}
                    className="flex-1 bg-[#1e2539] text-white px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6C5CE7] placeholder-white/40 disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={inputMessage.trim() === '' || !isConnected}
                    className="bg-gradient-to-r from-[#6C5CE7] to-[#8B7CE7] text-white px-6 py-3 rounded-xl hover:shadow-lg hover:shadow-[#6C5CE7]/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center bg-[#141824]">
              <div className="text-center">
                <Users className="w-16 h-16 text-white/20 mx-auto mb-4" />
                <p className="text-white/60 text-lg">Select a contact to start chatting</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatRoom;