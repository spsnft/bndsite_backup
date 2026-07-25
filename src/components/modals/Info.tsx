"use client"
import * as React from "react"
import { X } from "lucide-react"
import { triggerHaptic } from "@/lib/utils"

interface InfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export const Info = ({ isOpen, onClose, title, children }: InfoModalProps) => {
  if (!isOpen) return null;

  const handleClose = () => {
    triggerHaptic('light');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 animate-fade-in">
      {/* BACKDROP */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-md" 
        onClick={handleClose} 
      />

      {/* MODAL CONTAINER */}
      <div className="relative w-full max-w-sm bg-brand-primary border border-white/15 rounded-[2.5rem] p-6 text-brand-light shadow-2xl overflow-hidden z-10 max-h-[85vh] flex flex-col">
        {/* GLOW BACKGROUND EFFECT */}
        <div 
          className="absolute inset-0 opacity-15 pointer-events-none" 
          style={{ background: `radial-gradient(circle at 50% 0%, #A88444, transparent 70%)` }} 
        />

        {/* HEADER */}
        <div className="flex items-center justify-between mb-6 shrink-0 relative z-10">
          <h3 className="text-[14px] font-black uppercase tracking-[0.15em] text-brand-light">
            {title}
          </h3>
          <button 
            onClick={handleClose} 
            className="p-2 bg-white/5 hover:bg-white/10 active:scale-90 rounded-full border border-white/10 transition-all text-brand-light/60 hover:text-brand-light"
          >
            <X size={16} />
          </button>
        </div>

        {/* CONTENT */}
        <div className="overflow-y-auto pr-1 flex-1 relative z-10 space-y-5 no-scrollbar">
          {children}
        </div>
      </div>
    </div>
  );
};
