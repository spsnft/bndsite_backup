"use client"
import * as React from "react"
import { ShieldAlert, Check, X } from "lucide-react"
import { useCart } from "@/lib/cart-store"
import { Language } from "@/lib/translations"
import { triggerHaptic } from "@/lib/utils"

const ageGateTranslations = {
  ru: {
    title: "Вам уже есть 20 лет?",
    subtitle: "Согласно законам Таиланда, просмотр каталога и покупка разрешены только лицам от 20 лет.",
    confirm: "Мне есть 20+ лет",
    deny: "Мне нет 20",
    deniedText: "Доступ ограничен законодательством Таиланда."
  },
  en: {
    title: "Are you 20 or older?",
    subtitle: "In accordance with Thai law, content is restricted to individuals aged 20 and above.",
    confirm: "I am 20+",
    deny: "I am under 20",
    deniedText: "Access restricted under Thailand regulations."
  },
  th: {
    title: "คุณมีอายุ 20 ปีขึ้นไปหรือไม่?",
    subtitle: "ตามกฎหมายไทย เนื้อหาและผลิตภัณฑ์จำกัดเฉพาะผู้ที่มีอายุ 20 ปีขึ้นไปเท่านั้น",
    confirm: "ฉันอายุ 20 ปีขึ้นไป",
    deny: "ฉันอายุต่ำกว่า 20",
    deniedText: "จำกัดการเข้าถึงตามกฎหมายไทย"
  }
};

export const AgeGate = () => {
  const [isVisible, setIsVisible] = React.useState(false);
  const [isDenied, setIsDenied] = React.useState(false);
  
  const { lang } = useCart();
  const safeLang = (lang || 'en') as Language;
  const t = ageGateTranslations[safeLang] || ageGateTranslations.en;

  React.useEffect(() => {
    // Проверяем сохраненное подтверждение возраста
    const verified = localStorage.getItem('age_verified_20');
    if (!verified) {
      setIsVisible(true);
    }
  }, []);

  const handleConfirm = () => {
    triggerHaptic('success');
    localStorage.setItem('age_verified_20', 'true');
    setIsVisible(false);
  };

  const handleDeny = () => {
    triggerHaptic('error');
    setIsDenied(true);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md transition-opacity duration-300">
      <div className="relative w-full max-w-sm bg-brand-primary border border-white/10 rounded-[2.5rem] p-6 pt-8 shadow-2xl flex flex-col items-center text-center animate-in fade-in zoom-in-95 duration-300">
        
        {/* Иконка плашки */}
        <div className="w-16 h-16 rounded-3xl bg-brand-secondary/15 border border-brand-secondary/40 flex items-center justify-center text-brand-secondary mb-4 shadow-[0_0_20px_rgba(200,158,88,0.25)]">
          <ShieldAlert size={32} />
        </div>

        <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full bg-brand-secondary/20 text-brand-secondary border border-brand-secondary/30 mb-3">
          20+ Age Verification
        </span>

        <h2 className="text-xl font-black uppercase tracking-tight text-brand-light leading-tight mb-2">
          {t.title}
        </h2>

        <p className="text-xs text-brand-light/60 leading-relaxed mb-6">
          {t.subtitle}
        </p>

        {isDenied ? (
          <div className="w-full p-4 bg-red-500/10 border border-red-500/30 rounded-2xl text-red-400 text-xs font-bold animate-in fade-in">
            {t.deniedText}
          </div>
        ) : (
          <div className="w-full space-y-2.5">
            <button
              onClick={handleConfirm}
              className="w-full h-14 bg-brand-secondary text-brand-primary font-black uppercase tracking-widest text-[12px] rounded-2xl active:scale-95 transition-all flex items-center justify-center gap-2 shadow-xl hover:bg-brand-secondary/90"
            >
              <Check size={18} strokeWidth={3} />
              {t.confirm}
            </button>

            <button
              onClick={handleDeny}
              className="w-full h-11 bg-white/5 hover:bg-white/10 text-brand-light/50 hover:text-brand-light font-black uppercase tracking-widest text-[10px] rounded-2xl active:scale-95 transition-all flex items-center justify-center gap-1.5"
            >
              <X size={14} />
              {t.deny}
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
