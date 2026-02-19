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
      content: `Hello! 👋 How can I assist you today?`,
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
    <div className="fixed inset-0 flex flex-col items-end justify-end p-6 pointer-events-none">
      
      {/* Premium Chat Window popup */}
      {isOpen && (
        <div className="interactive mb-6 w-full max-w-[400px] h-[640px] max-h-[85vh] glass-panel rounded-[2.5rem] shadow-[0_40px_120px_-20px_rgba(0,0,0,0.3)] border border-white/50 flex flex-col overflow-hidden animate-widget-in origin-bottom-right">
          
          {/* Header */}
          <div className="px-8 py-7 bg-[#0a0a0a] text-white flex items-center justify-between shrink-0">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-zinc-800 to-zinc-900 border border-white/10 flex items-center justify-center shadow-lg">
                <span className="font-bold text-lg text-blue-400">{APP_CONFIG.agencyName[0]}</span>
              </div>
              <div>
                <h3 className="text-[16px] font-bold tracking-tight">AI Expert</h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-emerald-400/80">Online</span>
                </div>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="p-2 hover:bg-white/10 rounded-xl transition-all active:scale-90"
            >
              <svg className="w-6 h-6 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-6 bg-[#f8f9fa]">
            {messages.map((msg) => (
              <ChatBubble key={msg.id} message={msg} />
            ))}
            {chatState === ChatState.TYPING && (
              <div className="flex justify-start">
                <div className="bg-white px-5 py-3.5 rounded-2xl border border-zinc-100 shadow-sm flex gap-1.5 items-center">
                  <div className="w-1.5 h-1.5 bg-zinc-300 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                  <div className="w-1.5 h-1.5 bg-zinc-300 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                  <div className="w-1.5 h-1.5 bg-zinc-300 rounded-full animate-bounce"></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-6 bg-white border-t border-zinc-100">
            <form onSubmit={handleSend} className="relative flex items-center">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask your question..."
                className="w-full pl-6 pr-14 py-4.5 bg-zinc-100/50 border border-transparent rounded-[1.25rem] text-[15px] focus:outline-none focus:bg-white focus:border-blue-500/20 transition-all placeholder:text-zinc-400"
              />
              <button
                type="submit"
                disabled={!inputValue.trim() || chatState === ChatState.TYPING}
                className="absolute right-2.5 w-11 h-11 bg-zinc-950 text-white rounded-xl flex items-center justify-center hover:bg-blue-600 active:scale-95 transition-all disabled:opacity-20 shadow-md"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Signature Blue-Ring Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`interactive relative group w-16 h-16 rounded-full flex items-center justify-center shadow-[0_20px_60px_rgba(0,0,0,0.3)] transition-all duration-500 transform active:scale-90 ${
          isOpen ? 'bg-[#0a0a0a] rotate-180' : 'bg-[#0a0a0a] hover:scale-110'
        }`}
      >
        {/* The Glow Ring */}
        <div className={`absolute inset-0 rounded-full border-[3px] transition-all duration-500 ${
          isOpen 
            ? 'border-zinc-800 scale-95 opacity-50' 
            : 'border-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.6)] opacity-100'
        }`}></div>
        
        {isOpen ? (
          <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
          </svg>
        ) : (
          <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
          </svg>
        )}
      </button>
    </div>
  );
};