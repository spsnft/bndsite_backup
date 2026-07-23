"use client"
import * as React from "react"
import Link from "next/link"
import { 
  Plus, Tag, Zap, MapPin, Leaf, Crown, ShoppingBag, Send, 
  MessageCircle, Instagram, SendHorizontal, ChevronDown, 
  Droplets, Snowflake, Box, Sparkles, Bike, Wallet, Timer, 
  CreditCard, Cigarette, Layers, X, Trophy, Users, ShieldCheck
} from "lucide-react"

import { useCart } from "@/lib/cart-store"
import { BlurImage } from "@/components/blur-image"
import { translations } from "@/lib/translations"
import { ProductModal, CheckoutModal } from "@/components/modals"
import { 
  triggerHaptic, getFirstAvailablePrice, getInterpolatedPrice, isElite,
  TYPE_COLORS, SELECTED_COLOR, IMPORT_COLOR, GOLDEN_COLOR 
} from "@/lib/utils"

const InfoModal = ({ isOpen, onClose, title, children }: { isOpen: boolean, onClose: () => void, title: string, children: React.ReactNode }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 animate-fade-in">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={onClose} />
      <div className="relative w-full max-w-sm bg-brand-primary border border-white/15 rounded-[2.5rem] p-6 text-brand-light shadow-2xl overflow-hidden z-10 max-h-[85vh] flex flex-col">
        <div className="absolute inset-0 opacity-15 pointer-events-none" style={{ background: `radial-gradient(circle at 50% 0%, #A88444, transparent 70%)` }} />
        <div className="flex items-center justify-between mb-6 shrink-0 relative z-10">
          <h3 className="text-[14px] font-black uppercase tracking-[0.15em] text-brand-light">{title}</h3>
          <button onClick={onClose} className="p-2 bg-white/5 hover:bg-white/10 active:scale-90 rounded-full border border-white/10 transition-all text-brand-light/60 hover:text-brand-light">
            <X size={16} />
          </button>
        </div>
        <div className="overflow-y-auto pr-1 flex-1 relative z-10 space-y-5 no-scrollbar">
          {children}
        </div>
      </div>
    </div>
  );
};

const processProductData = (rawProducts: any[]) => {
  if (!Array.isArray(rawProducts)) return [];
  return rawProducts.map(p => {
    if (!p) return p;
    const prices: any = {};
    const oldPrices: any = {};
    Object.keys(p).forEach(key => {
      if (key.startsWith('price_')) {
        const weight = key.replace('price_', '').replace('g', '');
        prices[weight] = p[key];
      }
      if (key.startsWith('oldprice_')) {
        const weight = key.replace('oldprice_', '').replace('g', '');
        oldPrices[weight] = p[key];
      }
    });

    return {
      ...p,
      prices: Object.keys(prices).length ? prices : p.prices,
      old_prices: Object.keys(oldPrices).length ? oldPrices : p.old_prices
    };
  });
};

const BadgeIcon = React.memo(({ type, isSmall }: { type: string, isSmall?: boolean }) => {
  if (!type) return null;
  const iconSize = isSmall ? 13 : 18;
  const colorClass = { NEW: "text-blue-400", SALE: "text-brand-secondary", HIT: "text-orange-400" }[type.toUpperCase()] || "text-brand-light";
  const iconWrapper = (icon: React.ReactNode) => (
    <div className={`${isSmall ? '' : 'p-2 bg-black/40 backdrop-blur-md rounded-full border border-white/15 shadow-lg'}`}>{icon}</div>
  );
  switch (type.toUpperCase()) {
    case "NEW": return iconWrapper(<Plus size={iconSize} className={colorClass} strokeWidth={3} />);
    case "SALE": return iconWrapper(<Tag size={iconSize} className={colorClass} strokeWidth={2.5} />);
    case "HIT": return iconWrapper(<Zap size={iconSize} className={colorClass} strokeWidth={2.5} fill="currentColor" fillOpacity={0.2} />);
    default: return null;
  }
});

