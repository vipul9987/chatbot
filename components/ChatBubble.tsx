
import React from 'react';
import { Message } from '../types';
import { APP_CONFIG } from '../constants';

interface ChatBubbleProps {
  message: Message;
}

export const ChatBubble: React.FC<ChatBubbleProps> = ({ message }) => {
  const isUser = message.role === 'user';

  const renderContent = (content: any) => {
    // 1. Handle Strings
    if (typeof content === 'string') {
      return <p className="whitespace-pre-wrap">{content}</p>;
    }

    // 2. Handle Arrays (e.g. lists of options or features)
    if (Array.isArray(content)) {
      return (
        <ul className="space-y-2 my-1">
          {content.map((item, idx) => (
            <li key={idx} className="flex items-start gap-2">
              <span className={`mt-1.5 w-1.5 h-1.5 rounded-full shrink-0 ${isUser ? 'bg-white/40' : 'bg-zinc-300'}`} />
              <span className="flex-1">{typeof item === 'object' ? JSON.stringify(item) : String(item)}</span>
            </li>
          ))}
        </ul>
      );
    }

    // 3. Handle Objects (e.g. structured data from a webhook)
    if (typeof content === 'object' && content !== null) {
      return (
        <div className={`mt-2 p-3 rounded-xl border ${isUser ? 'bg-white/10 border-white/20' : 'bg-zinc-50 border-zinc-100'}`}>
          {Object.entries(content).map(([key, value]) => (
            <div key={key} className="mb-2 last:mb-0">
              <span className={`text-[10px] font-bold uppercase tracking-wider block mb-0.5 ${isUser ? 'text-white/60' : 'text-zinc-400'}`}>
                {key.replace(/_/g, ' ')}
              </span>
              <div className="text-[12px] opacity-90">
                {typeof value === 'object' ? (
                  <pre className="overflow-x-auto font-mono text-[10px] bg-black/5 p-1.5 rounded">
                    {JSON.stringify(value, null, 2)}
                  </pre>
                ) : (
                  String(value)
                )}
              </div>
            </div>
          ))}
        </div>
      );
    }

    return String(content);
  };

  return (
    <div className={`flex w-full mb-4 ${isUser ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-500`}>
      <div className={`max-w-[85%] flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
        {!isUser && (
          <div className="flex items-center mb-1.5 ml-1 gap-1.5">
            <div className="w-1 h-1 rounded-full bg-zinc-400" />
            <span className="text-[8px] font-bold text-zinc-400 uppercase tracking-[0.15em]">
              {APP_CONFIG.agencyName}
            </span>
          </div>
        )}
        <div 
          className={`
            px-5 py-3.5 rounded-[1.4rem] text-[13.5px] leading-relaxed font-medium
            ${isUser 
              ? 'bg-zinc-950 text-white rounded-tr-none shadow-md shadow-zinc-200/50' 
              : 'bg-white text-zinc-800 border border-zinc-100 rounded-tl-none shadow-sm'}
          `}
        >
          {renderContent(message.content)}
        </div>
        <div className={`mt-1.5 flex items-center gap-1 ${isUser ? 'mr-1' : 'ml-1'} opacity-25`}>
           <span className="text-[9px] text-zinc-500 font-bold">
            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
          {isUser && (
            <svg className="w-2.5 h-2.5 text-zinc-900" fill="currentColor" viewBox="0 0 20 20">
              <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
            </svg>
          )}
        </div>
      </div>
    </div>
  );
};
