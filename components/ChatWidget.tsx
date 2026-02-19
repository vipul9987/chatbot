import React, { useState, useRef, useEffect } from 'react';
import { Message, ChatState } from '../types';
import { ChatBubble } from './ChatBubble';
import { getChatResponse } from '../services/geminiService';
import { APP_CONFIG } from '../constants';

export const ChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: `Hello! 👋 How can we help you today?`,
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [chatState, setChatState] = useState<ChatState>(ChatState.IDLE);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, isOpen, chatState]);

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputValue.trim() || chatState === ChatState.TYPING) return;

    const userMsg = inputValue.trim();
    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      role: 'user',
      content: userMsg,
      timestamp: new Date()
    }]);
    setInputValue('');
    setChatState(ChatState.TYPING);

    const history = messages.map(m => ({ role: m.role, content: m.content }));
    const response = await getChatResponse(userMsg, history);

    setMessages(prev => [...prev, {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: response,
      timestamp: new Date()
    }]);
    setChatState(ChatState.IDLE);
  };

  return (
    <div className="fixed bottom-0 right-0 w-full h-full flex flex-col items-end justify-end p-6 pointer-events-none">
      
      {/* Chat Window Popup */}
      {isOpen && (
        <div className="interactive mb-4 w-[90%] sm:w-[400px] h-[600px] max-h-[80vh] glass-panel rounded-[2.5rem] shadow-[0_32px_80px_-16px_rgba(0,0,0,0.2)] border border-zinc-200/50 flex flex-col overflow-hidden animate-pop-in origin-bottom-right">
          
          {/* Minimalist Premium Header */}
          <div className="px-8 py-6 bg-zinc-900 text-white flex items-center justify-between shrink-0">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                <span className="font-bold text-lg">{APP_CONFIG.agencyName[0]}</span>
              </div>
              <div>
                <h3 className="text-[15px] font-bold tracking-tight">AI Assistant</h3>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400/90">Always Active</span>
                </div>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="p-2.5 hover:bg-white/10 rounded-xl transition-all active:scale-90"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-6 bg-[#fcfcfd]">
            {messages.map((msg) => (
              <ChatBubble key={msg.id} message={msg} />
            ))}
            {chatState === ChatState.TYPING && (
              <div className="flex justify-start animate-pulse">
                <div className="bg-white px-5 py-3 rounded-2xl border border-zinc-100 shadow-sm flex gap-1.5">
                  <div className="w-2 h-2 bg-zinc-300 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                  <div className="w-2 h-2 bg-zinc-300 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                  <div className="w-2 h-2 bg-zinc-300 rounded-full animate-bounce"></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-5 bg-white border-t border-zinc-100/80">
            <form onSubmit={handleSend} className="relative group">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Type your message..."
                className="w-full pl-6 pr-14 py-4 bg-zinc-100/50 border border-transparent rounded-2xl text-[15px] focus:outline-none focus:bg-white focus:border-indigo-500/20 focus:ring-4 focus:ring-indigo-500/5 transition-all"
              />
              <button
                type="submit"
                disabled={!inputValue.trim() || chatState === ChatState.TYPING}
                className="absolute right-2.5 top-2.5 w-11 h-11 bg-zinc-900 text-white rounded-xl flex items-center justify-center hover:bg-indigo-600 hover:scale-105 active:scale-95 transition-all disabled:opacity-20 shadow-lg shadow-zinc-200"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Floating Toggle Button with Premium Glow */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`interactive w-16 h-16 rounded-full flex items-center justify-center shadow-[0_20px_50px_rgba(0,0,0,0.3)] transition-all duration-500 transform ${
          isOpen 
            ? 'bg-zinc-900 rotate-180 ring-4 ring-indigo-500/30' 
            : 'bg-zinc-900 hover:scale-110 active:scale-90 ring-4 ring-indigo-500 shadow-indigo-500/20'
        }`}
      >
        {isOpen ? (
          <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
          </svg>
        ) : (
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        )}
      </button>
    </div>
  );
};