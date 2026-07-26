"use client"
import * as React from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { X, Plus, Minus, ShoppingBag, Sparkles } from "lucide-react"
import { useCart } from "@/lib/cart-store"
import { Language, TranslationDictionary } from "@/lib/translations"
import { triggerHaptic, Baht } from "@/lib/utils"

const FALLBACK_IMAGE = "/420/images/logo.svg";

interface ProductModalProps {
  isOpen?: boolean;
  product: any;
  t: TranslationDictionary;
  onClose: () => void;
  style?: { color?: string };
}

export const Product = ({ 
  isOpen = true,
  product,
  t,
  onClose, 
  style 
}: ProductModalProps) => {
  const [quantity, setQuantity] = React.useState(1);
  const [isClosing, setIsClosing] = React.useState(false);
  const [imgSrc, setImgSrc] = React.useState(
    product?.image || FALLBACK_IMAGE
  );
  
  const { addItem, items, lang } = useCart();
  
  const safeLang = (lang || 'en') as Language;
  const accentColor = style?.color || '#10B981';

  const handleClose = React.useCallback(() => {
    triggerHaptic('light');
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, 300);
  }, [onClose]);

  if (!product || (!isOpen && !isClosing)) return null;

  const defaultPrice = product.prices?.['1'] || product.price || 0;
  const currentPrice = defaultPrice;

  const cartItem = items.find(i => i.id === product.id);
  const cartQty = cartItem ? cartItem.quantity : 0;
  const totalQty = cartQty + quantity;

  const getNextDiscountTier = (category: string, qty: number) => {
    const tiers = category === 'joints' 
      ? [{ q: 3, p: 420 }, { q: 5, p: 650 }, { q: 10, p: 1200 }]
      : [{ q: 5, p: 900 }, { q: 10, p: 1700 }, { q: 20, p: 3000 }];
    
    return tiers.find(tier => tier.q > qty);
  };

  const nextTier = getNextDiscountTier(product.category, totalQty);

  const getUnitLabel = () => {
    const isPiece = product.category === 'accessories' || product.category === 'joints';
    if (safeLang === 'ru') return isPiece ? 'шт' : 'г';
    if (safeLang === 'th') return isPiece ? 'ชิ้น' : 'กรัม';
    return isPiece ? 'pcs' : 'g';
  };

  const unitLabel = getUnitLabel();

  const handleAdd = () => {
    triggerHaptic('success');
    addItem({ ...product, price: currentPrice, weight: String(quantity) });
    handleClose();
  };

  return (
    <div className={`fixed inset-0 z-[120] flex items-end sm:items-center justify-center p-0 sm:p-4 transition-all duration-300 ${isClosing ? 'opacity-0' : 'opacity-100'}`}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={handleClose} />
      
      <motion.div
        drag="y"
        dragConstraints={{ top: 0 }}
        dragElastic={0.2}
        onDragEnd={(_: any, info: any) => {
          if (info.offset.y > 100) handleClose();
        }}
        initial={{ y: "100%" }}
        animate={{ y: isClosing ? "100%" : 0 }}
        transition={{ type: "spring", damping: 30, stiffness: 300 }}
        className={`relative w-full max-w-md bg-brand-primary border border-white/10 sm:rounded-[2.5rem] rounded-t-[2.5rem] p-6 pt-8 shadow-2xl flex flex-col`}
      >
        {/* Мобильная плашка свайпа */}
        <div className="absolute top-3 left-1/2 -translate-x-1/2 w-12 h-1.5 bg-white/20 rounded-full sm:hidden" />

        {/* Фоновое динамическое свечение сорта */}
        <div 
          className="absolute inset-0 opacity-20 pointer-events-none rounded-t-[2.5rem] sm:rounded-[2.5rem]" 
          style={{ background: `radial-gradient(circle at 50% 0%, ${accentColor}, transparent 60%)` }} 
        />
        
        {/* Кнопка закрытия */}
        <button 
          type="button"
          onClick={handleClose} 
          className="absolute top-6 right-6 p-2 bg-white/5 hover:bg-white/10 active:scale-90 rounded-full border border-white/10 transition-all text-brand-light z-20"
        >
          <X size={18} />
        </button>

        {/* Заголовок и фото товара */}
        <div className="relative z-10 flex flex-col items-center mb-6">
          <div className="w-32 h-32 mb-4 relative flex items-center justify-center">
            <Image
              src={imgSrc}
              alt={product.name || "Product"}
              fill
              className="object-contain filter drop-shadow-2xl"
              sizes="128px"
              onError={() => setImgSrc(FALLBACK_IMAGE)}
            />
          </div>
          
          <span 
            className="text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border mb-3" 
            style={{ borderColor: `${accentColor}50`, color: accentColor, backgroundColor: `${accentColor}10` }}
          >
            {product.type || product.category}
          </span>
          
          <h2 className="text-2xl font-black uppercase tracking-tighter text-brand-light text-center leading-none mb-1">
            {product.name}
          </h2>

          {product.farm && product.farm !== "-" && (
            <p className="text-[10px] font-bold uppercase tracking-widest text-brand-light/40 mt-2">
              {product.farm}
            </p>
          )}
        </div>

        {/* БАННЕР ВЫГОДЫ / АПСЕЛЛ */}
        {nextTier && (
          <div 
            className="mb-6 p-4 rounded-2xl border bg-brand-secondary/10 flex items-center justify-between relative z-10" 
            style={{ borderColor: `${accentColor}30` }}
          >
            <div className="flex flex-col">
              <span className="text-[11px] font-black uppercase text-brand-light/70 tracking-wider flex items-center gap-1.5">
                <Sparkles size={13} className="text-brand-secondary" />
                {safeLang === 'ru' && `Добавь еще ${nextTier.q - totalQty} ${unitLabel}`}
                {safeLang === 'th' && `เพิ่มอีก ${nextTier.q - totalQty} ${unitLabel}`}
                {safeLang === 'en' && `Add ${nextTier.q - totalQty} ${unitLabel} more`}
              </span>
              <span className="text-[14px] font-black text-brand-secondary mt-0.5 tracking-tight">
                {safeLang === 'ru' && `чтобы цена стала ${nextTier.p}฿`}
                {safeLang === 'th' && `เพื่อรับราคา ${nextTier.p}฿`}
                {safeLang === 'en' && `to unlock ${nextTier.p}฿ price`}
              </span>
            </div>

            <button 
              type="button"
              onClick={() => {
                triggerHaptic('light');
                setQuantity(q => q + (nextTier.q - totalQty));
              }}
              className="w-10 h-10 rounded-full flex items-center justify-center active:scale-90 transition-transform shadow-md"
              style={{ backgroundColor: `${accentColor}20`, color: accentColor }}
            >
              <Plus size={18} strokeWidth={3} />
            </button>
          </div>
        )}

        {/* НИЖНЯЯ ПАНЕЛЬ С СЧЕТЧИКОМ И КНОПКОЙ */}
        <div className="flex items-center justify-between gap-4 relative z-10">
          <div className="flex items-center gap-4 bg-black/40 border border-white/10 rounded-2xl p-2 h-14">
            <button 
              type="button"
              onClick={() => { triggerHaptic('light'); setQuantity(Math.max(1, quantity - 1)); }} 
              className="w-10 h-10 flex items-center justify-center bg-white/5 rounded-xl active:bg-white/10 transition-colors text-brand-light/70"
            >
              <Minus size={16} />
            </button>

            <span className="text-[16px] font-black w-4 text-center text-brand-light">
              {quantity}
            </span>

            <button 
              type="button"
              onClick={() => { triggerHaptic('light'); setQuantity(quantity + 1); }} 
              className="w-10 h-10 flex items-center justify-center bg-white/5 rounded-xl active:bg-white/10 transition-colors text-brand-light"
            >
              <Plus size={16} />
            </button>
          </div>

          <button 
            type="button"
            onClick={handleAdd} 
            className="flex-1 h-14 bg-brand-secondary text-brand-primary font-black uppercase tracking-widest text-[13px] rounded-2xl active:scale-95 transition-all flex items-center justify-center gap-3 hover:bg-brand-secondary/90 shadow-xl"
          >
            <ShoppingBag size={18} />
            <span>{currentPrice * quantity}</span>
            <Baht />
          </button>
        </div>

      </motion.div>
    </div>
  );
};
