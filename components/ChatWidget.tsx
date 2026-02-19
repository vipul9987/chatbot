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
      content: `Hi there! I'm your AI assistant. How can I help you today?`,
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
    <div className="fixed inset-0 flex flex-col items-end justify-end p-4 sm:p-6 pointer-events-none">
      
      {/* Chat Window Popup */}
      {isOpen && (
        <div className="interactive mb-6 w-full max-w-[400px] h-[600px] max-h-[75vh] glass-panel rounded-[2.5rem] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.25)] border border-white/40 flex flex-col overflow-hidden animate-pop-in origin-bottom-right">
          
          {/* Header */}
          <div className="px-8 py-6 bg-zinc-950 text-white flex items-center justify-between shrink-0">
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-2xl bg-white text-zinc-950 flex items-center justify-center font-bold text-lg shadow-inner">
                {APP_CONFIG.agencyName[0]}
              </div>
              <div>
                <h3 className="text-[15px] font-bold tracking-tight">Support Agent</h3>
                <div className="flex items-center gap-2 mt-0.5 opacity-70">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span className="text-[10px] font-bold uppercase tracking-widest">Online</span>
                </div>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="p-2 hover:bg-white/10 rounded-xl transition-all"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-6 bg-[#fcfcfd]/50">
            {messages.map((msg) => (
              <ChatBubble key={msg.id} message={msg} />
            ))}
            {chatState === ChatState.TYPING && (
              <div className="flex justify-start">
                <div className="bg-white px-5 py-3 rounded-2xl border border-zinc-100 shadow-sm flex gap-1.5 items-center">
                  <div className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                  <div className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                  <div className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce"></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-5 bg-white border-t border-zinc-100">
            <form onSubmit={handleSend} className="relative group">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="How can we help?"
                className="w-full pl-6 pr-14 py-4 bg-zinc-100/50 border border-transparent rounded-2xl text-[14px] focus:outline-none focus:bg-white focus:border-zinc-200 transition-all placeholder:text-zinc-400"
              />
              <button
                type="submit"
                disabled={!inputValue.trim() || chatState === ChatState.TYPING}
                className="absolute right-2 top-2 w-11 h-11 bg-zinc-950 text-white rounded-[14px] flex items-center justify-center hover:bg-indigo-600 transition-all disabled:opacity-20"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Floating Toggle Button - Matching your screenshot */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`interactive group relative w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 transform active:scale-90 ${
          isOpen ? 'bg-zinc-950 rotate-180' : 'bg-zinc-950 hover:scale-105'
        }`}
      >
        {/* The Blue Glow Ring from your image */}
        <div className={`absolute inset-0 rounded-full border-[3px] border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.5)] transition-opacity duration-300 ${isOpen ? 'opacity-30' : 'opacity-100'}`}></div>
        
        {isOpen ? (
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
          </svg>
        ) : (
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 13l-7 7-7-7M19 5l-7 7-7-7" />
          </svg>
        )}
      </button>
    </div>
  );
};