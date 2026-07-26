"use client"
import * as React from "react"
import Image from "next/image"
import { Plus, Tag, Zap } from "lucide-react"
import { 
  triggerHaptic, 
  getFirstAvailablePrice, 
  TYPE_COLORS, 
  GOLDEN_COLOR 
} from "@/lib/utils"

const FALLBACK_IMAGE = "/420/images/logo.svg";

export const BahtSymbol = React.memo(() => (
  <span className="font-sans text-[0.75em] ml-0.5 opacity-90 align-baseline">฿</span>
));

export const BadgeIcon = React.memo(({ type, isSmall }: { type: string, isSmall?: boolean }) => {
  if (!type) return null;
  const iconSize = isSmall ? 13 : 18;
  const colorClass = { 
    NEW: "text-blue-400", 
    SALE: "text-brand-secondary", 
    HIT: "text-orange-400" 
  }[type.toUpperCase()] || "text-brand-light";

  const iconWrapper = (icon: React.ReactNode) => (
    <div className={isSmall ? '' : 'p-2 bg-black/40 backdrop-blur-md rounded-full border border-white/15 shadow-lg'}>
      {icon}
    </div>
  );

  switch (type.toUpperCase()) {
    case "NEW": return iconWrapper(<Plus size={iconSize} className={colorClass} strokeWidth={3} />);
    case "SALE": return iconWrapper(<Tag size={iconSize} className={colorClass} strokeWidth={2.5} />);
    case "HIT": return iconWrapper(<Zap size={iconSize} className={colorClass} strokeWidth={2.5} fill="currentColor" fillOpacity={0.2} />);
    default: return null;
  }
});

export const HighlightCard = React.memo(({ item, onClick, priority }: { item: any, onClick: () => void, priority?: boolean }) => {
  if (!item) return null;
  
  const [imgSrc, setImgSrc] = React.useState(item.image || FALLBACK_IMAGE);

  const typeUpper = item.type?.toUpperCase() || "";
  let accentColor = '#3A6B58';
  if (item.category === 'joints') accentColor = GOLDEN_COLOR;
  else if (typeUpper === 'SATIVA') accentColor = '#B65C3A';
  else if (typeUpper === 'INDICA') accentColor = '#8A5A96';
  else if (typeUpper === 'HYBRID') accentColor = '#3A6B58';
  
  const priceInfo = getFirstAvailablePrice(item) || { price: 0, weight: 0 };
  const currentPrice = priceInfo.price || 0;

  return (
    <div 
      onClick={() => { triggerHaptic('light'); onClick(); }} 
      className="relative rounded-[2rem] active:scale-[0.98] transition-all cursor-pointer group flex flex-col overflow-hidden border h-[200px] bg-brand-primary hover:border-white/30" 
      style={{ borderColor: `${accentColor}A0` }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/10 to-black/70 pointer-events-none" />
      <div className="absolute inset-0 opacity-30 pointer-events-none transition-opacity group-hover:opacity-50" style={{ background: `radial-gradient(circle at 50% 100%, ${accentColor}, transparent 65%)` }} />
      
      <div className="relative z-10 px-4 py-3 pb-0 flex-1 flex flex-col min-h-0">
        <div className="min-w-0 pr-6">
          <h3 className="text-[12px] font-black uppercase tracking-tight leading-tight text-brand-light group-hover:text-brand-secondary transition-colors truncate">
            {item.name}
          </h3>
        </div>
        <div className="relative flex-1 w-full min-h-0 flex items-center justify-center my-1">
          <Image
            src={imgSrc}
            alt={item.name || "Product"}
            fill
            className="object-contain transform group-hover:scale-105 transition-transform duration-300 filter drop-shadow-lg"
            sizes="160px"
            priority={priority}
            onError={() => setImgSrc(FALLBACK_IMAGE)}
          />
        </div>
      </div>

      <div className="relative z-10 flex justify-between items-end px-4 pb-3 mt-auto">
        <span className="text-[8px] font-black uppercase tracking-widest brightness-125" style={{ color: accentColor }}>
          {item.type}
        </span>
        <p className="text-[16px] font-black tracking-tighter leading-none text-brand-light">
          {currentPrice > 0 ? (<>{currentPrice}<BahtSymbol /></>) : '—'}
        </p>
      </div>
    </div>
  );
});

export const ProductRow = React.memo(({ p, onClick }: { p: any, onClick: () => void }) => {
  if (!p) return null;
  
  const [imgSrc, setImgSrc] = React.useState(p.image || FALLBACK_IMAGE);
  
  const typeKey = p.type?.toLowerCase() || "";
  const priceInfo = getFirstAvailablePrice(p) || { price: 0 };
  const displayPrice = priceInfo.price || 0;

  return (
    <div 
      onClick={() => { triggerHaptic('light'); onClick(); }} 
      className="flex items-center justify-between gap-3 px-4 py-4 text-brand-light border-b border-white/10 last:border-b-0 active:bg-white/5 hover:bg-white/5 transition-colors cursor-pointer group"
    >
      <div className="flex items-center gap-3 truncate flex-1">
        <div className="w-8 h-8 bg-black/10 rounded-xl overflow-hidden p-0.5 shrink-0 flex items-center justify-center border border-white/5 relative">
          <Image
            src={imgSrc}
            alt={p.name || "Product"}
            fill
            className="object-contain"
            sizes="32px"
            onError={() => setImgSrc(FALLBACK_IMAGE)}
          />
        </div>
        <div className="truncate">
          <span className="text-[13px] font-black uppercase tracking-tight text-brand-light/90 truncate leading-tight group-hover:text-brand-secondary transition-colors block">
            {p.name}
          </span>
          {p.farm && p.farm !== "-" && (
            <span className="text-[9px] font-bold text-brand-light/40 uppercase tracking-widest block truncate">
              {p.farm}
            </span>
          )}
        </div>
      </div>
      
      <div className="flex items-center gap-4 shrink-0">
        <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: TYPE_COLORS[typeKey] || '#10B981' }}>
          {p.type}
        </span>
        <span className="text-[14px] font-black text-brand-light">
          {displayPrice > 0 ? (<>{displayPrice}<BahtSymbol /></>) : '—'}
        </span>
      </div>
    </div>
  );
});
