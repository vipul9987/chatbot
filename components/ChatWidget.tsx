
import React, { useState, useRef, useEffect } from 'react';
import { Message, ChatState } from '../types';
import { ChatBubble } from './ChatBubble';
import { getChatResponse } from '../services/geminiService';
import { APP_CONFIG } from '../constants';

export const ChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  
  const getInitialMessage = (): Message => ({
    id: '1',
    role: 'assistant',
    content: `Hello! Welcome to ${APP_CONFIG.agencyName}. How can I assist you today?`,
    timestamp: new Date()
  });

  const [messages, setMessages] = useState<Message[]>([getInitialMessage()]);
  const [inputValue, setInputValue] = useState('');
  const [chatState, setChatState] = useState<ChatState>(ChatState.IDLE);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen, chatState]);

  const handleClearChat = () => {
    if (window.confirm('Are you sure you want to clear the conversation?')) {
      setMessages([getInitialMessage()]);
      setChatState(ChatState.IDLE);
    }
  };

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputValue.trim() || chatState === ChatState.TYPING) return;

    const currentText = inputValue.trim();
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: currentText,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setChatState(ChatState.TYPING);

    const history = messages.map(m => ({ role: m.role, content: m.content }));
    const response = await getChatResponse(currentText, history);

    const botMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: response,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, botMessage]);
    setChatState(ChatState.IDLE);
  };

  return (
    <div className="fixed inset-0 pointer-events-none flex flex-col items-end justify-end p-4 sm:p-6 z-[99999]">
      {/* Chat Window */}
      {isOpen && (
        <div className="pointer-events-auto mb-4 w-full max-w-[420px] h-[min(650px,calc(100vh-120px))] bg-white rounded-[2.5rem] shadow-[0_32px_80px_-16px_rgba(0,0,0,0.2)] border border-zinc-200/50 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-500">
          
          {/* Header */}
          <div className="px-8 py-7 bg-zinc-950 text-white flex items-center justify-between relative overflow-hidden shrink-0">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 blur-3xl rounded-full translate-x-10 -translate-y-10" />
            <div className="flex items-center gap-4 relative z-10">
              <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center p-0.5">
                <div className="w-full h-full bg-zinc-900 rounded-[0.5rem] flex items-center justify-center font-bold text-white text-[10px]">
                  {APP_CONFIG.agencyName.substring(0, 2).toUpperCase()}
                </div>
              </div>
              <div>
                <h3 className="text-sm font-bold tracking-tight leading-none mb-1">Support Assistant</h3>
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-[8px] text-zinc-400 font-bold uppercase tracking-[0.1em]">Active Now</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2 relative z-10">
              <button onClick={handleClearChat} className="p-2 hover:bg-white/10 rounded-full transition-colors opacity-70 hover:opacity-100">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
              <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors opacity-70 hover:opacity-100">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-2 bg-zinc-50">
            {messages.map((msg) => (
              <ChatBubble key={msg.id} message={msg} />
            ))}
            {chatState === ChatState.TYPING && (
              <div className="flex justify-start mb-4">
                <div className="bg-white px-4 py-3 rounded-[1.2rem] rounded-tl-none border border-zinc-100 shadow-sm flex gap-1 items-center">
                  <div className="w-1.5 h-1.5 bg-zinc-300 rounded-full animate-bounce [animation-delay:-0.3s]" />
                  <div className="w-1.5 h-1.5 bg-zinc-300 rounded-full animate-bounce [animation-delay:-0.15s]" />
                  <div className="w-1.5 h-1.5 bg-zinc-300 rounded-full animate-bounce" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-5 bg-white border-t border-zinc-100">
            <form onSubmit={handleSend} className="relative flex items-center">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Message us..."
                className="w-full pl-5 pr-12 py-4 bg-zinc-50 border border-zinc-100 rounded-2xl text-[14px] font-medium text-zinc-900 focus:outline-none focus:bg-white focus:border-zinc-300 transition-all"
              />
              <button
                type="submit"
                disabled={!inputValue.trim() || chatState === ChatState.TYPING}
                className="absolute right-2 w-10 h-10 bg-zinc-950 text-white rounded-xl flex items-center justify-center hover:bg-zinc-800 disabled:opacity-20 transition-all active:scale-95"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          pointer-events-auto w-16 h-16 rounded-2xl flex items-center justify-center shadow-[0_20px_40px_-12px_rgba(0,0,0,0.3)] transition-all duration-500
          ${isOpen ? 'bg-zinc-950 rotate-90 rounded-full' : 'bg-black hover:scale-105 active:scale-95'}
        `}
      >
        {isOpen ? (
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <div className="relative">
            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full border-2 border-black" />
          </div>
        )}
      </button>
    </div>
  );
};
