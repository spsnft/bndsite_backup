"use client"
import * as React from "react"
import { X } from "lucide-react"
import { useCart } from "@/lib/cart-store"
import { translations, Language } from "@/lib/translations"
import { triggerHaptic } from "@/lib/utils"

export const Info = ({ 
  isOpen, 
  onClose, 
  title, 
  children 
}: { 
  isOpen: boolean, 
  onClose: () => void, 
  title: string, 
  children: React.ReactNode 
}) => {
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

      <div className={`relative w-full max-w-lg bg-brand-primary border border-white/10 sm:rounded-[2.5rem] rounded-t-[2.5rem] p-6 pt-8 shadow-2xl flex flex-col max-h-[85vh] transition-transform duration-300 ${isClosing ? 'translate-y-full sm:translate-y-12' : 'translate-y-0'}`}>
        
        <div className="absolute top-3 left-1/2 -translate-x-1/2 w-12 h-1.5 bg-white/20 rounded-full sm:hidden" />

        <button 
          onClick={handleClose} 
          className="absolute top-6 right-6 p-2 bg-white/5 hover:bg-white/10 active:scale-90 rounded-full border border-white/10 transition-all text-brand-light z-20"
        >
          <X size={18} />
        </button>

        <h2 className="text-xl font-black uppercase tracking-tight text-brand-light mb-6 pr-8">
          {title}
        </h2>

        <div className="space-y-4 overflow-y-auto pr-1 flex-1 no-scrollbar">
          {children}
        </div>

        <button 
          onClick={handleClose}
          className="w-full mt-6 py-3.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl font-black uppercase text-xs text-brand-light tracking-wider transition-all shrink-0"
        >
          {t.close}
        </button>
      </div>
    </div>
  );
};
