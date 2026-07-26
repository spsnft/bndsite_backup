"use client"
import * as React from "react"
import { motion } from "framer-motion"
import { X } from "lucide-react"
import { useCart } from "@/lib/cart-store"
import { translations, Language } from "@/lib/translations"
import { triggerHaptic } from "@/lib/utils"

interface InfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export const Info = ({ isOpen, onClose, title, children }: InfoModalProps) => {
  const [isClosing, setIsClosing] = React.useState(false);
  const { lang } = useCart();
  const safeLang = (lang || 'en') as Language;
  const t = translations[safeLang] || translations.en;

  const handleClose = React.useCallback(() => {
    triggerHaptic('light');
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, 300);
  }, [onClose]);

  if (!isOpen && !isClosing) return null;

  return (
    <div className={`fixed inset-0 z-[120] flex items-end sm:items-center justify-center p-0 sm:p-4 transition-all duration-300 ${isClosing ? 'opacity-0' : 'opacity-100'}`}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={handleClose} />

      <motion.div
        drag="y"
        dragConstraints={{ top: 0 }}
        dragElastic={0.2}
        onDragEnd={(_: any, info: any) => {
          if (info.offset.y > 100) handleClose();
        }}
        initial={{ y: "100%" }}
        animate={{ y: isClosing ? "100%" : 0 }}
        transition={{ type: "spring", damping: 30, stiffness: 300 }}
        className="relative w-full max-w-lg bg-brand-primary border border-white/10 sm:rounded-[2.5rem] rounded-t-[2.5rem] p-6 pt-8 shadow-2xl flex flex-col max-h-[85vh]"
      >
        <div className="absolute inset-0 opacity-15 pointer-events-none rounded-[2.5rem]" style={{ background: `radial-gradient(circle at 50% 0%, #A88444, transparent 70%)` }} />

        <div className="absolute top-3 left-1/2 -translate-x-1/2 w-12 h-1.5 bg-white/20 rounded-full sm:hidden" />

        <button 
          onClick={handleClose} 
          className="absolute top-6 right-6 p-2 bg-white/5 hover:bg-white/10 active:scale-90 rounded-full border border-white/10 transition-all text-brand-light/60 hover:text-brand-light z-20"
        >
          <X size={18} />
        </button>

        <h3 className="text-xl font-black uppercase tracking-tight text-brand-light mb-6 pr-8 relative z-10">
          {title}
        </h3>

        <div className="space-y-4 overflow-y-auto pr-1 flex-1 relative z-10 no-scrollbar">
          {children}
        </div>

        <button 
          onClick={handleClose}
          className="w-full mt-6 py-3.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl font-black uppercase text-xs text-brand-light tracking-wider transition-all relative z-10 shrink-0"
        >
          {t.close}
        </button>
      </motion.div>
    </div>
  );
};
