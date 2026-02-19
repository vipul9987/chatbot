import React from 'react';
import { Message } from '../types';

interface ChatBubbleProps {
  message: Message;
}

export const ChatBubble: React.FC<ChatBubbleProps> = ({ message }) => {
  const isUser = message.role === 'user';

  return (
    <div className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-3 duration-500`}>
      <div className={`max-w-[85%] flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
        <div 
          className={`
            px-5 py-3.5 rounded-3xl text-[14.5px] leading-relaxed shadow-sm
            ${isUser 
              ? 'bg-zinc-900 text-white rounded-tr-none' 
              : 'bg-white text-zinc-800 border border-zinc-100 rounded-tl-none'}
          `}
        >
          {typeof message.content === 'string' ? (
            <p className="whitespace-pre-wrap">{message.content}</p>
          ) : (
            <pre className="text-[12px] font-mono p-2 bg-zinc-50 rounded-lg">{JSON.stringify(message.content, null, 2)}</pre>
          )}
        </div>
        <span className="mt-1.5 text-[10px] font-bold uppercase tracking-widest text-zinc-400 px-2 opacity-50">
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>
    </div>
  );
};