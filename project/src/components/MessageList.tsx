import React, { useEffect, useRef } from 'react';
import MessageItem from './MessageItem';
import { Message } from '../types';

interface MessageListProps {
  messages: Message[];
}

const MessageList: React.FC<MessageListProps> = ({ messages }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  if (messages.length === 0) {
    return (
      <div className="flex-1 overflow-y-auto">
        <div className="flex h-full items-center justify-center p-4">
          <div className="text-center">
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              How can I help you today?
            </h3>
            <p className="text-gray-500">
              Send a message to start a conversation
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto">
      {messages.map((message) => (
        <MessageItem key={message.id} message={message} />
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;