const BahtSymbol = React.memo(() => (
  <span className="font-sans text-[0.75em] ml-0.5 opacity-90 align-baseline">฿</span>
));

const HighlightCard = React.memo(({ item, onClick, priority, hideBadge, isMini, showSubcategory }: { item: any, onClick: () => void, priority?: boolean, hideBadge?: boolean, isMini?: boolean, showSubcategory?: boolean }) => {
  if (!item) return null;
  const isPrerolls = item.category === 'joints';
  const sub = item.subcategory?.toLowerCase() || "";
  
  const accentColor = item.category === 'concentrates' 
    ? (sub?.includes('fresh frozen premium') ? "#34D399" : sub?.includes('fresh frozen') ? "#FEC107" : SELECTED_COLOR)
    : (isPrerolls ? GOLDEN_COLOR : (isElite(item) ? (sub?.includes('exclusive') ? SELECTED_COLOR : IMPORT_COLOR) : (sub.includes('classic') ? '#10B981' : (sub === 'selected' ? SELECTED_COLOR : '#A855F7'))));
  
  const priceInfo = getFirstAvailablePrice(item) || { price: 0, weight: 0 };
  const currentPrice = priceInfo.price || 0;
  const firstWeight = priceInfo.weight || 0;
  
  let oldPrice = 0;
  if (item.old_prices && firstWeight > 0) {
    try {
      oldPrice = Math.round(getInterpolatedPrice(firstWeight, item.old_prices, isElite(item))) || 0;
    } catch(e) {}
  }

  return (
    <div 
      onClick={() => { triggerHaptic('light'); onClick(); }} 
      className={`relative rounded-[2rem] active:scale-[0.98] transition-all cursor-pointer group flex flex-col overflow-hidden border ${isMini ? 'h-[170px]' : 'h-[230px]'} bg-brand-primary hover:border-white/30`} 
      style={{ borderColor: `${accentColor}A0` }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/10 to-black/70 pointer-events-none" />
      <div className="absolute inset-0 opacity-50 pointer-events-none transition-opacity group-hover:opacity-70" style={{ background: `radial-gradient(circle at 50% 100%, ${accentColor}, transparent 65%)` }} />
      
      {!hideBadge && item.badge && (<div className={`absolute top-2 right-2 z-20 ${isMini ? 'scale-75' : 'scale-90'}`}><BadgeIcon type={item.badge} /></div>)}
      
      <div className="relative z-10 px-5 py-3 pb-0 flex-1 flex flex-col min-h-0">
        <div className="min-w-0 pr-6">
          <h3 className={`${isMini ? 'text-[11px]' : 'text-[13px]'} font-black uppercase tracking-tight leading-tight text-brand-light group-hover:text-brand-secondary transition-colors`}>{item.name}</h3>
          {showSubcategory && (<p className={`${isMini ? 'text-[8px]' : 'text-[9px]'} font-bold mt-1 text-brand-light/50 uppercase tracking-widest italic`}>{item.subcategory?.includes('classic') ? 'Classic' : 'Premium'}</p>)}
        </div>
        <div className="relative flex-1 w-full min-h-0 flex items-center justify-center my-1">
            <BlurImage src={item.image} priority={priority} width={180} height={180} className="max-w-full max-h-full object-contain transform group-hover:scale-105 transition-transform duration-300" alt={item.name} />
        </div>
      </div>

      <div className="relative z-10 flex justify-between items-end px-5 pb-4 mt-auto">
        <span className={`${isMini ? 'text-[8px]' : 'text-[9px]'} font-black uppercase tracking-widest brightness-125`} style={{ color: TYPE_COLORS[item.type?.toLowerCase()] || "#FFF" }}>{item.type}</span>
        <div className="flex flex-col items-end">
          {oldPrice > currentPrice && <span className={`${isMini ? 'text-[9px]' : 'text-[11px]'} font-bold line-through opacity-40 text-brand-light canvas-leading-none mb-0.5`}>{oldPrice}<BahtSymbol /></span>}
          <p className={`${isMini ? 'text-[15px]' : 'text-[19px]'} font-black tracking-tighter leading-none text-brand-light`}>{currentPrice > 0 ? (<>{currentPrice}<BahtSymbol /></>) : '—'}</p>
        </div>
      </div>
    </div>
  );
});

const ProductRow = React.memo(({ p, onClick }: { p: any, onClick: () => void }) => {
  if (!p) return null;
  const isAccessory = p.category === 'accessories';
  const typeKey = p.type?.toLowerCase() || "";
  return (
    <div onClick={() => { triggerHaptic('light'); onClick(); }} className="flex items-center justify-between gap-3 px-4 py-4 text-brand-light border-b border-white/10 last:border-b-0 active:bg-white/5 hover:bg-white/5 transition-colors cursor-pointer group">
        <div className="flex items-center gap-4 truncate flex-1">
          <div className="w-8 flex justify-center shrink-0">{p.badge && <BadgeIcon type={p.badge} isSmall={true} />}</div>
          <span className="text-[14px] font-black uppercase tracking-tight text-brand-light/90 truncate leading-tight group-hover:text-brand-secondary transition-colors">{p.name}</span>
        </div>
        <div className="flex items-center gap-5 shrink-0 pr-4">
          {isAccessory ? (
            <span className="text-[14px] font-black text-brand-light/90">{Math.round(Number(p.prices?.['1']) || 0)}<BahtSymbol /></span>
          ) : (
            p.farm && p.farm !== "-" && <span className="text-[9px] font-bold text-brand-light/50 uppercase tracking-widest truncate max-w-[90px]">{p.farm}</span>
          )}
          <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: TYPE_COLORS[typeKey] || '#10B981' }}>{p.type}</span>
        </div>
    </div>
  );
});

