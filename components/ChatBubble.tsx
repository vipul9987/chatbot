
import React from 'react';
import { Message } from '../types';

interface ChatBubbleProps {
  message: Message;
}

export const ChatBubble: React.FC<ChatBubbleProps> = ({ message }) => {
  const isUser = message.role === 'user';

  return (
    <div className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
      <div className={`max-w-[85%] flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
        <div 
          className={`
            px-4 py-3 rounded-2xl text-[14px] leading-relaxed
            ${isUser 
              ? 'bg-chat-dark text-white rounded-tr-none' 
              : 'bg-white text-zinc-800 border border-zinc-100 rounded-tl-none shadow-sm'}
          `}
        >
          {typeof message.content === 'string' ? (
            <p className="whitespace-pre-wrap">{message.content}</p>
          ) : (
            <pre className="text-[12px] font-mono">{JSON.stringify(message.content, null, 2)}</pre>
          )}
        </div>
        <span className="mt-1 text-[9px] font-bold uppercase tracking-wider text-zinc-400 px-1 opacity-60">
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>
    </div>
  );
};
