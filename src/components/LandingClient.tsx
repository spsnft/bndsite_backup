"use client"
import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { 
  Plus, Leaf, ShoppingBag, Send, 
  MessageCircle, Phone, Instagram, ChevronDown, 
  Sparkles, Bike, Wallet, Timer, 
  CreditCard, Trophy, Users, ShieldCheck, Cigarette, Layers, FileText
} from "lucide-react"

import { useCart } from "@/lib/cart-store"
import { translations } from "@/lib/translations"
import { Product, Checkout, Info, Medical } from "@/components/modals"
import { HighlightCard, ProductRow, BadgeIcon, BahtSymbol } from "@/components/cards/ProductCards"
import { triggerHaptic, GOLDEN_COLOR } from "@/lib/utils"

const FALLBACK_IMAGE = "/420/images/logo.svg";

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

    const rawUrl = (typeof p.photo === 'string' && p.photo.trim())
      ? p.photo.trim()
      : (typeof p.image === 'string' && p.image.trim() ? p.image.trim() : '');

    const cleanUrl = rawUrl.replace(/^["']|["']$/g, '');

    return {
      ...p,
      image: cleanUrl.length > 0 ? cleanUrl : FALLBACK_IMAGE,
      prices: Object.keys(prices).length ? prices : p.prices,
      old_prices: Object.keys(oldPrices).length ? oldPrices : p.old_prices
    };
  });
};

