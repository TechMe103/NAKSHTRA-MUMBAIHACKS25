"use client";
import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User } from 'lucide-react';

const ChatBot = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! I'm your FinAdapt assistant. How can I help you today?",
      sender: 'bot',
      timestamp: new Date().toISOString()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const simulateBotResponse = (userMessage) => {
    setIsTyping(true);
    
    setTimeout(() => {
      const responses = {
        'hello': "Hi there! How can I assist you with your finances today?",
        'help': "I can help you with expense tracking, budget analysis, and financial advice. What would you like to know?",
        'expense': "I can help you track your expenses. Would you like to add a new transaction?",
        'budget': "Let's talk about your budget! What aspect of budgeting would you like to discuss?",
        'default': "I understand. Could you please provide more details so I can assist you better?"
      };

      let botReply = responses.default;
      const lowerMessage = userMessage.toLowerCase();
      
      for (const key in responses) {
        if (lowerMessage.includes(key)) {
          botReply = responses[key];
          break;
        }
      }

      const newBotMessage = {
        id: Date.now(),
        text: botReply,
        sender: 'bot',
        timestamp: new Date().toISOString()
      };

      setMessages(prev => [...prev, newBotMessage]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  const handleSendMessage = () => {
    if (inputMessage.trim() === '') return;

    const newMessage = {
      id: Date.now(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, newMessage]);
    setInputMessage('');
    
    simulateBotResponse(inputMessage);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#0a0e1a] p-4">
      <div className="w-full max-w-4xl h-[700px] bg-[#141824] rounded-2xl shadow-2xl flex flex-col border border-[#1e2539]">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#6C5CE7] to-[#8B7CE7] px-6 py-4 rounded-t-2xl flex items-center gap-3">
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
            <Bot className="w-6 h-6 text-[#6C5CE7]" />
          </div>
          <div>
            <h2 className="text-white font-semibold text-lg">FinAdapt Assistant</h2>
            <p className="text-white/80 text-sm">Always here to help</p>
          </div>
        </div>

        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex items-end gap-3 ${
                message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'
              }`}
            >
              {/* Avatar */}
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  message.sender === 'bot'
                    ? 'bg-[#6C5CE7]'
                    : 'bg-[#1e2539]'
                }`}
              >
                {message.sender === 'bot' ? (
                  <Bot className="w-5 h-5 text-white" />
                ) : (
                  <User className="w-5 h-5 text-white" />
                )}
              </div>

              {/* Message Bubble */}
              <div
                className={`max-w-[70%] rounded-2xl px-4 py-3 ${
                  message.sender === 'bot'
                    ? 'bg-[#1e2539] text-white rounded-bl-none'
                    : 'bg-[#6C5CE7] text-white rounded-br-none'
                }`}
              >
                <p className="text-sm leading-relaxed">{message.text}</p>
                <p className="text-xs mt-1 opacity-60">
                  {formatTime(message.timestamp)}
                </p>
              </div>
            </div>
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex items-end gap-3">
              <div className="w-8 h-8 rounded-full bg-[#6C5CE7] flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
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
        <div className="p-4 border-t border-[#1e2539]">
          <div className="flex gap-3">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              className="flex-1 bg-[#1e2539] text-white px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6C5CE7] placeholder-white/40"
            />
            <button
              onClick={handleSendMessage}
              disabled={inputMessage.trim() === ''}
              className="bg-gradient-to-r from-[#6C5CE7] to-[#8B7CE7] text-white px-6 py-3 rounded-xl hover:shadow-lg hover:shadow-[#6C5CE7]/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatBot;