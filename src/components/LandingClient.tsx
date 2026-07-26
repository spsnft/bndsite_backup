"use client"
import * as React from "react"
import { ShoppingBag, Send, Plus, Timer, Bike, Wallet, Sparkles, Trophy, Users, CreditCard } from "lucide-react"

import { useCart } from "@/lib/cart-store"
import { translations, Language, TranslationDictionary } from "@/lib/translations"
import { Product, Checkout, Info, Medical, AgeGate } from "@/components/modals"
import { Header } from "@/components/layout/Header"
import { ProductCarousel } from "@/components/catalog/ProductCarousel"
import { ProductGrid } from "@/components/catalog/ProductGrid"
import { BahtSymbol } from "@/components/cards/ProductCards"
import { triggerHaptic, GOLDEN_COLOR } from "@/lib/utils"

export default function LandingClient({ 
  initialProducts = [],
  categories = {},
}: { 
  initialProducts: any[],
  initialDescriptions?: any[],
  categories?: Record<string, any[]>,
}) {
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
  const { items, getTotal, lang } = useCart();
  
  const safeLang = (lang || 'en') as Language;
  const t: TranslationDictionary = translations[safeLang] || translations.en;

  const recentUpdates = React.useMemo(() => initialProducts.filter((p: any) => p && p.badge?.toUpperCase() === 'NEW').sort((a: any, b: any) => (Number(b.id) || 0) - (Number(a.id) || 0)), [initialProducts]);
  const flashSales = React.useMemo(() => initialProducts.filter((p: any) => p && p.badge?.toUpperCase() === 'SALE').sort((a: any, b: any) => (Number(b.id) || 0) - (Number(a.id) || 0)), [initialProducts]);

  const toggleSection = (id: string) => {
    triggerHaptic('light');
    setOpenSections(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);
  };

  return (
    <div className="min-h-screen bg-brand-primary text-brand-light p-4 pb-32 selection:bg-brand-secondary/30 font-sans">
      
      <AgeGate />

      <Header
        safeLang={safeLang}
        isLangMenuOpen={isLangMenuOpen}
        setIsLangMenuOpen={setIsLangMenuOpen}
        onOpenMedical={() => setIsMedicalModalOpen(true)}
        onOpenDelivery={() => setIsDeliveryModalOpen(true)}
        onOpenGuarantees={() => setIsGuaranteesModalOpen(true)}
      />

      <ProductCarousel type="NEW" title={t.updates} products={recentUpdates} onSelect={setSelectedProduct} />
      <ProductCarousel type="SALE" title={t.sales} products={flashSales} onSelect={setSelectedProduct} />

      <ProductGrid
        categories={categories}
        openSections={openSections}
        toggleSection={toggleSection}
        t={t}
        onSelect={setSelectedProduct}
      />

      {/* FLOATING CART BUTTON */}
      {items.length > 0 && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[90] w-full max-w-sm px-4">
          <button onClick={() => { triggerHaptic('medium'); setIsCheckoutOpen(true); }} className="w-full bg-white/10 backdrop-blur-2xl text-brand-light py-3.5 px-6 rounded-[2.5rem] border border-white/20 shadow-2xl flex justify-between items-center active:scale-95 transition-all">
            <div className="flex items-center gap-3 relative z-10">
              <div className="p-2 bg-brand-secondary/20 rounded-xl"><ShoppingBag size={18} className="text-brand-secondary"/></div>
              <div className="text-left">
                <div className="font-black uppercase text-[16px] leading-none mb-0.5">{getTotal()}<BahtSymbol /></div>
                <span className="font-black uppercase text-[11px] text-brand-secondary leading-none">{items.length} {t.items}</span>
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
        <div className="flex items-center gap-4"><Timer size={18} className="text-brand-secondary shrink-0" /><div><p className="text-[11px] font-black uppercase tracking-wide text-brand-light/40 mb-1">{t.workingHours}</p><p className="text-[13px] font-bold text-brand-light tracking-[0.1em]">{t.workingHoursVal}</p></div></div>
        <div className="flex items-center gap-4"><Plus size={18} className="text-brand-secondary shrink-0" /><div><p className="text-[11px] font-black uppercase tracking-wide text-brand-light/40 mb-1">{t.minOrder}</p><p className="text-[13px] font-bold text-brand-light tracking-[0.1em]">{t.minOrderVal}</p></div></div>
        <div className="flex items-center gap-4"><Wallet size={18} className="text-brand-secondary shrink-0" /><div><p className="text-[11px] font-black uppercase tracking-wide text-brand-light/40 mb-1">{t.paymentMethods}</p><p className="text-[13px] font-bold text-brand-light tracking-[0.1em] leading-tight">{t.paymentMethodsVal}</p></div></div>
        <div className="flex items-center gap-4"><Bike size={18} className="text-brand-secondary shrink-0" /><div><p className="text-[11px] font-black uppercase tracking-wide text-brand-light/40 mb-1">{t.orderReceiving}</p><p className="text-[13px] font-bold text-brand-light tracking-[0.1em]">{t.orderReceivingVal}</p></div></div>
      </Info>

      <Info isOpen={isGuaranteesModalOpen} onClose={() => setIsGuaranteesModalOpen(false)} title={t.guaranteesTitle}>
        <div className="flex items-center gap-4"><Trophy size={18} className="text-brand-secondary shrink-0" /><div><p className="text-[11px] font-black uppercase tracking-wide text-brand-light/40 mb-1">{t.marketExp}</p><p className="text-[13px] font-bold text-brand-light tracking-[0.1em]">{t.marketExpVal}</p></div></div>
        <div className="flex items-center gap-4"><Users size={18} className="text-brand-secondary shrink-0" /><div><p className="text-[11px] font-black uppercase tracking-wide text-brand-light/40 mb-1">{t.reputation}</p><p className="text-[13px] font-bold text-brand-light tracking-[0.1em]">{t.reputationVal}</p></div></div>
        <div className="flex items-center gap-4"><CreditCard size={18} className="text-brand-secondary shrink-0" /><div><p className="text-[11px] font-black uppercase tracking-wide text-brand-light/40 mb-1">{t.paymentOnDelivery}</p><p className="text-[13px] font-bold text-brand-light tracking-[0.1em] leading-tight">{t.paymentOnDeliveryVal}</p></div></div>
        <div className="flex items-center gap-4"><Sparkles size={18} className="text-brand-secondary shrink-0" /><div><p className="text-[11px] font-black uppercase tracking-wide text-brand-light/40 mb-1">{t.directSourcing}</p><p className="text-[13px] font-bold text-brand-light tracking-[0.1em] leading-tight">{t.directSourcingVal}</p></div></div>
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
          onClose={() => setIsCheckoutOpen(false)} 
          onEditItem={(p) => { setSelectedProduct(p); setIsCheckoutOpen(false); }} 
        />
      )}
    </div>
  );
}
