
import React from 'react';
import { IconProps } from '../../types';

export const BotIcon: React.FC<IconProps> = ({ className = "w-6 h-6" }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    fill="none" 
    viewBox="0 0 24 24" 
    strokeWidth={1.5} 
    stroke="currentColor" 
    className={className}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 7.5V6.108c0-1.135.845-2.098 1.976-2.192.353-.026.715-.026 1.068 0 1.13.094 1.976 1.057 1.976 2.192V7.5M8.25 7.5h7.5M8.25 7.5V9a.75.75 0 01-.75.75H5.625c-.621 0-1.125-.504-1.125-1.125V7.5m11.25 0V9A.75.75 0 0018.375 9.75h-1.875a1.125 1.125 0 01-1.125-1.125V7.5m-6 13.5V18.75h3.375v2.25A1.125 1.125 0 0110.5 22.5h-1.5a1.125 1.125 0 01-1.125-1.125v-2.25H6.375v2.25A1.125 1.125 0 007.5 22.5h1.5a1.125 1.125 0 001.125-1.125V18.75m-3.75 0h7.5M12 15v-3.75" />
  </svg>
);
