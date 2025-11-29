
import React from 'react';

export const Logo = ({ className }: { className?: string }) => (
  <svg 
    viewBox="0 0 100 100" 
    className={className} 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Background: Brand Blue Circle representing the 'Brain' */}
    <circle cx="50" cy="50" r="48" fill="#102C87" />
    
    {/* Detail: Circuit lines representing 'Logic' */}
    <path d="M50 2 V15 M50 85 V98 M2 50 H15 M85 50 H98" stroke="white" strokeWidth="4" strokeLinecap="round" opacity="0.3"/>
    
    {/* Center: Brand Orange Puzzle Piece */}
    <rect x="30" y="30" width="40" height="40" rx="8" fill="#FF6900" />
    <circle cx="50" cy="30" r="8" fill="#FF6900" /> {/* Top nub */}
    <circle cx="70" cy="50" r="8" fill="#FF6900" /> {/* Right nub */}
    
    {/* Inner detail */}
    <path d="M40 40 L60 60 M60 40 L40 60" stroke="white" strokeWidth="4" strokeLinecap="round" opacity="0.8"/>
  </svg>
);

export default Logo;
