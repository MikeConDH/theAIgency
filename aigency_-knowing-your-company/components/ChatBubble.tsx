
import React from 'react';
import { IconProps, ChatMessageFile } from '../types';

interface ChatBubbleProps {
  message: string | React.ReactNode;
  sender: 'user' | 'bot';
  timestamp: Date;
  Icon: React.FC<IconProps>;
  file?: ChatMessageFile;
}

export const ChatBubble: React.FC<ChatBubbleProps> = ({ message, sender, timestamp, Icon, file }) => {
  const isUser = sender === 'user';
  const bubbleClasses = isUser
    ? 'bg-orange-500 text-white self-end rounded-l-xl rounded-tr-xl'
    : 'bg-rose-200 text-stone-700 self-start rounded-r-xl rounded-tl-xl';
  
  const layoutClasses = isUser ? 'flex-row-reverse space-x-reverse' : 'flex-row';

  const hasTextContent = typeof message === 'string' ? message.trim() !== '' : message !== null;

  return (
    <div className={`flex items-end ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`flex ${layoutClasses} items-end space-x-2 max-w-lg md:max-w-xl lg:max-w-2xl`}>
        <Icon className={`w-8 h-8 p-1.5 rounded-full ${isUser ? 'bg-orange-400 text-white' : 'bg-rose-300 text-orange-600'} flex-shrink-0 shadow-sm`} />
        <div className={`p-3 md:p-4 shadow-md ${bubbleClasses} min-w-[80px]`}>
          {file && file.type.startsWith('image/') && (
            <img 
              src={file.content} 
              alt={file.name} 
              className="max-w-xs md:max-w-sm rounded-md mb-2 shadow" 
              style={{ maxHeight: '300px', objectFit: 'contain' }}
            />
          )}
          {hasTextContent && (typeof message === 'string' ? <p className="text-sm md:text-base leading-relaxed whitespace-pre-wrap">{message}</p> : message)}
          
          { (hasTextContent || file) && (
             <p className={`text-xs mt-2 ${isUser ? 'text-orange-100 text-right' : 'text-rose-500 text-left'}`}>
                {timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
