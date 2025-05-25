import React, { useEffect, useRef } from 'react';
import { Message } from '../types';
import ReactMarkdown from 'react-markdown';

interface MessageItemProps {
  message: Message;
}

const MessageItem: React.FC<MessageItemProps> = ({ message }) => {
  const messageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messageRef.current) {
      messageRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [message.content]);

  const isUser = message.role === 'user';

  return (
    <div
      ref={messageRef}
      className={`py-6 ${
        isUser ? 'bg-white' : 'bg-gray-50'
      } border-b border-gray-200 transition-all`}
    >
      <div className="mx-auto max-w-3xl px-4">
        <div className="flex items-start">
          {/* Avatar */}
          <div
            className={`flex h-8 w-8 rounded-full items-center justify-center mr-4 ${
              isUser ? 'bg-blue-600 text-white' : 'bg-emerald-600 text-white'
            }`}
          >
            {isUser ? 'U' : 'A'}
          </div>

          {/* Message content */}
          <div className="flex-1 overflow-hidden">
            <div className="font-medium mb-1">
              {isUser ? 'You' : 'Assistant'}
            </div>
            
            {/* Context information for assistant messages */}
            {!isUser && message.context && (
              <div className="mb-4 space-y-4">
                {/* Question */}
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="font-medium text-blue-700 mb-2">Question:</div>
                  <div className="text-blue-900">{message.context.question}</div>
                </div>

                {/* Previous answer */}
                {message.context.previous && (
                  <div className="bg-emerald-50 p-4 rounded-lg">
                    <div className="font-medium text-emerald-700 mb-2">Previous Answer:</div>
                    <div className="text-emerald-900">{message.context.previous}</div>
                  </div>
                )}

                {/* Explanation */}
                {message.context.explain && (
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <div className="font-medium text-purple-700 mb-2">Explanation:</div>
                    <div className="text-purple-900">{message.context.explain}</div>
                  </div>
                )}

                {/* Score and Evaluation */}
                <div className="flex space-x-4">
                  {typeof message.context.score === 'number' && (
                    <div className="bg-amber-50 px-4 py-2 rounded-lg">
                      <span className="font-medium text-amber-700">Score:</span>
                      <span className="ml-2 text-amber-900">{message.context.score}</span>
                    </div>
                  )}
                  {message.context.evaluation && (
                    <div className="bg-gray-50 px-4 py-2 rounded-lg">
                      <span className="font-medium text-gray-700">Status:</span>
                      <span className="ml-2 text-gray-900">{message.context.evaluation}</span>
                    </div>
                  )}
                </div>

                {/* Multiple choice answers */}
                {message.context.answers && (
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="font-medium text-blue-700 mb-2">Answer Choices:</div>
                    <div className="space-y-2">
                      {Object.entries(message.context.answers).map(([key, value]) => (
                        <div key={key} className="flex items-start">
                          <span className="font-medium text-blue-700 mr-2">{key}:</span>
                          <span className="text-blue-900">{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Total Score - Moved to bottom */}
                <div className="bg-green-50 p-4 rounded-lg mt-6">
                  <div className="font-medium text-green-700">Total Score: {message.context.total}</div>
                </div>
              </div>
            )}

            {/* Main message content */}
            <div className="prose max-w-none">
              {message.isStreaming && !message.content ? (
                <div className="flex space-x-2 mt-2">
                  <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              ) : (
                <ReactMarkdown>
                  {message.content}
                </ReactMarkdown>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageItem;