
import React, { useState, useRef } from 'react';
import { SendIcon } from './icons/SendIcon';
import { PaperclipIcon } from './icons/PaperclipIcon'; // New Icon
import { XCircleIcon } from './icons/XCircleIcon'; // New Icon for removing file
import { ChatMessageFile } from '../types';

interface ChatInputProps {
  onSendMessage: (message: string, file?: ChatMessageFile) => void;
  disabled?: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, disabled }) => {
  const [inputValue, setInputValue] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<ChatMessageFile | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setFilePreview({
          name: file.name,
          type: file.type,
          content: reader.result as string,
        });
      };
      reader.readAsDataURL(file);
    } else {
      // Handle non-image or no file selected (e.g., show an error or reset)
      setSelectedFile(null);
      setFilePreview(null);
      if (file) { // if a file was selected but not an image
        alert("Please select an image file (e.g., PNG, JPG, GIF).");
      }
    }
     // Reset file input value to allow selecting the same file again
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const removeSelectedFile = () => {
    setSelectedFile(null);
    setFilePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // Reset file input
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if ((inputValue.trim() || filePreview) && !disabled) {
      onSendMessage(inputValue, filePreview ?? undefined);
      setInputValue('');
      removeSelectedFile();
    }
  };

  return (
    <div className="bg-rose-200 rounded-xl shadow-md focus-within:ring-2 focus-within:ring-orange-500 transition-shadow duration-150">
      {filePreview && (
        <div className="p-2 px-4 flex justify-between items-center border-b border-rose-300">
          <span className="text-xs text-stone-600 truncate max-w-[calc(100%-2rem)]">
            Attached: {filePreview.name}
          </span>
          <button
            onClick={removeSelectedFile}
            className="text-rose-500 hover:text-rose-700"
            aria-label="Remove attached file"
          >
            <XCircleIcon className="w-5 h-5" />
          </button>
        </div>
      )}
      <form 
        onSubmit={handleSubmit} 
        className="flex items-center p-1.5"
        aria-label="Chat input form"
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
          aria-hidden="true"
        />
        <button
          type="button"
          onClick={triggerFileInput}
          disabled={disabled}
          className="p-3 text-orange-600 hover:text-orange-500 focus:outline-none focus:text-orange-500 rounded-lg disabled:text-stone-400 disabled:cursor-not-allowed transition-colors duration-150"
          aria-label="Attach image file"
          aria-disabled={disabled}
        >
          <PaperclipIcon className="w-6 h-6" />
        </button>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Your message..."
          disabled={disabled}
          className="flex-grow py-3 px-4 bg-transparent text-stone-800 placeholder-stone-500 focus:outline-none disabled:opacity-60 disabled:cursor-not-allowed"
          aria-label="Message input"
          aria-disabled={disabled}
        />
        <button
          type="submit"
          disabled={disabled || (!inputValue.trim() && !filePreview)}
          className="p-3 text-orange-600 hover:text-orange-500 focus:outline-none focus:text-orange-500 rounded-lg disabled:text-stone-400 disabled:cursor-not-allowed transition-colors duration-150"
          aria-label="Send message"
          aria-disabled={disabled || (!inputValue.trim() && !filePreview)}
        >
          <SendIcon className="w-6 h-6" />
        </button>
      </form>
    </div>
  );
};
