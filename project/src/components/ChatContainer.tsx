import React, { useReducer, useCallback } from 'react';
import MessageList from './MessageList';
import ChatInput from './ChatInput';
import { ChatState, Message } from '../types';
import { generateId, sendInitialMessage, sendFollowUpMessage } from '../utils/api';

// Initial state
const initialState: ChatState = {
  messages: [],
  isLoading: false,
  runId: null,
  error: null,
};

// Action types
type Action =
  | { type: 'ADD_USER_MESSAGE'; payload: string }
  | { type: 'START_ASSISTANT_RESPONSE' }
  | { type: 'UPDATE_ASSISTANT_RESPONSE'; payload: string }
  | { type: 'COMPLETE_ASSISTANT_RESPONSE'; payload?: { context?: Message['context'] } }
  | { type: 'SET_RUN_ID'; payload: string }
  | { type: 'SET_ERROR'; payload: string }
  | { type: 'CLEAR_ERROR' };

// Reducer function
const chatReducer = (state: ChatState, action: Action): ChatState => {
  switch (action.type) {
    case 'ADD_USER_MESSAGE':
      return {
        ...state,
        messages: [
          ...state.messages,
          {
            id: generateId(),
            content: action.payload,
            role: 'user',
          },
        ],
        isLoading: true,
      };
    case 'START_ASSISTANT_RESPONSE':
      return {
        ...state,
        messages: [
          ...state.messages,
          {
            id: generateId(),
            content: '',
            role: 'assistant',
            isStreaming: true,
          },
        ],
      };
    case 'UPDATE_ASSISTANT_RESPONSE':
      return {
        ...state,
        messages: state.messages.map((message, index) => {
          if (index === state.messages.length - 1 && message.role === 'assistant') {
            return {
              ...message,
              content: message.content + action.payload,
            };
          }
          return message;
        }),
      };
    case 'COMPLETE_ASSISTANT_RESPONSE':
      return {
        ...state,
        isLoading: false,
        messages: state.messages.map((message, index) => {
          if (index === state.messages.length - 1 && message.role === 'assistant') {
            return {
              ...message,
              isStreaming: false,
              context: action.payload?.context,
            };
          }
          return message;
        }),
      };
    case 'SET_RUN_ID':
      return {
        ...state,
        runId: action.payload,
      };
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        isLoading: false,
      };
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
};

const ChatContainer: React.FC = () => {
  const [state, dispatch] = useReducer(chatReducer, initialState);

  const handleChunk = useCallback((chunk: string) => {
    dispatch({ type: 'UPDATE_ASSISTANT_RESPONSE', payload: chunk });
  }, []);

  const handleSendMessage = useCallback(async (message: string) => {
    try {
      dispatch({ type: 'ADD_USER_MESSAGE', payload: message });
      dispatch({ type: 'START_ASSISTANT_RESPONSE' });

      if (!state.runId) {
        // First message
        const { runId, context } = await sendInitialMessage(message, handleChunk);
        dispatch({ type: 'SET_RUN_ID', payload: runId });
        dispatch({ type: 'COMPLETE_ASSISTANT_RESPONSE', payload: { context } });
      } else {
        // Follow-up message
        const { context } = await sendFollowUpMessage(state.runId, message, handleChunk);
        dispatch({ type: 'COMPLETE_ASSISTANT_RESPONSE', payload: { context } });
      }
    } catch (error) {
      console.error('Error sending message:', error);
      dispatch({
        type: 'SET_ERROR',
        payload: error instanceof Error ? error.message : 'An error occurred',
      });
    }
  }, [state.runId, handleChunk]);

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 py-4 px-6 shadow-sm">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-xl font-semibold text-gray-800">AI Quiz Assistant</h1>
        </div>
      </header>

      {/* Message List */}
      <MessageList messages={state.messages} />

      {/* Error message if any */}
      {state.error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 mx-auto max-w-3xl my-2 rounded">
          <p>Error: {state.error}</p>
          <button 
            className="text-red-700 underline mt-1"
            onClick={() => dispatch({ type: 'CLEAR_ERROR' })}
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Chat Input */}
      <ChatInput onSendMessage={handleSendMessage} isLoading={state.isLoading} />
    </div>
  );
};

export default ChatContainer;