import React, { useState, KeyboardEvent, ChangeEvent } from 'react';
import { Send } from 'lucide-react';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isLoading }) => {
  const [message, setMessage] = useState('');

  const handleInputChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
  };

  const handleSendMessage = () => {
    if (message.trim() && !isLoading) {
      onSendMessage(message);
      setMessage('');
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="relative border-t border-gray-200 bg-white p-4">
      <div className="mx-auto max-w-3xl flex rounded-lg border border-gray-300 bg-white shadow-sm">
        <textarea
          className="flex-1 p-3 outline-none resize-none max-h-[200px] min-h-[56px]"
          placeholder="Send a message..."
          value={message}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          disabled={isLoading}
          rows={1}
        />
        <button
          className={`flex items-center justify-center p-3 text-white rounded-r-lg transition-colors ${
            message.trim() && !isLoading
              ? 'bg-blue-600 hover:bg-blue-700'
              : 'bg-gray-300 cursor-not-allowed'
          }`}
          onClick={handleSendMessage}
          disabled={!message.trim() || isLoading}
        >
          <Send size={20} />
        </button>
      </div>
      <div className="text-center text-xs text-gray-500 mt-2">
        Send a message to start chatting
      </div>
    </div>
  );
};

export default ChatInput;