export default function LandingClient({ initialProducts = [] }: { initialProducts: any[], initialDescriptions?: any[] }) {
  const [products, setProducts] = React.useState(initialProducts);
  const [isLoading, setIsLoading] = React.useState(initialProducts.length === 0);

  React.useEffect(() => {
    if (initialProducts.length === 0) {
      fetch('/420/api/products')
        .then(res => res.json())
        .then(data => {
          const list = Array.isArray(data) ? data : (data.products || []);
          if (list.length > 0) setProducts(list);
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
  const [isMedicalModalOpen, setIsMedicalModalOpen] = React.useState(false);
  const [openSections, setOpenSections] = React.useState<string[]>([]);
  
  const { items, getTotal, lang, setLang } = useCart();
  const t = translations[lang as keyof typeof translations];

  const recentUpdates = React.useMemo(() => processedProducts.filter(p => p && p.badge?.toUpperCase() === 'NEW').sort((a, b) => (Number(b.id) || 0) - (Number(a.id) || 0)), [processedProducts]);
  const flashSales = React.useMemo(() => processedProducts.filter(p => p && p.badge?.toUpperCase() === 'SALE').sort((a, b) => (Number(b.id) || 0) - (Number(a.id) || 0)), [processedProducts]);

  const buds = React.useMemo(() => processedProducts.filter(p => p && p.category === 'buds'), [processedProducts]);
  const joints = React.useMemo(() => processedProducts.filter(p => p && p.category === 'joints'), [processedProducts]);
  const accessories = React.useMemo(() => processedProducts.filter(p => p && p.category === 'accessories'), [processedProducts]);

  const toggleSection = (id: string) => {
    triggerHaptic('light');
    setOpenSections(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-brand-primary flex items-center justify-center">
        <p className="text-brand-light/60 font-black uppercase tracking-widest text-sm animate-pulse">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-primary text-brand-light p-4 pb-32 selection:bg-brand-secondary/30 font-sans">
      
      {/* HEADER */}
      <header className="max-w-5xl mx-auto pt-0 mb-0">
        <div className="flex items-center justify-between px-2 mb-[4px]"> 
           <Image src="/420/images/logo.svg" priority width={80} height={80} className="w-20 h-20 object-contain relative z-10" alt="MPS Phuket" />
           <div className="flex items-center flex-1 justify-end">
              <div className="flex gap-2">
                <Link href="https://line.me/R/ti/p/@mpsphuket" target="_blank" className="w-[46px] h-[46px] flex items-center justify-center bg-white/5 rounded-2xl border border-white/10 active:scale-90 transition-all shadow-xl"><MessageCircle size={18} className="opacity-80"/></Link>
                <Link href="https://wa.me/66612345678" target="_blank" className="w-[46px] h-[46px] flex items-center justify-center bg-white/5 rounded-2xl border border-white/10 active:scale-90 transition-all shadow-xl"><Phone size={18} className="opacity-80"/></Link>
                <Link href="https://www.instagram.com/mpsphuket" target="_blank" className="w-[46px] h-[46px] flex items-center justify-center bg-white/5 rounded-2xl border border-white/10 active:scale-90 transition-all shadow-xl"><Instagram size={18} className="opacity-80"/></Link>
              </div>
              <button onClick={() => { triggerHaptic('light'); setLang(lang === 'en' ? 'ru' : 'en'); }} className="ml-2 w-[46px] h-[46px] flex items-center justify-center bg-white/5 rounded-2xl border border-white/10 font-black text-[10px] text-brand-secondary active:scale-90 transition-all shrink-0">{lang === 'en' ? 'RU' : 'EN'}</button>
           </div>
        </div>

        <div className="flex flex-wrap sm:flex-nowrap gap-2 px-2 mb-4 mt-2 relative z-20">
          <button onClick={() => { triggerHaptic('light'); setIsDeliveryModalOpen(true); }} className="flex-1 flex items-center justify-center gap-2 h-[44px] px-2.5 bg-white/5 active:bg-white/10 active:scale-[0.98] rounded-[1.5rem] border border-white/15 backdrop-blur-md transition-all whitespace-nowrap overflow-hidden">
            <Bike size={15} className="text-brand-secondary shrink-0" />
            <span className="text-[10px] font-black uppercase tracking-wider text-brand-light/90 truncate">{lang === 'ru' ? 'Доставка' : 'Delivery'}</span>
          </button>
          <button onClick={() => { triggerHaptic('light'); setIsGuaranteesModalOpen(true); }} className="flex-1 flex items-center justify-center gap-2 h-[44px] px-2.5 bg-white/5 active:bg-white/10 active:scale-[0.98] rounded-[1.5rem] border border-white/15 backdrop-blur-md transition-all whitespace-nowrap overflow-hidden">
            <ShieldCheck size={15} className="text-brand-secondary shrink-0" />
            <span className="text-[10px] font-black uppercase tracking-wider text-brand-light/90 truncate">{lang === 'ru' ? 'Гарантии' : 'Guarantees'}</span>
          </button>
          <button onClick={() => { triggerHaptic('light'); setIsMedicalModalOpen(true); }} className="flex-1 flex items-center justify-center gap-2 h-[44px] px-2.5 bg-brand-secondary/20 active:bg-brand-secondary/30 active:scale-[0.98] rounded-[1.5rem] border border-brand-secondary/50 backdrop-blur-md transition-all whitespace-nowrap overflow-hidden">
            <FileText size={15} className="text-brand-secondary shrink-0" />
            <span className="text-[10px] font-black uppercase tracking-wider text-brand-secondary truncate">{lang === 'ru' ? 'Справка' : 'Certificate'}</span>
          </button>
        </div>
      </header>

      {/* CATALOG GRID */}
      <div className="max-w-5xl mx-auto space-y-0">
        {recentUpdates.length > 0 && (
          <section className="mb-6 space-y-3 overflow-hidden">
            <div className="flex items-center gap-2 px-2"><BadgeIcon type="NEW" /><h2 className="text-[12px] font-black uppercase tracking-[0.3em] text-brand-light/80">{t.updates || 'New'}</h2></div>
            <div className="flex gap-4 overflow-x-auto pb-1 no-scrollbar md:mx-0 mx-[-1rem] px-4 md:px-0 snap-x">
              {recentUpdates.map((p, idx) => (<div key={p?.id || idx} className="w-[160px] shrink-0 snap-start"><HighlightCard item={p} onClick={() => setSelectedProduct(p)} priority={idx < 4} /></div>))}
            </div>
          </section>
        )}

        {flashSales.length > 0 && (
          <section className="mb-6 space-y-3 overflow-hidden">
            <div className="flex items-center gap-2 px-2"><BadgeIcon type="SALE" /><h2 className="text-[12px] font-black uppercase tracking-[0.3em] text-brand-light/80">{lang === 'ru' ? 'Рас распродажа' : 'Sales'}</h2></div>
            <div className="flex gap-4 overflow-x-auto pb-1 no-scrollbar md:mx-0 mx-[-1rem] px-4 md:px-0 snap-x">
              {flashSales.map((p, idx) => (<div key={p?.id || idx} className="w-[160px] shrink-0 snap-start"><HighlightCard item={p} onClick={() => setSelectedProduct(p)} priority={idx < 4} /></div>))}
            </div>
          </section>
        )}

        {/* BUDS & JOINTS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 md:mt-8">
          {buds.length > 0 && (
            <section className="flex flex-col h-full">
              <div className="flex items-center gap-3 px-2 mb-4">
                <Leaf size={22} className="text-brand-secondary" />
                <h2 className="text-[16px] font-black uppercase tracking-tighter text-brand-light">Buds</h2>
              </div>
              <div className="rounded-[2rem] overflow-hidden border border-white/10 bg-brand-primary h-full">
                {buds.map((p: any) => (<ProductRow key={p.id} p={p} onClick={() => setSelectedProduct(p)} />))}
              </div>
            </section>
          )}

          {joints.length > 0 && (
            <section className="flex flex-col h-full mt-6 md:mt-0">
              <button onClick={() => toggleSection('joints')} className="w-full flex items-center justify-between px-2 mb-4 active:bg-white/5 transition-colors md:cursor-default rounded-xl">
                <div className="flex items-center gap-3">
                  <Cigarette size={22} className="text-brand-secondary" />
                  <h2 className="text-[16px] font-black uppercase tracking-tighter text-brand-light">Joints</h2>
                </div>
                <div className="flex items-center gap-2 md:hidden">
                  <span className="text-[9px] font-black uppercase tracking-widest opacity-40 text-brand-light">{openSections.includes('joints') ? (lang === 'ru' ? 'Свернуть' : 'Close') : (lang === 'ru' ? 'Развернуть' : 'Open')}</span>
                  <ChevronDown size={20} className={`opacity-40 transition-transform duration-300 ${openSections.includes('joints') ? 'rotate-180' : ''}`} />
                </div>
              </button>
              <div className={`overflow-hidden transition-all duration-500 md:max-h-none ${openSections.includes('joints') ? 'max-h-[3000px]' : 'max-h-0 md:max-h-[3000px]'}`}>
                <div className="rounded-[2rem] overflow-hidden border border-white/10 bg-brand-primary h-full">
                  {joints.map((p: any) => (<ProductRow key={p.id} p={p} onClick={() => setSelectedProduct(p)} />))}
                </div>
              </div>
            </section>
          )}
        </div>

        {/* ACCESSORIES (HIGHLIGHT CARDS) */}
        {accessories.length > 0 && (
          <section className="mt-8 md:mt-10 mb-6 w-full">
            <button onClick={() => toggleSection('accessories')} className="w-full flex items-center justify-between px-2 mb-4 active:bg-white/5 transition-colors rounded-xl">
              <div className="flex items-center gap-3">
                <Layers size={22} className="text-brand-secondary" />
                <h2 className="text-[16px] font-black uppercase tracking-tighter text-brand-light">{lang === 'ru' ? 'Аксессуары' : 'Accessories'}</h2>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[9px] font-black uppercase tracking-widest opacity-40 text-brand-light">{openSections.includes('accessories') ? (lang === 'ru' ? 'Свернуть' : 'Close') : (lang === 'ru' ? 'Развернуть' : 'Open')}</span>
                <ChevronDown size={20} className={`opacity-40 transition-transform duration-300 ${openSections.includes('accessories') ? 'rotate-180' : ''}`} />
              </div>
            </button>
            <div className={`overflow-hidden transition-all duration-500 ${openSections.includes('accessories') ? 'max-h-[3000px] opacity-100' : 'max-h-0 opacity-0'}`}>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 px-1 md:px-0">
                {accessories.map((p: any) => (
                  <HighlightCard key={p.id} item={p} onClick={() => setSelectedProduct(p)} />
                ))}
              </div>
            </div>
          </section>
        )}
      </div>

      {/* FLOATING CART BUTTON */}
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
      
      {/* MODALS */}
      <Info isOpen={isDeliveryModalOpen} onClose={() => setIsDeliveryModalOpen(false)} title={lang === 'ru' ? 'Доставка и Оплата' : 'Delivery & Payment'}>
        <div className="flex items-center gap-4"><Timer size={18} className="text-brand-secondary shrink-0" /><div><p className="text-[8px] font-black uppercase tracking-[0.15em] text-brand-light/40 mb-1">{lang === 'ru' ? 'Часы работы' : 'Working hours'}</p><p className="text-[13px] font-bold text-brand-light tracking-[0.1em]">12:00 — 00:00</p></div></div>
        <div className="flex items-center gap-4"><Plus size={18} className="text-brand-secondary shrink-0" /><div><p className="text-[8px] font-black uppercase tracking-[0.15em] text-brand-light/40 mb-1">{lang === 'ru' ? 'Минимальный заказ' : 'Minimum order'}</p><p className="text-[13px] font-bold text-brand-light tracking-[0.1em]">{lang === 'ru' ? 'От 1000฿, Доставка бесплатная' : 'From 1000฿, Free delivery'}</p></div></div>
        <div className="flex items-center gap-4"><Wallet size={18} className="text-brand-secondary shrink-0" /><div><p className="text-[8px] font-black uppercase tracking-[0.15em] text-brand-light/40 mb-1">{lang === 'ru' ? 'Способы оплаты' : 'Payment methods'}</p><p className="text-[13px] font-bold text-brand-light tracking-[0.1em] leading-tight">{lang === 'ru' ? 'Наличные, перевод (QR), рубли' : 'Cash, bank transfer, ruble transfer'}</p></div></div>
        <div className="flex items-center gap-4"><Bike size={18} className="text-brand-secondary shrink-0" /><div><p className="text-[8px] font-black uppercase tracking-[0.15em] text-brand-light/40 mb-1">{lang === 'ru' ? 'Получение заказа' : 'Order receiving'}</p><p className="text-[13px] font-bold text-brand-light tracking-[0.1em]">{lang === 'ru' ? 'Доставка от 60 мин. Есть удобный самовывоз.' : 'Delivery from 60 min. Easy pickup available.'}</p></div></div>
      </Info>

      <Info isOpen={isGuaranteesModalOpen} onClose={() => setIsGuaranteesModalOpen(false)} title={lang === 'ru' ? 'О нас и Гарантии' : 'Our Guarantees'}>
        <div className="flex items-center gap-4"><Trophy size={18} className="text-brand-secondary shrink-0" /><div><p className="text-[8px] font-black uppercase tracking-[0.15em] text-brand-light/40 mb-1">{lang === 'ru' ? 'Опыт на рынке' : 'Market Experience'}</p><p className="text-[13px] font-bold text-brand-light tracking-[0.1em]">{lang === 'ru' ? '3 года стабильной работы' : '3 years of solid experience'}</p></div></div>
        <div className="flex items-center gap-4"><Users size={18} className="text-brand-secondary shrink-0" /><div><p className="text-[8px] font-black uppercase tracking-[0.15em] text-brand-light/40 mb-1">{lang === 'ru' ? 'Репутация' : 'Reputation'}</p><p className="text-[13px] font-bold text-brand-light tracking-[0.1em]">{lang === 'ru' ? 'Сотни довольных постоянных клиентов' : 'Hundreds of satisfied regular loyal clients'}</p></div></div>
        <div className="flex items-center gap-4"><CreditCard size={18} className="text-brand-secondary shrink-0" /><div><p className="text-[8px] font-black uppercase tracking-[0.15em] text-brand-light/40 mb-1">{lang === 'ru' ? 'Расчет при получении' : 'Payment on Delivery'}</p><p className="text-[13px] font-bold text-brand-light tracking-[0.1em] leading-tight">{lang === 'ru' ? 'Наличные в руки курьеру' : 'Cash on delivery to the courier'}</p></div></div>
        <div className="flex items-center gap-4"><Sparkles size={18} className="text-brand-secondary shrink-0" /><div><p className="text-[8px] font-black uppercase tracking-[0.15em] text-brand-light/40 mb-1">{lang === 'ru' ? 'Прямые поставки' : 'Direct Sourcing'}</p><p className="text-[13px] font-bold text-brand-light tracking-[0.1em] leading-tight">{lang === 'ru' ? 'Партнерство с лучшими фермерами и поставщиками' : 'Partnership with top-tier growers & suppliers'}</p></div></div>
      </Info>

      {isMedicalModalOpen && (
        <Medical onClose={() => setIsMedicalModalOpen(false)} />
      )}

      {selectedProduct && (
        <Product 
          product={{ ...selectedProduct, unitLabel: selectedProduct.category === 'accessories' ? 'pcs' : 'g' }} 
          t={t} 
          style={{ color: selectedProduct.category === 'joints' ? GOLDEN_COLOR : '#10B981' }} 
          onClose={() => setSelectedProduct(null)} 
        />
      )}

      {isCheckoutOpen && (
        <Checkout 
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
