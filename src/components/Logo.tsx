import React from 'react';
import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
}

export function Logo({ className, size = 'md' }: LogoProps) {
  const sizeClasses = {
    xs: 'w-10 h-10',
    sm: 'w-14 h-14',
    md: 'w-24 h-24 shadow-[0_0_25px_rgba(59,130,246,0.4)]',
    lg: 'w-36 h-36 sm:w-44 sm:h-44 shadow-[0_0_40px_rgba(59,130,246,0.5)]',
    xl: 'w-56 h-56 shadow-[0_0_50px_rgba(59,130,246,0.6)]',
    '2xl': 'w-72 h-72 shadow-[0_0_60px_rgba(59,130,246,0.7)]',
  };

  return (
    <div className={cn(
      "relative flex items-center justify-center rounded-full bg-slate-950 border-4 border-white/20 transition-all duration-500 hover:scale-105 active:scale-95 group",
      sizeClasses[size],
      className
    )}>
      {/* Outer border glow effect */}
      <div className="absolute inset-0 rounded-full bg-linear-to-br from-blue-500 to-indigo-600 opacity-20 blur-xl group-hover:opacity-40 transition-opacity" />
      
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full relative z-10"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#6366f1" />
          </linearGradient>
          <filter id="logoGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Circular Ring */}
        <circle cx="50" cy="50" r="46" stroke="url(#logoGrad)" strokeWidth="1.5" strokeDasharray="4 2" opacity="0.5" />
        
        {/* Main Disk */}
        <circle cx="50" cy="50" r="42" fill="#020617" stroke="url(#logoGrad)" strokeWidth="2" />
        
        {/* Infinity Symbol */}
        <path
          d="M32 50C32 42 38 38 45 50C52 62 58 58 58 50C58 42 52 38 45 50C38 62 32 58 32 50Z"
          stroke="url(#logoGrad)"
          strokeWidth="5"
          strokeLinecap="round"
          filter="url(#logoGlow)"
          className="animate-pulse"
        />

        {/* Center Dot */}
        <circle cx="50" cy="50" r="2" fill="white" className="animate-ping" style={{ animationDuration: '3s' }} />
      </svg>
    </div>
  );
}
