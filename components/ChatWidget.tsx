
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
      content: `Hi there! 👋 Welcome to ${APP_CONFIG.agencyName}. How can we help you today?`,
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
    <div className="fixed bottom-6 right-6 flex flex-col items-end z-[999999]">
      {/* Chat window */}
      {isOpen && (
        <div className="interactive mb-4 w-[380px] sm:w-[420px] max-h-[600px] h-[70vh] bg-chat-light rounded-[2rem] shadow-[0_24px_60px_-12px_rgba(0,0,0,0.15)] border border-zinc-200/60 flex flex-col overflow-hidden animate-slide-up">
          
          {/* Header */}
          <div className="px-6 py-5 bg-chat-dark text-white flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center border border-white/10">
                <span className="font-bold text-[12px] tracking-tight">{APP_CONFIG.agencyName[0]}</span>
              </div>
              <div>
                <h3 className="text-[14px] font-bold tracking-tight">Support</h3>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">Online</span>
                </div>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Messages container */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-zinc-50/50">
            {messages.map((msg) => (
              <ChatBubble key={msg.id} message={msg} />
            ))}
            {chatState === ChatState.TYPING && (
              <div className="flex justify-start">
                <div className="bg-white px-4 py-2 rounded-2xl rounded-tl-none border border-zinc-100 shadow-sm flex gap-1">
                  <div className="w-1.5 h-1.5 bg-zinc-300 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                  <div className="w-1.5 h-1.5 bg-zinc-300 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                  <div className="w-1.5 h-1.5 bg-zinc-300 rounded-full animate-bounce"></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input field */}
          <div className="p-4 bg-white border-t border-zinc-100">
            <form onSubmit={handleSend} className="relative">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask anything..."
                className="w-full pl-4 pr-12 py-3.5 bg-zinc-100/50 border border-zinc-100 rounded-xl text-[14px] focus:outline-none focus:bg-white focus:ring-2 focus:ring-zinc-900/5 transition-all"
              />
              <button
                type="submit"
                disabled={!inputValue.trim() || chatState === ChatState.TYPING}
                className="absolute right-2 top-1.5 w-9 h-9 bg-chat-dark text-white rounded-lg flex items-center justify-center hover:scale-105 active:scale-95 transition-all disabled:opacity-30"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="interactive w-16 h-16 bg-chat-dark text-white rounded-full flex items-center justify-center shadow-2xl hover:scale-110 active:scale-90 transition-all duration-300"
      >
        {isOpen ? (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
          </svg>
        ) : (
          <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        )}
      </button>
    </div>
  );
};
