"use client"
import * as React from "react"
import { Award, ChevronRight, CheckCircle2, ShieldCheck, Bike, Leaf } from "lucide-react"
import { triggerHaptic } from "@/lib/utils"
import { Language } from "@/lib/translations"

interface BentoBannerProps {
  onOpenMedical: () => void;
  onOpenDelivery: () => void;
  onOpenGuarantees: () => void;
  safeLang: Language;
}

export const BentoBanner: React.FC<BentoBannerProps> = ({
  onOpenMedical,
  onOpenDelivery,
  onOpenGuarantees,
  safeLang
}) => {
  const bentoTexts = {
    ru: {
      medTitle: "Медицинский Паспорт PT.33",
      medDesc: "100% Легально в Таиланде. Оформляем бесплатно при любом заказе",
      medBadge: "MOPH Thailand",
      deliveryTitle: "Экспресс Доставка",
      deliveryDesc: "По Пхукету за 30-60 минут",
      qualityTitle: "Прямые поставки",
      qualityDesc: "Органический премиум качество"
    },
    en: {
      medTitle: "Medical Cannabis Pass PT.33",
      medDesc: "100% Legal in Thailand. Issued for free with your order",
      medBadge: "MOPH Certified",
      deliveryTitle: "Express Delivery",
      deliveryDesc: "Phuket wide in 30-60 mins",
      qualityTitle: "Direct Sourcing",
      qualityDesc: "Premium organic selection"
    },
    th: {
      medTitle: "ใบรับรองแพทย์ PT.33",
      medDesc: "ถูกกฎหมาย 100% ในไทย ออกให้ฟรีพร้อมคำสั่งซื้อของคุณ",
      medBadge: "MOPH Thailand",
      deliveryTitle: "จัดส่งด่วน",
      deliveryDesc: "ทั่วภูเก็ตใน 30-60 นาที",
      qualityTitle: "ส่งตรงจากฟาร์ม",
      qualityDesc: "คัดสรรคุณภาพเกรดพรีเมียม"
    }
  }[safeLang] || {
    medTitle: "Medical Cannabis Pass PT.33",
    medDesc: "100% Legal in Thailand. Issued for free with your order",
    medBadge: "MOPH Certified",
    deliveryTitle: "Express Delivery",
    deliveryDesc: "Phuket wide in 30-60 mins",
    qualityTitle: "Direct Sourcing",
    qualityDesc: "Premium organic selection"
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-8">
      {/* HERO BENTO CARD: MEDICAL CERTIFICATE */}
      <div 
        onClick={() => { triggerHaptic('light'); onOpenMedical(); }}
        className="md:col-span-2 relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-brand-secondary/20 via-black/40 to-black/80 border border-brand-secondary/40 p-5 shadow-2xl cursor-pointer active:scale-[0.99] transition-all group"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_0%_0%,rgba(200,158,88,0.25),transparent_70%)] pointer-events-none" />
        <div className="relative z-10 flex flex-col justify-between h-full space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-secondary/20 border border-brand-secondary/40 text-brand-secondary text-[10px] font-black uppercase tracking-widest">
              <Award size={13} />
              <span>{bentoTexts.medBadge}</span>
            </div>
            <ChevronRight size={18} className="text-brand-secondary group-hover:translate-x-1 transition-transform" />
          </div>

          <div>
            <h3 className="text-lg md:text-xl font-black uppercase tracking-tight text-brand-light leading-snug group-hover:text-brand-secondary transition-colors">
              {bentoTexts.medTitle}
            </h3>
            <p className="text-xs text-brand-light/70 mt-1 max-w-md leading-relaxed">
              {bentoTexts.medDesc}
            </p>
          </div>

          <div className="flex items-center gap-4 pt-1">
            <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase text-emerald-400">
              <CheckCircle2 size={13} />
              <span>Form PT.33</span>
            </div>
            <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase text-brand-light/60">
              <ShieldCheck size={13} className="text-brand-secondary" />
              <span>100% Legal</span>
            </div>
          </div>
        </div>
      </div>

      {/* SMALL BENTO CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-1 gap-3">
        <div 
          onClick={() => { triggerHaptic('light'); onOpenDelivery(); }}
          className="p-4 rounded-[1.75rem] bg-white/5 border border-white/10 hover:border-white/20 transition-all cursor-pointer active:scale-95 flex flex-col justify-between"
        >
          <div className="w-8 h-8 rounded-xl bg-brand-secondary/10 border border-brand-secondary/30 flex items-center justify-center text-brand-secondary mb-2">
            <Bike size={16} />
          </div>
          <div>
            <h4 className="text-xs font-black uppercase text-brand-light tracking-tight">{bentoTexts.deliveryTitle}</h4>
            <p className="text-[10px] text-brand-light/60 leading-tight mt-0.5">{bentoTexts.deliveryDesc}</p>
          </div>
        </div>

        <div 
          onClick={() => { triggerHaptic('light'); onOpenGuarantees(); }}
          className="p-4 rounded-[1.75rem] bg-white/5 border border-white/10 hover:border-white/20 transition-all cursor-pointer active:scale-95 flex flex-col justify-between"
        >
          <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-2">
            <Leaf size={16} />
          </div>
          <div>
            <h4 className="text-xs font-black uppercase text-brand-light tracking-tight">{bentoTexts.qualityTitle}</h4>
            <p className="text-[10px] text-brand-light/60 leading-tight mt-0.5">{bentoTexts.qualityDesc}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
