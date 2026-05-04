import React from 'react';
import { motion } from 'motion/react';
import { Logo } from '@/components/Logo';
import { useLocation } from 'react-router-dom';

export function AskAI() {
  const location = useLocation();
  const isExamPage = location.pathname.startsWith('/exam/');

  if (isExamPage) return null;

  const handleClick = () => {
    window.open('https://chat.openai.com', '_blank');
  };

  return (
    <motion.div
      drag
      dragConstraints={{ left: -window.innerWidth + 100, right: 0, top: -window.innerHeight + 100, bottom: 0 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      className="fixed bottom-6 right-6 z-[9999] cursor-move"
      id="draggable-ai-button"
    >
      <button 
        onClick={handleClick}
        className="group relative p-0.5 rounded-full bg-slate-900 shadow-2xl ring-2 ring-white/20 hover:ring-blue-500/50 transition-all active:cursor-grabbing"
        title="Ask AI"
      >
        <Logo size="xs" className="border-none shadow-none" />
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-slate-900 animate-pulse" />
        
        {/* Tooltip */}
        <div className="absolute bottom-full right-0 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          <div className="bg-slate-900 text-white text-[10px] font-black uppercase italic tracking-widest px-3 py-1.5 rounded-lg whitespace-nowrap shadow-xl border border-white/10">
            Ask AI Assistant
          </div>
        </div>
      </button>
    </motion.div>
  );
}

