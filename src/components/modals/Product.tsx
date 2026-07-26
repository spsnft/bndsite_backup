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
        className={`relative w-full max-w-md bg-brand-primary border border-white/10 sm:rounded-modal rounded-t-modal p-6 pt-8 shadow-2xl flex flex-col`}
      >
        <div className="absolute top-3 left-1/2 -translate-x-1/2 w-12 h-1.5 bg-white/20 rounded-full sm:hidden" />

        <div 
          className="absolute inset-0 opacity-20 pointer-events-none rounded-t-modal sm:rounded-modal" 
          style={{ background: `radial-gradient(circle at 50% 0%, ${accentColor}, transparent 60%)` }} 
        />
        
        <button 
          type="button"
          onClick={handleClose} 
          className="absolute top-6 right-6 p-2 bg-white/5 hover:bg-white/10 active:scale-90 rounded-full border border-white/10 transition-all text-brand-light z-20"
        >
          <X size={18} />
        </button>

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
            className="text-[11px] font-black uppercase tracking-wide px-
