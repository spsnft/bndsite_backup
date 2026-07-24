"use client"
import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { 
  Plus, Tag, Zap, Leaf, ShoppingBag, Send, 
  MessageCircle, Phone, Instagram, ChevronDown, 
  Sparkles, Bike, Wallet, Timer, 
  CreditCard, X, Trophy, Users, ShieldCheck, Cigarette, Layers
} from "lucide-react"

import { useCart } from "@/lib/cart-store"
import { BlurImage } from "@/components/blur-image"
import { translations } from "@/lib/translations"
import { ProductModal, CheckoutModal } from "@/components/modals"
import { 
  triggerHaptic, getFirstAvailablePrice, getInterpolatedPrice, isElite,
  TYPE_COLORS, SELECTED_COLOR, GOLDEN_COLOR 
} from "@/lib/utils"

// === ВСПОМОГАТЕЛЬНЫЕ КОМПОНЕНТЫ ===

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

const BahtSymbol = React.memo(() => (
  <span className="font-sans text-[0.75em] ml-0.5 opacity-90 align-baseline">฿</span>
));

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

// Карточка для каруселей NEW/SALE
const HighlightCard = React.memo(({ item, onClick, priority }: { item: any, onClick: () => void, priority?: boolean }) => {
  if (!item) return null;
  const sub = item.subcategory?.toLowerCase() || "";
  const accentColor = item.category === 'joints' ? GOLDEN_COLOR : (sub.includes('classic') ? '#10B981' : (sub === 'selected' ? SELECTED_COLOR : '#A855F7'));
  const priceInfo = getFirstAvailablePrice(item) || { price: 0, weight: 0 };
  const currentPrice = priceInfo.price || 0;

  return (
    <div 
      onClick={() => { triggerHaptic('light'); onClick(); }} 
      className="relative rounded-[2rem] active:scale-[0.98] transition-all cursor-pointer group flex flex-col overflow-hidden border h-[200px] bg-brand-primary hover:border-white/30" 
      style={{ borderColor: `${accentColor}A0` }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/10 to-black/70 pointer-events-none" />
      <div className="absolute inset-0 opacity-50 pointer-events-none transition-opacity group-hover:opacity-70" style={{ background: `radial-gradient(circle at 50% 100%, ${accentColor}, transparent 65%)` }} />
      
      <div className="relative z-10 px-4 py-3 pb-0 flex-1 flex flex-col min-h-0">
        <div className="min-w-0 pr-6">
          <h3 className="text-[12px] font-black uppercase tracking-tight leading-tight text-brand-light group-hover:text-brand-secondary transition-colors">{item.name}</h3>
        </div>
        <div className="relative flex-1 w-full min-h-0 flex items-center justify-center my-1">
            <BlurImage src={item.image} priority={priority} width={160} height={160} className="max-w-full max-h-full object-contain transform group-hover:scale-105 transition-transform duration-300" alt={item.name} />
        </div>
      </div>
      <div className="relative z-10 flex justify-between items-end px-4 pb-3 mt-auto">
        <span className="text-[8px] font-black uppercase tracking-widest brightness-125" style={{ color: TYPE_COLORS[item.type?.toLowerCase()] || "#FFF" }}>{item.type}</span>
        <p className="text-[16px] font-black tracking-tighter leading-none text-brand-light">{currentPrice > 0 ? (<>{currentPrice}<BahtSymbol /></>) : '—'}</p>
      </div>
    </div>
  );
});

// Строка для списков Buds, Joints, Accessories
const ProductRow = React.memo(({ p, onClick }: { p: any, onClick: () => void }) => {
  if (!p) return null;
  const typeKey = p.type?.toLowerCase() || "";
  const priceInfo = getFirstAvailablePrice(p) || { price: 0 };
  const displayPrice = priceInfo.price || 0;

  return (
    <div onClick={() => { triggerHaptic('light'); onClick(); }} className="flex items-center justify-between gap-3 px-4 py-4 text-brand-light border-b border-white/10 last:border-b-0 active:bg-white/5 hover:bg-white/5 transition-colors cursor-pointer group">
        <div className="flex items-center gap-3 truncate flex-1">
          <div className="w-8 h-8 bg-black/10 rounded-xl overflow-hidden p-0.5 shrink-0">
            <BlurImage src={p.image} width={32} height={32} className="w-full h-full object-contain" alt={p.name} />
          </div>
          <div className="truncate">
            <span className="text-[13px] font-black uppercase tracking-tight text-brand-light/90 truncate leading-tight group-hover:text-brand-secondary transition-colors">{p.name}</span>
            {p.farm && p.farm !== "-" && <span className="text-[9px] font-bold text-brand-light/40 uppercase tracking-widest block truncate">{p.farm}</span>}
          </div>
        </div>
        <div className="flex items-center gap-4 shrink-0">
          <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: TYPE_COLORS[typeKey] || '#10B981' }}>{p.type}</span>
          <span className="text-[14px] font-black text-brand-light">{displayPrice > 0 ? (<>{displayPrice}<BahtSymbol /></>) : '—'}</span>
        </div>
    </div>
  );
});