export default function LandingClient({ initialProducts = [], initialDescriptions = [] }: { initialProducts: any[], initialDescriptions?: any[] }) {
  // === НОВОЕ: загрузка товаров через API-роут ===
  const [products, setProducts] = React.useState(initialProducts);
  const [isLoading, setIsLoading] = React.useState(initialProducts.length === 0);

  React.useEffect(() => {
    if (initialProducts.length === 0) {
      fetch('/420/api/products')
        .then(res => res.json())
        .then(data => {
          if (data.products && data.products.length > 0) {
            setProducts(data.products);
          }
          setIsLoading(false);
        })
        .catch(() => setIsLoading(false));
    }
  }, [initialProducts]);
  // === КОНЕЦ НОВОГО ===

  const processedProducts = React.useMemo(() => processProductData(products), [products]);
  const [selectedProduct, setSelectedProduct] = React.useState<any>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = React.useState(false);
  
  const [isDeliveryModalOpen, setIsDeliveryModalOpen] = React.useState(false);
  const [isGuaranteesModalOpen, setIsGuaranteesModalOpen] = React.useState(false);

  const [closedGrades, setClosedGrades] = React.useState<string[]>([]);
  const { items, getTotal, lang, setLang } = useCart();
  const t = translations[lang as keyof typeof translations];

  const recentUpdates = React.useMemo(() => {
    const news = processedProducts.filter(p => p && p.badge?.toUpperCase() === 'NEW');
    return [...news].sort((a, b) => (Number(b.id) || 0) - (Number(a.id) || 0));
  }, [processedProducts]);

  const flashSales = React.useMemo(() => {
    const sales = processedProducts.filter(p => p && p.badge?.toUpperCase() === 'SALE');
    return [...sales].sort((a, b) => (Number(b.id) || 0) - (Number(a.id) || 0));
  }, [processedProducts]);
  
  const gradeSections = React.useMemo(() => {
    const buds = processedProducts.filter(p => p.category === 'buds' && !isElite(p));
    
    const classicRegular = buds.filter(p => p.subcategory?.toLowerCase() === 'classic');
    const classicSale = buds.filter(p => p.subcategory?.toLowerCase() === 'classic sale');
    
    const premiumRegular = buds.filter(p => p.subcategory?.toLowerCase() === 'premium');
    const premiumSale = buds.filter(p => p.subcategory?.toLowerCase() === 'premium sale');

    const sections = [];
    
    if (classicRegular.length > 0 || classicSale.length > 0) {
      sections.push({
        id: 'classic',
        title: 'Classic Grade',
        color: '#10B981',
        icon: Leaf,
        regularItems: classicRegular,
        saleItems: classicSale,
        priceRef: classicRegular[0] || classicSale[0],
        salePriceRef: classicSale[0]
      });
    }
    
    if (premiumRegular.length > 0 || premiumSale.length > 0) {
      sections.push({
        id: 'premium',
        title: 'Premium Grade',
        color: '#A855F7',
        icon: Crown,
        regularItems: premiumRegular,
        saleItems: premiumSale,
        priceRef: premiumRegular[0] || premiumSale[0],
        salePriceRef: premiumSale[0]
      });
    }
    
    return sections;
  }, [processedProducts]);

  const combinedEliteSection = React.useMemo(() => {
    const items = processedProducts.filter(p => 
      (p.category === 'buds' && p.subcategory?.toLowerCase().includes('exclusive')) ||
      (p.category === 'buds' && p.subcategory?.toLowerCase().includes('import') && !p.subcategory?.toLowerCase().includes('loose')) ||
      (p.category === 'import loose' || p.subcategory?.toLowerCase() === 'import loose')
    );
    
    if (items.length === 0) return null;
    return {
      id: 'import_exclusive_combined',
      title: lang === 'ru' ? 'Импорт и эксклюзивы' : 'Import & Exclusives',
      items,
      color: IMPORT_COLOR,
      icon: MapPin
    };
  }, [processedProducts, lang]);

  const concentrateSections = React.useMemo(() => {
    const allConcs = processedProducts.filter(p => p && p.category === 'concentrates');
    const subs = Array.from(new Set(allConcs.map(p => p.subcategory).filter(Boolean)));
    return subs.map(sub => {
      let color = '#10B981'; let icon = Droplets; const subLower = sub?.toLowerCase() || "";
      if (subLower.includes('old school')) { color = "#C1C1C1"; icon = Box; }
      else if (subLower.includes('fresh frozen')) { color = subLower.includes('premium') ? "#34D399" : "#FEC107"; icon = Snowflake; }
      else if (subLower.includes('live rosin')) { color = "#A855F7"; icon = Droplets; }
      
      const subItems = allConcs.filter(p => p.subcategory === sub);
      const regularItems = subItems.filter(p => p.badge?.toUpperCase() !== 'SALE');
      const saleItems = subItems.filter(p => p.badge?.toUpperCase() === 'SALE');

      return { 
        id: sub, 
        title: sub || "Concentrates", 
        regularItems,
        saleItems,
        priceRef: regularItems[0] || subItems[0], 
        salePriceRef: saleItems[0],
        color, 
        icon 
      };
    });
  }, [processedProducts]);

  const accessoriesSections = React.useMemo(() => {
    const allAccs = processedProducts.filter(p => p && p.category === 'accessories');
    if (allAccs.length === 0) return null;
    const subs = Array.from(new Set(allAccs.map(p => p.subcategory).filter(Boolean)));
    return subs.map(sub => ({
      id: sub,
      title: sub || (lang === 'ru' ? 'Аксессуары' : 'Accessories'),
      items: allAccs.filter(p => p.subcategory === sub),
      color: "#EC4899",
      icon: Layers
    }));
  }, [processedProducts, lang]);

  const prerollSections = React.useMemo(() => {
    const allJoints = processedProducts.filter(p => p && p.category === 'joints');
    const subs = Array.from(new Set(allJoints.map(p => p.subcategory).filter(Boolean)));
    return subs.map(sub => {
      const subItems = allJoints.filter(p => p.subcategory === sub);
      const regularItems = subItems.filter(p => p.badge?.toUpperCase() !== 'SALE');
      const saleItems = subItems.filter(p => p.badge?.toUpperCase() === 'SALE');

      return { 
        id: sub, 
        title: sub || "Prerolls", 
        regularItems,
        saleItems,
        priceRef: regularItems[0] || subItems[0],
        salePriceRef: saleItems[0],
        color: GOLDEN_COLOR, 
        icon: Cigarette 
      };
    });
  }, [processedProducts]);

  const toggleSection = (id: string) => {
    triggerHaptic('light');
    setClosedGrades(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);
  };

  const handleAnchorNavigation = (targetSectionId: string, accordionIdsToOpen: string[], allAccordionIds: string[]) => {
    triggerHaptic('medium');
    const el = document.getElementById(targetSectionId);
    if (el) {
      const offset = 20;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = el.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      window.scrollTo({ top: elementPosition - offset, behavior: 'smooth' });
    }
    setTimeout(() => {
      const newClosedGrades = allAccordionIds.filter(id => !accordionIdsToOpen.includes(id));
      setClosedGrades(newClosedGrades);
    }, 400);
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      triggerHaptic('light');
      const offset = 20;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = el.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      window.scrollTo({ top: elementPosition - offset, behavior: 'smooth' });
    }
  };

  const allSectionIds = React.useMemo(() => {
    const ids = ['classic', 'premium'];
    if (combinedEliteSection) ids.push(combinedEliteSection.id);
    concentrateSections.forEach(s => ids.push(s.id));
    prerollSections.forEach(s => ids.push(s.id));
    if (accessoriesSections) accessoriesSections.forEach(s => ids.push(s.id));
    return ids;
  }, [combinedEliteSection, concentrateSections, prerollSections, accessoriesSections]);

  // === ЗАГРУЗКА ===
  if (isLoading) {
    return (
      <div className="min-h-screen bg-brand-primary flex items-center justify-center">
        <p className="text-brand-light/60 font-black uppercase tracking-widest text-sm animate-pulse">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-primary text-brand-light p-4 pb-32 selection:bg-brand-secondary/30 font-sans">
      <header className="max-w-xl mx-auto pt-0 mb-0">
        <div className="flex items-center justify-between px-2 mb-[4px]"> 
           <div className="relative">
              <div className="absolute inset-0 bg-brand-secondary/10 rounded-full blur-[35px]"></div>
              <BlurImage src="https://res.cloudinary.com/dpjwbcgrq/image/upload/v1774704686/IMG_0036_t5cnic.png" priority width={80} height={80} className="w-20 h-20 object-contain relative z-10" alt="Logo" />
           </div>
           <div className="flex items-center flex-1 justify-end">
              <div className="flex gap-2">
                <Link href="https://line.me/R/ti/p/@mpsphuket" target="_blank" className="w-[46px] h-[46px] flex items-center justify-center bg-white/5 rounded-2xl border border-white/10 active:scale-90 transition-all shadow-xl">
                  <MessageCircle size={18} className="opacity-80"/>
                </Link>
                <Link href="https://wa.me/66612345678" target="_blank" className="w-[46px] h-[46px] flex items-center justify-center bg-white/5 rounded-2xl border border-white/10 active:scale-90 transition-all shadow-xl">
                  <SendHorizontal size={18} className="opacity-80"/>
                </Link>
                <Link href="https://www.instagram.com/boshkunadoroshku" target="_blank" className="w-[46px] h-[46px] flex items-center justify-center bg-white/5 rounded-2xl border border-white/10 active:scale-90 transition-all shadow-xl">
                  <Instagram size={18} className="opacity-80"/>
                </Link>
              </div>
              <button onClick={() => { triggerHaptic('light'); setLang(lang === 'en' ? 'ru' : 'en'); }} className="ml-2 w-[46px] h-[46px] flex items-center justify-center bg-white/5 rounded-2xl border border-white/10 font-black text-[10px] text-brand-secondary active:scale-90 transition-all shrink-0">{lang === 'en' ? 'RU' : 'EN'}</button>
           </div>
        </div>

        <div className="flex flex-wrap sm:flex-nowrap gap-2 px-2 mb-4 mt-2 relative z-20">
          <button onClick={() => { triggerHaptic('light'); setIsDeliveryModalOpen(true); }} className="flex-1 flex items-center justify-center gap-2 h-[44px] px-2.5 bg-white/5 active:bg-white/10 active:scale-[0.98] rounded-[1.5rem] border border-white/15 backdrop-blur-md transition-all whitespace-nowrap overflow-hidden">
            <Bike size={15} className="text-brand-secondary shrink-0" />
            <span className="text-[10px] font-black uppercase tracking-wider text-brand-light/90 truncate">{lang === 'ru' ? 'Доставка и оплата' : 'Delivery & Payment'}</span>
          </button>
          <button onClick={() => { triggerHaptic('light'); setIsGuaranteesModalOpen(true); }} className="flex-1 flex items-center justify-center gap-2 h-[44px] px-2.5 bg-white/5 active:bg-white/10 active:scale-[0.98] rounded-[1.5rem] border border-white/15 backdrop-blur-md transition-all whitespace-nowrap overflow-hidden">
            <ShieldCheck size={15} className="text-brand-secondary shrink-0" />
            <span className="text-[10px] font-black uppercase tracking-wider text-brand-light/90 truncate">{lang === 'ru' ? 'О нас и Гарантии' : 'Our Guarantees'}</span>
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2 px-2 mb-6 relative z-20">
          <div className="relative rounded-[1.5rem] border border-white/15 flex overflow-hidden col-span-2 bg-brand-primary h-[68px]">
            <div 
              onClick={() => handleAnchorNavigation('buds-menu', ['classic'], allSectionIds)} 
              className="relative flex-1 flex items-center justify-center cursor-pointer transition-all duration-300 bg-brand-secondary/10 hover:bg-brand-secondary/20 active:bg-brand-secondary/30 group border-r border-white/15"
            >
              <div className="absolute left-6 top-1/2 -translate-y-1/2 pointer-events-none z-0 opacity-[0.15] scale-[2.2] -rotate-12 transition-transform group-hover:scale-[2.4] duration-500">
                <Leaf style={{ color: '#FFF' }} strokeWidth={1.5} />
              </div>
              <div className="relative z-10 flex flex-col items-center text-center gap-0.5 min-w-0 pl-14">
                <span className="text-[11px] font-black tracking-[0.2em] text-brand-light/50 uppercase leading-none">{lang === 'ru' ? 'БОШКИ' : 'FLOWERS'}</span>
                <h3 className="text-[15px] font-black tracking-wider text-brand-light uppercase leading-none truncate group-hover:text-brand-secondary transition-colors">{lang === 'ru' ? 'КЛАССИКА' : 'CLASSIC'}</h3>
              </div>
            </div>
            <div 
              onClick={() => handleAnchorNavigation('buds-menu', ['premium'], allSectionIds)} 
              className="relative flex-1 flex items-center justify-center cursor-pointer transition-all duration-300 bg-purple-500/10 hover:bg-purple-500/20 active:bg-purple-500/30 group"
            >
              <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none z-0 opacity-[0.15] scale-[2.2] rotate-12 transition-transform group-hover:scale-[2.4] duration-500">
                <Crown style={{ color: '#FFF' }} strokeWidth={1.5} />
              </div>
              <div className="relative z-10 flex flex-col items-center text-center gap-0.5 min-w-0 pr-14">
                <span className="text-[11px] font-black tracking-[0.2em] text-brand-light/50 uppercase leading-none">{lang === 'ru' ? 'БОШКИ' : 'FLOWERS'}</span>
                <h3 className="text-[15px] font-black tracking-wider text-brand-light uppercase leading-none truncate group-hover:text-brand-secondary transition-colors">{lang === 'ru' ? 'ПРЕМИУМ' : 'PREMIUM'}</h3>
              </div>
            </div>
          </div>

          {[
            { id: 'import', title: lang === 'ru' ? 'ИМПОРТ И ЭКСКЛЮЗИВЫ' : 'IMPORT & EXCLUSIVES', icon: MapPin, scroll: 'import-menu-section', bgClass: 'bg-blue-500/10 hover:bg-blue-500/20' },
            { id: 'concentrates', title: lang === 'ru' ? 'КОНЦЕНТРАТЫ' : 'CONCENTRATES', icon: Droplets, scroll: 'concentrates-menu-section', bgClass: 'bg-amber-500/10 hover:bg-amber-500/20' },
            { id: 'prerolls', title: lang === 'ru' ? 'ПРЕРОЛЛЫ' : 'PREROLLS', icon: Cigarette, scroll: 'prerolls-menu-section', bgClass: 'bg-brand-secondary/10 hover:bg-brand-secondary/20' },
            { id: 'accessories', title: lang === 'ru' ? 'АКСЕССУАРЫ' : 'ACCESSORIES', icon: Layers, scroll: 'accessories-menu-section', bgClass: 'bg-brand-secondary/10 hover:bg-brand-secondary/20' }
          ].map((btn) => (
            <div 
              key={btn.id} 
              onClick={() => {
                if (btn.id === 'import' && combinedEliteSection) {
                  handleAnchorNavigation(btn.scroll, [combinedEliteSection.id], allSectionIds);
                } else if (btn.id === 'concentrates') {
                  handleAnchorNavigation(btn.scroll, concentrateSections.map(s => s.id), allSectionIds);
                } else if (btn.id === 'prerolls') {
                  handleAnchorNavigation(btn.scroll, prerollSections.map(s => s.id), allSectionIds);
                } else if (btn.id === 'accessories' && accessoriesSections) {
                  handleAnchorNavigation(btn.scroll, accessoriesSections.map(s => s.id), allSectionIds);
                } else {
                  scrollToSection(btn.scroll);
                }
              }} 
              className={`relative rounded-[1.5rem] border border-white/15 flex items-center justify-center overflow-hidden cursor-pointer transition-all duration-300 backdrop-blur-sm active:scale-[0.98] group col-span-1 h-[52px] ${btn.bgClass}`}
            >
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/30 pointer-events-none z-0" />
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 opacity-[0.15] scale-[1.8] transition-transform group-hover:scale-[2.0] duration-500">
                <btn.icon style={{ color: '#FFF' }} strokeWidth={1.5} />
              </div>
              <div className="relative z-10 flex items-center justify-center w-full min-w-0 px-2 text-center">
                <h3 className="font-black text-[10px] tracking-wider text-brand-light uppercase group-hover:text-brand-secondary transition-colors whitespace-nowrap overflow-hidden text-ellipsis truncate max-w-full">{btn.title}</h3>
              </div>
            </div>
          ))}
        </div>
      </header>

      <div className="max-w-xl mx-auto space-y-0">
        {recentUpdates.length > 0 && (
          <section className="mt-[12px] mb-[12px] space-y-3 overflow-hidden">
            <div className="flex items-center gap-2 px-2"><BadgeIcon type="NEW" /><h2 className="text-[12px] font-black uppercase tracking-[0.3em] text-brand-light/80">{t.updates || 'New'}</h2></div>
            <div className="flex gap-4 overflow-x-auto pb-1 no-scrollbar mx-[-1rem] px-4 snap-x">{recentUpdates.map((p, idx) => (<div key={p?.id || idx} className="w-[170px] shrink-0 snap-start"><HighlightCard item={p} onClick={() => setSelectedProduct(p)} priority={idx < 4} hideBadge={true} isMini={false} showSubcategory={true} /></div>))}</div>
          </section>
        )}
        {flashSales.length > 0 && (
          <section className="mt-[12px] mb-[12px] space-y-3 overflow-hidden">
            <div className="flex items-center gap-2 px-2">
              <BadgeIcon type="SALE" />
              <h2 className="text-[12px] font-black uppercase tracking-[0.3em] text-brand-light/80">
                {lang === 'ru' ? 'Распродажи недели' : 'Sales of the week'}
              </h2>
            </div>
            <div className="flex gap-4 overflow-x-auto pb-1 no-scrollbar mx-[-1rem] px-4 snap-x">{flashSales.map((p, idx) => (<div key={p?.id || idx} className="w-[170px] shrink-0 snap-start"><HighlightCard item={p} onClick={() => setSelectedProduct(p)} priority={idx < 4} hideBadge={true} isMini={false} showSubcategory={true} /></div>))}</div>
          </section>
        )}
        
        <div className="space-y-1">
          <div id="buds-menu" className="flex items-center gap-4 pt-6 pb-6 relative">
             <div className="h-[2px] flex-1 bg-gradient-to-r from-transparent via-brand-secondary/50 to-brand-secondary"></div>
             <span className="text-[16px] font-black uppercase tracking-[0.3em] text-brand-light px-6 py-2 rounded-full border border-brand-secondary/30 bg-brand-secondary/10 backdrop-blur-md">{t.flowerMenu || 'Menu'}</span>
             <div className="h-[2px] flex-1 bg-gradient-to-l from-transparent via-brand-secondary/50 to-brand-secondary"></div>
          </div>
          
          <div className="space-y-3">
            {gradeSections.map(({ id, title, color, icon: Icon, regularItems, saleItems, priceRef, salePriceRef }) => {
              const isOpen = !closedGrades.includes(id);
              return (
                <div key={id} className="rounded-[2rem] overflow-hidden border transition-all duration-300 bg-brand-primary" style={{ borderColor: isOpen ? `${color}A0` : 'rgba(255,255,255,0.08)' }}>
                  <button onClick={() => toggleSection(id)} className="w-full px-4 pt-3 pb-3 flex items-center justify-between active:bg-white/5 transition-colors text-left group">
                    <div className="flex items-center gap-3">
                      <Icon size={22} style={{ color: color }} />
                      <h2 className="text-[15px] font-black uppercase tracking-tighter group-hover:text-brand-secondary transition-colors" style={{ color: color }}>{title}</h2>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] font-black uppercase tracking-widest opacity-40 text-brand-light">
                        {isOpen ? (lang === 'ru' ? 'Свернуть' : 'Close') : (lang === 'ru' ? 'Развернуть' : 'Open')}
                      </span>
                      <ChevronDown size={20} className={`opacity-40 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                    </div>
                  </button>

                  <div className={`overflow-hidden transition-all duration-500 ${isOpen ? 'max-h-[3000px]' : 'max-h-0'}`}>
                    <div className="bg-white/[0.02]">
                        {saleItems.length > 0 && (
                            <div className="border-b border-white/5">
                                <div className="border-b border-amber-500/10 bg-amber-500/[0.02] py-3.5 px-6 flex flex-col gap-2.5">
                                    <div className="flex items-center gap-2 opacity-90 text-amber-400">
                                        <Tag size={13} className="text-amber-400 fill-amber-400/10" />
                                        <span className="text-[10px] font-black uppercase tracking-[0.15em]">
                                            {lang === 'ru' ? 'Сорта со скидкой' : 'Strains on Sale'}
                                        </span>
                                    </div>
                                    <div className="grid grid-cols-4 gap-
