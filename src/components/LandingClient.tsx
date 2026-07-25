"use client"
import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { 
  Plus, Leaf, ShoppingBag, Send, 
  MessageCircle, Phone, Instagram, ChevronDown, 
  Sparkles, Bike, Wallet, Timer, 
  CreditCard, Trophy, Users, ShieldCheck, Cigarette, Layers
} from "lucide-react"

import { useCart } from "@/lib/cart-store"
import { translations, Language } from "@/lib/translations"
import { Product, Checkout, Info, Medical, AgeGate } from "@/components/modals"
import { BentoBanner } from "@/components/BentoBanner"
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
      if (key.startsWith('price_')) prices[key.replace('price_', '').replace('g', '')] = p[key];
      if (key.startsWith('oldprice_')) oldPrices[key.replace('oldprice_', '').replace('g', '')] = p[key];
    });
    const rawUrl = (typeof p.photo === 'string' && p.photo.trim()) ? p.photo.trim() : (typeof p.image === 'string' && p.image.trim() ? p.image.trim() : '');
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
  
  // Modals state
  const [isCheckoutOpen, setIsCheckoutOpen] = React.useState(false);
  const [isDeliveryModalOpen, setIsDeliveryModalOpen] = React.useState(false);
  const [isGuaranteesModalOpen, setIsGuaranteesModalOpen] = React.useState(false);
  const [isMedicalModalOpen, setIsMedicalModalOpen] = React.useState(false);
  
  // UI state
  const [openSections, setOpenSections] = React.useState<string[]>([]);
  const [isLangMenuOpen, setIsLangMenuOpen] = React.useState(false);
  
  // Global Store
  const { items, getTotal, lang, setLang } = useCart();
  
  const safeLang = (lang || 'en') as Language;
  const t = translations[safeLang] || translations.en;

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
      
      {/* 20+ AGE GATE MODAL */}
      <AgeGate />

      {/* HEADER */}
      <header className="max-w-5xl mx-auto relative z-[100] mb-6">
        <div className="flex items-center justify-between px-1 mb-4"> 
           {/* LOGO & STORE TITLE */}
           <div className="flex items-center gap-3">
             <Image src="/420/images/logo.svg" priority width={72} height={72} className="w-14 h-14 sm:w-16 sm:h-16 object-contain relative z-10 shrink-0" alt="MPG StorePhuket" />
             <div className="flex flex-col">
               <span className="text-[12px] sm:text-[14px] font-black uppercase tracking-tight text-brand-light leading-tight">
                 Marijuana Premium Grade
               </span>
               <span className="text-[10px] sm:text-[11px] font-extrabold uppercase tracking-widest text-brand-secondary">
                 MPG StorePhuket
               </span>
             </div>
           </div>
           
           <div className="flex items-center gap-2">
              <Link href="https://line.me/R/ti/p/@mpsphuket" target="_blank" className="w-[42px] h-[42px] flex items-center justify-center bg-white/5 rounded-2xl border border-white/10 active:scale-90 transition-all shadow-lg"><MessageCircle size={18} className="opacity-80"/></Link>
              <Link href="https://wa.me/66612345678" target="_blank" className="w-[42px] h-[42px] flex items-center justify-center bg-white/5 rounded-2xl border border-white/10 active:scale-90 transition-all shadow-lg"><Phone size={18} className="opacity-80"/></Link>
              <Link href="https://www.instagram.com/mpsphuket" target="_blank" className="w-[42px] h-[42px] flex items-center justify-center bg-white/5 rounded-2xl border border-white/10 active:scale-90 transition-all shadow-lg"><Instagram size={18} className="opacity-80"/></Link>

              {/* LANGUAGE DROPDOWN */}
              <div className="relative">
                <button 
                  onClick={() => { triggerHaptic('light'); setIsLangMenuOpen(!isLangMenuOpen); }} 
                  className="h-[42px] px-3 flex items-center justify-center bg-white/5 rounded-2xl border border-white/10 font-black text-[11px] text-brand-secondary active:scale-90 transition-all gap-1 shadow-lg"
                >
                  {safeLang.toUpperCase()} 
                  <ChevronDown size={14} className={`transition-transform duration-300 ${isLangMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {isLangMenuOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsLangMenuOpen(false)} />
                    <div className="absolute top-[calc(100%+8px)] right-0 w-36 bg-brand-primary border border-white/10 rounded-2xl shadow-2xl z-50 flex flex-col p-1.5 animate-in fade-in zoom-in-95 duration-200 origin-top-right">
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
                           className={`flex items-center gap-3 px-3 py-2.5 text-[11px] font-black uppercase rounded-xl transition-all ${safeLang === l.id ? 'bg-brand-secondary/20 text-brand-secondary' : 'text-brand-light/70 hover:bg-white/5 hover:text-brand-light'}`}
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

        {/* BENTO BANNER COMPONENT */}
        <BentoBanner 
          onOpenMedical={() => setIsMedicalModalOpen(true)}
          onOpenDelivery={() => setIsDeliveryModalOpen(true)}
          onOpenGuarantees={() => setIsGuaranteesModalOpen(true)}
          safeLang={safeLang}
        />
      </header>

      {/* CATALOG GRID */}
      <main className="max-w-5xl mx-auto space-y-8 relative z-10">
        
        {/* CAROUSELS */}
        {recentUpdates.length > 0 && (
          <section className="space-y-3 overflow-hidden">
            <div className="flex items-center gap-2 px-1"><BadgeIcon type="NEW" /><h2 className="text-[12px] font-black uppercase tracking-[0.2em] text-brand-light/80">{t.updates}</h2></div>
            <div className="flex gap-3 overflow-x-auto pb-1 no-scrollbar md:mx-0 mx-[-1rem] px-4 md:px-0 snap-x">
              {recentUpdates.map((p, idx) => (<div key={p?.id || idx} className="w-[160px] shrink-0 snap-start"><HighlightCard item={p} onClick={() => setSelectedProduct(p)} priority={idx < 4} /></div>))}
            </div>
          </section>
        )}

        {flashSales.length > 0 && (
          <section className="space-y-3 overflow-hidden">
            <div className="flex items-center gap-2 px-1"><BadgeIcon type="SALE" /><h2 className="text-[12px] font-black uppercase tracking-[0.2em] text-brand-light/80">{t.sales}</h2></div>
            <div className="flex gap-3 overflow-x-auto pb-1 no-scrollbar md:mx-0 mx-[-1rem] px-4 md:px-0 snap-x">
              {flashSales.map((p, idx) => (<div key={p?.id || idx} className="w-[160px] shrink-0 snap-start"><HighlightCard item={p} onClick={() => setSelectedProduct(p)} priority={idx < 4} /></div>))}
            </div>
          </section>
        )}

        {/* BUDS & JOINTS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {buds.length > 0 && (
            <section className="flex flex-col h-full space-y-3">
              <div className="flex items-center gap-2 px-1">
                <Leaf size={20} className="text-brand-secondary" />
                <h2 className="text-[16px] font-black uppercase tracking-tight text-brand-light">Buds</h2>
              </div>
              <div className="rounded-[2rem] overflow-hidden border border-white/10 bg-brand-primary h-full">
                {buds.map((p: any) => (<ProductRow key={p.id} p={p} onClick={() => setSelectedProduct(p)} />))}
              </div>
            </section>
          )}

          {joints.length > 0 && (
            <section className="flex flex-col h-full space-y-3">
              <button onClick={() => toggleSection('joints')} className="w-full flex items-center justify-between px-1 active:bg-white/5 transition-colors md:cursor-default rounded-xl">
                <div className="flex items-center gap-2">
                  <Cigarette size={20} className="text-brand-secondary" />
                  <h2 className="text-[16px] font-black uppercase tracking-tight text-brand-light">Joints</h2>
                </div>
                <div className="flex items-center gap-2 md:hidden">
                  <span className="text-[9px] font-black uppercase tracking-widest opacity-40 text-brand-light">{openSections.includes('joints') ? t.close : t.open}</span>
                  <ChevronDown size={18} className={`opacity-40 transition-transform duration-300 ${openSections.includes('joints') ? 'rotate-180' : ''}`} />
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

        {/* ACCESSORIES GRID */}
        {accessories.length > 0 && (
          <section className="w-full space-y-3">
            <button onClick={() => toggleSection('accessories')} className="w-full flex items-center justify-between px-1 active:bg-white/5 transition-colors rounded-xl">
              <div className="flex items-center gap-2">
                <Layers size={20} className="text-brand-secondary" />
                <h2 className="text-[16px] font-black uppercase tracking-tight text-brand-light">{t.accessories}</h2>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[9px] font-black uppercase tracking-widest opacity-40 text-brand-light">{openSections.includes('accessories') ? t.close : t.open}</span>
                <ChevronDown size={18} className={`opacity-40 transition-transform duration-300 ${openSections.includes('accessories') ? 'rotate-180' : ''}`} />
              </div>
            </button>
            <div className={`overflow-hidden transition-all duration-500 ${openSections.includes('accessories') ? 'max-h-[3000px] opacity-100' : 'max-h-0 opacity-0'}`}>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {accessories.map((p: any) => (
                  <HighlightCard key={p.id} item={p} onClick={() => setSelectedProduct(p)} />
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      {/* FLOATING CART BUTTON */}
      {items.length > 0 && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[90] w-full max-w-sm px-4">
          <button onClick={() => { triggerHaptic('medium'); setIsCheckoutOpen(true); }} className="w-full bg-white/10 backdrop-blur-2xl text-brand-light py-3.5 px-6 rounded-[2.5rem] border border-white/20 shadow-2xl flex justify-between items-center active:scale-95 transition-all">
            <div className="flex items-center gap-3 relative z-10">
              <div className="p-2 bg-brand-secondary/20 rounded-xl"><ShoppingBag size={18} className="text-brand-secondary"/></div>
              <div className="text-left">
                <div className="font-black uppercase text-[16px] leading-none mb-0.5">{getTotal()}<BahtSymbol /></div>
                <span className="font-black uppercase text-[9px] text-brand-secondary leading-none">{items.length} {t.items}</span>
              </div>
            </div>
            <div className="flex items-center gap-2 text-brand-light opacity-80">
              <span className="text-[11px] font-black uppercase tracking-wider">{t.basket}</span>
              <span className="p-1.5 bg-white/10 rounded-full animate-pulse"><Send size={16}/></span>
            </div>
          </button>
        </div>
      )}
      
      {/* MODALS */}
      <Info isOpen={isDeliveryModalOpen} onClose={() => setIsDeliveryModalOpen(false)} title={t.deliveryPaymentTitle}>
        <div className="flex items-center gap-4"><Timer size={18} className="text-brand-secondary shrink-0" /><div><p className="text-[8px] font-black uppercase tracking-[0.15em] text-brand-light/40 mb-1">{t.workingHours}</p><p className="text-[13px] font-bold text-brand-light tracking-[0.1em]">{t.workingHoursVal}</p></div></div>
        <div className="flex items-center gap-4"><Plus size={18} className="text-brand-secondary shrink-0" /><div><p className="text-[8px] font-black uppercase tracking-[0.15em] text-brand-light/40 mb-1">{t.minOrder}</p><p className="text-[13px] font-bold text-brand-light tracking-[0.1em]">{t.minOrderVal}</p></div></div>
        <div className="flex items-center gap-4"><Wallet size={18} className="text-brand-secondary shrink-0" /><div><p className="text-[8px] font-black uppercase tracking-[0.15em] text-brand-light/40 mb-1">{t.paymentMethods}</p><p className="text-[13px] font-bold text-brand-light tracking-[0.1em] leading-tight">{t.paymentMethodsVal}</p></div></div>
        <div className="flex items-center gap-4"><Bike size={18} className="text-brand-secondary shrink-0" /><div><p className="text-[8px] font-black uppercase tracking-[0.15em] text-brand-light/40 mb-1">{t.orderReceiving}</p><p className="text-[13px] font-bold text-brand-light tracking-[0.1em]">{t.orderReceivingVal}</p></div></div>
      </Info>

      <Info isOpen={isGuaranteesModalOpen} onClose={() => setIsGuaranteesModalOpen(false)} title={t.guaranteesTitle}>
        <div className="flex items-center gap-4"><Trophy size={18} className="text-brand-secondary shrink-0" /><div><p className="text-[8px] font-black uppercase tracking-[0.15em] text-brand-light/40 mb-1">{t.marketExp}</p><p className="text-[13px] font-bold text-brand-light tracking-[0.1em]">{t.marketExpVal}</p></div></div>
        <div className="flex items-center gap-4"><Users size={18} className="text-brand-secondary shrink-0" /><div><p className="text-[8px] font-black uppercase tracking-[0.15em] text-brand-light/40 mb-1">{t.reputation}</p><p className="text-[13px] font-bold text-brand-light tracking-[0.1em]">{t.reputationVal}</p></div></div>
        <div className="flex items-center gap-4"><CreditCard size={18} className="text-brand-secondary shrink-0" /><div><p className="text-[8px] font-black uppercase tracking-[0.15em] text-brand-light/40 mb-1">{t.paymentOnDelivery}</p><p className="text-[13px] font-bold text-brand-light tracking-[0.1em] leading-tight">{t.paymentOnDeliveryVal}</p></div></div>
        <div className="flex items-center gap-4"><Sparkles size={18} className="text-brand-secondary shrink-0" /><div><p className="text-[8px] font-black uppercase tracking-[0.15em] text-brand-light/40 mb-1">{t.directSourcing}</p><p className="text-[13px] font-bold text-brand-light tracking-[0.1em] leading-tight">{t.directSourcingVal}</p></div></div>
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
