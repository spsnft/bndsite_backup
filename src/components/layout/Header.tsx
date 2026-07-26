"use client"
import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { MessageCircle, Phone, Instagram, ChevronDown } from "lucide-react"
import { useCart } from "@/lib/cart-store"
import { Language } from "@/lib/translations"
import { BentoBanner } from "@/components/BentoBanner"
import { triggerHaptic } from "@/lib/utils"

interface HeaderProps {
  safeLang: Language;
  isLangMenuOpen: boolean;
  setIsLangMenuOpen: (v: boolean) => void;
  onOpenMedical: () => void;
  onOpenDelivery: () => void;
  onOpenGuarantees: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  safeLang,
  isLangMenuOpen,
  setIsLangMenuOpen,
  onOpenMedical,
  onOpenDelivery,
  onOpenGuarantees,
}) => {
  const { setLang } = useCart();

  return (
    <header className="max-w-5xl mx-auto relative z-[100] mb-6">
      <div className="flex items-center justify-between px-1 mb-4">
        <div className="flex items-center gap-3">
          <Image src="/420/images/logo.svg" priority width={72} height={72} className="w-14 h-14 sm:w-16 sm:h-16 object-contain relative z-10 shrink-0" alt="MPG StorePhuket" />
          <div className="flex flex-col">
            <span className="text-[12px] sm:text-[14px] font-black uppercase tracking-tight text-brand-light leading-tight">
              Marijuana Premium Grade
            </span>
            <span className="text-[11px] sm:text-[11px] font-extrabold uppercase tracking-wide text-brand-secondary">
              MPG StorePhuket
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link href="https://line.me/R/ti/p/@mpsphuket" target="_blank" className="w-[42px] h-[42px] flex items-center justify-center bg-white/5 rounded-button border border-white/10 active:scale-90 transition-all shadow-lg">
            <MessageCircle size={18} className="opacity-80" />
          </Link>
          <Link href="https://wa.me/66612345678" target="_blank" className="w-[42px] h-[42px] flex items-center justify-center bg-white/5 rounded-button border border-white/10 active:scale-90 transition-all shadow-lg">
            <Phone size={18} className="opacity-80" />
          </Link>
          <Link href="https://www.instagram.com/mpsphuket" target="_blank" className="w-[42px] h-[42px] flex items-center justify-center bg-white/5 rounded-button border border-white/10 active:scale-90 transition-all shadow-lg">
            <Instagram size={18} className="opacity-80" />
          </Link>

          <div className="relative">
            <button
              onClick={() => { triggerHaptic('light'); setIsLangMenuOpen(!isLangMenuOpen); }}
              className="h-[42px] px-3 flex items-center justify-center bg-white/5 rounded-button border border-white/10 font-black text-[11px] text-brand-secondary active:scale-90 transition-all gap-1 shadow-lg"
            >
              {safeLang.toUpperCase()}
              <ChevronDown size={14} className={`transition-transform duration-300 ${isLangMenuOpen ? 'rotate-180' : ''}`} />
            </button>

            {isLangMenuOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setIsLangMenuOpen(false)} />
                <div className="absolute top-[calc(100%+8px)] right-0 w-36 bg-brand-primary border border-white/10 rounded-button shadow-2xl z-50 flex flex-col p-1.5 animate-in fade-in zoom-in-95 duration-200 origin-top-right">
                  {[
                    { id: 'en', label: 'English', flag: '🇬🇧' },
                    { id: 'ru', label: 'Русский', flag: '🇷🇺' },
                    { id: 'th', label: 'ภาษาไทย', flag: '🇹🇭' }
                  ].map(l => (
                    <button
                      key={l.id}
                      onClick={() => {
                        triggerHaptic('success');
                        setLang(l.id as Language);
                        setIsLangMenuOpen(false);
                      }}
                      className={`flex items-center gap-3 px-3 py-2.5 text-[11px] font-black uppercase rounded-badge transition-all ${safeLang === l.id ? 'bg-brand-secondary/20 text-brand-secondary' : 'text-brand-light/70 hover:bg-white/5 hover:text-brand-light'}`}
                    >
                      <span className="text-[14px]">{l.flag}</span> {l.label}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <BentoBanner
        onOpenMedical={onOpenMedical}
        onOpenDelivery={onOpenDelivery}
        onOpenGuarantees={onOpenGuarantees}