// === ГЛАВНЫЙ КОМПОНЕНТ ===

export default function LandingClient({ initialProducts = [], initialDescriptions = [] }: { initialProducts: any[], initialDescriptions?: any[] }) {
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

  const processedProducts = React.useMemo(() => processProductData(products), [products]);
  const [selectedProduct, setSelectedProduct] = React.useState<any>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = React.useState(false);
  const [isDeliveryModalOpen, setIsDeliveryModalOpen] = React.useState(false);
  const [isGuaranteesModalOpen, setIsGuaranteesModalOpen] = React.useState(false);
  const [openSections, setOpenSections] = React.useState<string[]>([]);
  
  const { items, getTotal, lang, setLang } = useCart();
  const t = translations[lang as keyof typeof translations];

  // Карусели
  const recentUpdates = React.useMemo(() => {
    return processedProducts.filter(p => p && p.badge?.toUpperCase() === 'NEW').sort((a, b) => (Number(b.id) || 0) - (Number(a.id) || 0));
  }, [processedProducts]);

  const flashSales = React.useMemo(() => {
    return processedProducts.filter(p => p && p.badge?.toUpperCase() === 'SALE').sort((a, b) => (Number(b.id) || 0) - (Number(a.id) || 0));
  }, [processedProducts]);

  // Категории
  const buds = React.useMemo(() => processedProducts.filter(p => p && p.category === 'buds'), [processedProducts]);
  const joints = React.useMemo(() => processedProducts.filter(p => p && p.category === 'joints'), [processedProducts]);
  const accessories = React.useMemo(() => processedProducts.filter(p => p && p.category === 'accessories'), [processedProducts]);

  const toggleSection = (id: string) => {
    triggerHaptic('light');
    setOpenSections(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);
  };

  // Загрузка
  if (isLoading) {
    return (
      <div className="min-h-screen bg-brand-primary flex items-center justify-center">
        <p className="text-brand-light/60 font-black uppercase tracking-widest text-sm animate-pulse">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-primary text-brand-light p-4 pb-32 selection:bg-brand-secondary/30 font-sans">
      
      {/* === ШАПКА === */}
      <header className="max-w-xl mx-auto pt-0 mb-0">
        <div className="flex items-center justify-between px-2 mb-[4px]"> 
           <div className="relative">
              <div className="absolute inset-0 bg-brand-secondary/10 rounded-full blur-[35px]"></div>
              <Image 
                src="/420/images/logo.svg" 
                priority 
                width={80} 
                height={80} 
                className="w-20 h-20 object-contain relative z-10" 
                alt="MPS Phuket" 
              />
           </div>
           <div className="flex items-center flex-1 justify-end">
              <div className="flex gap-2">
                <Link href="https://line.me/R/ti/p/@mpsphuket" target="_blank" className="w-[46px] h-[46px] flex items-center justify-center bg-white/5 rounded-2xl border border-white/10 active:scale-90 transition-all shadow-xl">
                  <MessageCircle size={18} className="opacity-80"/>
                </Link>
                <Link href="https://wa.me/66612345678" target="_blank" className="w-[46px] h-[46px] flex items-center justify-center bg-white/5 rounded-2xl border border-white/10 active:scale-90 transition-all shadow-xl">
                  <Phone size={18} className="opacity-80"/>
                </Link>
                <Link href="https://www.instagram.com/boshkunadoroshku" target="_blank" className="w-[46px] h-[46px] flex items-center justify-center bg-white/5 rounded-2xl border border-white/10 active:scale-90 transition-all shadow-xl">
                  <Instagram size={18} className="opacity-80"/>
                </Link>
              </div>
              <button onClick={() => { triggerHaptic('light'); setLang(lang === 'en' ? 'ru' : 'en'); }} className="ml-2 w-[46px] h-[46px] flex items-center justify-center bg-white/5 rounded-2xl border border-white/10 font-black text-[10px] text-brand-secondary active:scale-90 transition-all shrink-0">{lang === 'en' ? 'RU' : 'EN'}</button>
           </div>
        </div>

        {/* Кнопки инфо */}
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
      </header>

      <div className="max-w-xl mx-auto space-y-0">
        
        {/* === КАРУСЕЛЬ NEW === */}
        {recentUpdates.length > 0 && (
          <section className="mb-4 space-y-3 overflow-hidden">
            <div className="flex items-center gap-2 px-2"><BadgeIcon type="NEW" /><h2 className="text-[12px] font-black uppercase tracking-[0.3em] text-brand-light/80">{t.updates || 'New'}</h2></div>
            <div className="flex gap-4 overflow-x-auto pb-1 no-scrollbar mx-[-1rem] px-4 snap-x">
              {recentUpdates.map((p, idx) => (<div key={p?.id || idx} className="w-[160px] shrink-0 snap-start"><HighlightCard item={p} onClick={() => setSelectedProduct(p)} priority={idx < 4} /></div>))}
            </div>
          </section>
        )}

        {/* === КАРУСЕЛЬ SALE === */}
        {flashSales.length > 0 && (
          <section className="mb-4 space-y-3 overflow-hidden">
            <div className="flex items-center gap-2 px-2"><BadgeIcon type="SALE" /><h2 className="text-[12px] font-black uppercase tracking-[0.3em] text-brand-light/80">{lang === 'ru' ? 'Распродажи' : 'Sales'}</h2></div>
            <div className="flex gap-4 overflow-x-auto pb-1 no-scrollbar mx-[-1rem] px-4 snap-x">
              {flashSales.map((p, idx) => (<div key={p?.id || idx} className="w-[160px] shrink-0 snap-start"><HighlightCard item={p} onClick={() => setSelectedProduct(p)} priority={idx < 4} /></div>))}
            </div>
          </section>
        )}

        {/* === BUDS (всегда раскрыт) === */}
        {buds.length > 0 && (
          <section className="mb-2">
            <div className="flex items-center gap-3 px-2 py-3">
              <Leaf size={22} className="text-brand-secondary" />
              <h2 className="text-[16px] font-black uppercase tracking-tighter text-brand-light">Buds</h2>
            </div>
            <div className="rounded-[2rem] overflow-hidden border border-white/10 bg-brand-primary">
              {buds.map((p: any) => (<ProductRow key={p.id} p={p} onClick={() => setSelectedProduct(p)} />))}
            </div>
          </section>
        )}

        {/* === JOINTS (аккордеон) === */}
        {joints.length > 0 && (
          <section className="mb-2">
            <button 
              onClick={() => toggleSection('joints')} 
              className="w-full flex items-center justify-between px-3 py-3 active:bg-white/5 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Cigarette size={22} className="text-brand-secondary" />
                <h2 className="text-[16px] font-black uppercase tracking-tighter text-brand-light">Joints</h2>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[9px] font-black uppercase tracking-widest opacity-40 text-brand-light">
                  {openSections.includes('joints') ? (lang === 'ru' ? 'Свернуть' : 'Close') : (lang === 'ru' ? 'Развернуть' : 'Open')}
                </span>
                <ChevronDown size={20} className={`opacity-40 transition-transform duration-300 ${openSections.includes('joints') ? 'rotate-180' : ''}`} />
              </div>
            </button>
            <div className={`overflow-hidden transition-all duration-500 ${openSections.includes('joints') ? 'max-h-[3000px]' : 'max-h-0'}`}>
              <div className="rounded-[2rem] overflow-hidden border border-white/10 bg-brand-primary">
                {joints.map((p: any) => (<ProductRow key={p.id} p={p} onClick={() => setSelectedProduct(p)} />))}
              </div>
            </div>
          </section>
        )}

        {/* === ACCESSORIES (аккордеон) === */}
        {accessories.length > 0 && (
          <section className="mb-2">
            <button 
              onClick={() => toggleSection('accessories')} 
              className="w-full flex items-center justify-between px-3 py-3 active:bg-white/5 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Layers size={22} className="text-brand-secondary" />
                <h2 className="text-[16px] font-black uppercase tracking-tighter text-brand-light">{lang === 'ru' ? 'Аксессуары' : 'Accessories'}</h2>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[9px] font-black uppercase tracking-widest opacity-40 text-brand-light">
                  {openSections.includes('accessories') ? (lang === 'ru' ? 'Свернуть' : 'Close') : (lang === 'ru' ? 'Развернуть' : 'Open')}
                </span>
                <ChevronDown size={20} className={`opacity-40 transition-transform duration-300 ${openSections.includes('accessories') ? 'rotate-180' : ''}`} />
              </div>
            </button>
            <div className={`overflow-hidden transition-all duration-500 ${openSections.includes('accessories') ? 'max-h-[3000px]' : 'max-h-0'}`}>
              <div className="rounded-[2rem] overflow-hidden border border-white/10 bg-brand-primary">
                {accessories.map((p: any) => (<ProductRow key={p.id} p={p} onClick={() => setSelectedProduct(p)} />))}
              </div>
            </div>
          </section>
        )}

      </div>

      {/* === КОРЗИНА === */}
      {items.length > 0 && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] w-full max-w-sm px-6">
          <button onClick={() => { triggerHaptic('medium'); setIsCheckoutOpen(true); }} className="w-full bg-white/10 backdrop-blur-2xl text-brand-light py-3 px-7 rounded-[2.5rem] border border-white/20 shadow-2xl flex justify-between items-center active:scale-95 transition-all">
            <div className="flex items-center gap-4 relative z-10">
              <div className="p-2 bg-brand-secondary/20 rounded-xl"><ShoppingBag size={20} className="text-brand-secondary"/></div>
              <div className="text-left">
                <div className="font-black uppercase text-[18px] leading-none mb-0.5">{getTotal()}<BahtSymbol /></div>
                <span className="font-black uppercase text-[9px] text-brand-secondary leading-none">{items.length} {t.items || 'items'}</span>
              </div>
            </div>
            <div className="flex items-center gap-3 text-brand-light opacity-70">
              <span className="text-[12px] font-black uppercase">{t.basket || 'Basket'}</span>
              <span className="p-2 bg-white/10 rounded-full animate-pulse"><Send size={18}/></span>
            </div>
          </button>
        </div>
      )}
      
      {/* === МОДАЛКИ === */}
      <InfoModal isOpen={isDeliveryModalOpen} onClose={() => setIsDeliveryModalOpen(false)} title={lang === 'ru' ? 'Доставка и Оплата' : 'Delivery & Payment'}>
        <div className="flex items-center gap-4">
          <Timer size={18} className="text-brand-secondary shrink-0" />
          <div>
            <p className="text-[8px] font-black uppercase tracking-[0.15em] text-brand-light/40 mb-1">{lang === 'ru' ? 'Часы работы' : 'Working hours'}</p>
            <p className="text-[13px] font-bold text-brand-light tracking-[0.1em]">12:00 — 00:00</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Plus size={18} className="text-brand-secondary shrink-0" />
          <div>
            <p className="text-[8px] font-black uppercase tracking-[0.15em] text-brand-light/40 mb-1">{lang === 'ru' ? 'Минимальный заказ' : 'Minimum order'}</p>
            <p className="text-[13px] font-bold text-brand-light tracking-[0.1em]">
              {lang === 'ru' ? 'От 1000฿, Доставка бесплатная' : 'From 1000฿, Free delivery'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Wallet size={18} className="text-brand-secondary shrink-0" />
          <div>
            <p className="text-[8px] font-black uppercase tracking-[0.15em] text-brand-light/40 mb-1">{lang === 'ru' ? 'Способы оплаты' : 'Payment methods'}</p>
            <p className="text-[13px] font-bold text-brand-light tracking-[0.1em] leading-tight">
              {lang === 'ru' ? 'Наличные, перевод, крипта, рубли' : 'Cash, bank transfer, crypto'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Bike size={18} className="text-brand-secondary shrink-0" />
          <div>
            <p className="text-[8px] font-black uppercase tracking-[0.15em] text-brand-light/40 mb-1">{lang === 'ru' ? 'Сроки доставки' : 'Delivery times'}</p>
            <p className="text-[13px] font-bold text-brand-light tracking-[0.1em]">
              {lang === 'ru' ? 'Пхукет: в течение 60 мин, Таиланд: 2-3 дня' : 'Phuket: within 60 min, Thailand: 2-3 days'}
            </p>
          </div>
        </div>
      </InfoModal>

      <InfoModal isOpen={isGuaranteesModalOpen} onClose={() => setIsGuaranteesModalOpen(false)} title={lang === 'ru' ? 'О нас и Гарантии' : 'Our Guarantees'}>
        <div className="flex items-center gap-4">
          <Trophy size={18} className="text-brand-secondary shrink-0" />
          <div>
            <p className="text-[8px] font-black uppercase tracking-[0.15em] text-brand-light/40 mb-1">{lang === 'ru' ? 'Опыт на рынке' : 'Market Experience'}</p>
            <p className="text-[13px] font-bold text-brand-light tracking-[0.1em]">
              {lang === 'ru' ? '3 года стабильной работы' : '3 years of solid experience'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Users size={18} className="text-brand-secondary shrink-0" />
          <div>
            <p className="text-[8px] font-black uppercase tracking-[0.15em] text-brand-light/40 mb-1">{lang === 'ru' ? 'Репутация' : 'Reputation'}</p>
            <p className="text-[13px] font-bold text-brand-light tracking-[0.1em]">
              {lang === 'ru' ? 'Сотни довольных постоянных клиентов' : 'Hundreds of satisfied regular loyal clients'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <CreditCard size={18} className="text-brand-secondary shrink-0" />
          <div>
            <p className="text-[8px] font-black uppercase tracking-[0.15em] text-brand-light/40 mb-1">{lang === 'ru' ? 'Расчет при получении' : 'Payment on Delivery'}</p>
            <p className="text-[13px] font-bold text-brand-light tracking-[0.1em] leading-tight">
              {lang === 'ru' ? 'Наличные в руки курьеру' : 'Cash on delivery to the courier'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Sparkles size={18} className="text-brand-secondary shrink-0" />
          <div>
            <p className="text-[8px] font-black uppercase tracking-[0.15em] text-brand-light/40 mb-1">{lang === 'ru' ? 'Прямые поставки' : 'Direct Sourcing'}</p>
            <p className="text-[13px] font-bold text-brand-light tracking-[0.1em] leading-tight">
              {lang === 'ru' ? 'Партнерство с лучшими фермерами и поставщиками' : 'Partnership with top-tier growers & suppliers'}
            </p>
          </div>
        </div>
      </InfoModal>

      {selectedProduct && (
        <ProductModal 
          product={{ ...selectedProduct, unitLabel: selectedProduct.category === 'accessories' ? 'pcs' : 'g' }} 
          t={t} 
          style={{ color: selectedProduct.category === 'joints' ? GOLDEN_COLOR : '#10B981' }} 
          onClose={() => setSelectedProduct(null)} 
        />
      )}
      {isCheckoutOpen && (
        <CheckoutModal 
          items={items.map(item => ({ ...item, unitLabel: item.category === 'accessories' ? 'pcs' : 'g' }))} 
          total={getTotal()} 
          t={t} 
          lang={lang} 
          onClose={() => setIsCheckoutOpen(false)} 
          onEditItem={(p) => { setSelectedProduct(p); setIsCheckoutOpen(false); }} 
        />
      )}
    </div>
  );
}
