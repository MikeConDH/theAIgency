import React from 'react';
import { IconProps } from '../../types';

export const ClipboardIcon: React.FC<IconProps> = ({ className = "w-6 h-6" }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    fill="none" 
    viewBox="0 0 24 24" 
    strokeWidth={1.5} 
    stroke="currentColor" 
    className={className}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a8.25 8.25 0 01-8.25 8.25H3.75a2.25 2.25 0 01-2.25-2.25V6.75A2.25 2.25 0 013.75 4.5h3.375c.621 0 1.125-.504 1.125-1.125V3.006A2.25 2.25 0 0110.5 2.25h3A2.25 2.25 0 0115.75 4.5v.375c0 .621.504 1.125 1.125 1.125h3.375A2.25 2.25 0 0122.5 8.25v3.75a2.25 2.25 0 01-2.25 2.25h-1.5m-16.5 0H22.5" />
  </svg>
);