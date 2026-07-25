"use client"
import * as React from "react"
import { X, Plus, Minus, ShoppingBag, Sparkles } from "lucide-react"
import { useCart } from "@/lib/cart-store"
import { translations, Language } from "@/lib/translations"
import { triggerHaptic, Baht } from "@/lib/utils"

interface ProductModalProps {
  isOpen?: boolean;
  product: any;
  onClose: () => void;
  style?: { color?: string };
}

// Определение цвета свечения по типу сорта
const getStrainColor = (type?: string, fallbackColor?: string) => {
  if (fallbackColor) return fallbackColor;
  const lower = (type || '').toLowerCase();
  if (lower.includes('indica')) return '#A855F7'; // Фиолетовый
  if (lower.includes('sativa')) return '#F59E0B'; // Янтарный
  if (lower.includes('hybrid')) return '#10B981'; // Изумрудный
  return '#10B981';
};

export const Product = ({ 
  isOpen = true, 
  product, 
  onClose, 
  style 
}: ProductModalProps) => {
  const [isClosing, setIsClosing] = React.useState(false);
  const [quantity, setQuantity] = React.useState(1);
  
  const { addItem, items, lang } = useCart();
  const safeLang = (lang || 'en') as Language;
  const t = translations[safeLang] || translations.en;

  // Безопасное получение списка цен / весов
  const priceMap: Record<string, number> = product?.prices || (product?.price ? { '1g': product.price } : { '1g': 0 });
  const weightKeys = Object.keys(priceMap);

  // Выбранный вес (по умолчанию первый доступный)
  const [selectedWeight, setSelectedWeight] = React.useState<string>(weightKeys[0] || '1g');

  // Сброс выбранного веса при смене товара
  React.useEffect(() => {
    if (weightKeys.length > 0) {
      setSelectedWeight(weightKeys[0]);
    }
    setQuantity(1);
  }, [product?.id]);

  const handleClose = React.useCallback(() => {
    triggerHaptic('light');
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, 300);
  }, [onClose]);

  if (!product || (!isOpen && !isClosing)) return null;

  const accentColor = getStrainColor(product.type || product.category, style?.color);
  const currentUnitPrice = priceMap[selectedWeight] || product.price || 0;
  const totalPrice = currentUnitPrice * quantity;

  const handleAddToCart = () => {
    triggerHaptic('success');
    addItem({
      ...product,
      price: currentUnitPrice,
      weight: selectedWeight
    }, quantity);
    handleClose();
  };

  // Поиск выгоды/следующего тира скидки для апселла
  const currentWeightIdx = weightKeys.indexOf(selectedWeight);
  const nextWeightKey = currentWeightIdx !== -1 && currentWeightIdx < weightKeys.length - 1 
    ? weightKeys[currentWeightIdx + 1] 
    : null;
  const nextWeightPrice = nextWeightKey ? priceMap[nextWeightKey] : null;

  return (
    <div className={`fixed inset-0 z-[120] flex items-end sm:items-center justify-center p-0 sm:p-4 transition-all duration-300 ${isClosing ? 'opacity-0' : 'opacity-100'}`}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={handleClose} />

      <div className={`relative w-full max-w-md bg-brand-primary border border-white/10 sm:rounded-[2.5rem] rounded-t-[2.5rem] p-6 pt-8 shadow-2xl flex flex-col transition-transform duration-300 ${isClosing ? 'translate-y-full sm:translate-y-12' : 'translate-y-0'}`}>
        
        {/* Мобильный индикатор свайпа */}
        <div className="absolute top-3 left-1/2 -translate-x-1/2 w-12 h-1.5 bg-white/20 rounded-full sm:hidden" />

        {/* ДИНАМИЧЕСКОЕ СВЕЧЕНИЕ СОГЛАСНО ТИПУ СОРТА */}
        <div 
          className="absolute inset-0 opacity-25 pointer-events-none rounded-t-[2.5rem] sm:rounded-[2.5rem] transition-all duration-500" 
          style={{ background: `radial-gradient(circle at 50% 0%, ${accentColor}, transparent 65%)` }} 
        />

        {/* Кнопка закрытия */}
        <button 
          type="button"
          onClick={handleClose} 
          className="absolute top-6 right-6 p-2 bg-white/5 hover:bg-white/10 active:scale-90 rounded-full border border-white/10 transition-all text-brand-light z-20"
        >
          <X size={18} />
        </button>

        {/* ШАПКА ТОВАРА С ИЗОБРАЖЕНИЕМ И ТЕГАМИ */}
        <div className="relative z-10 flex flex-col items-center mb-5">
          <div className="w-36 h-36 mb-3 relative flex items-center justify-center">
            {product.image && (
              <img 
                src={product.image} 
                alt={product.name} 
                className="max-w-full max-h-full object-contain filter drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)]" 
              />
            )}
          </div>
          
          <div className="flex items-center gap-2 mb-2">
            <span 
              className="text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border" 
              style={{ borderColor: `${accentColor}50`, color: accentColor, backgroundColor: `${accentColor}15` }}
            >
              {product.type || product.category}
            </span>
            {product.thc && (
              <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full border border-white/10 bg-white/5 text-brand-light/80">
                {t.thcContent}: {product.thc}%
              </span>
            )}
          </div>

          <h2 className="text-2xl font-black uppercase tracking-tighter text-brand-light text-center leading-none mb-1">
            {product.name}
          </h2>
          
          {product.farm && product.farm !== "-" && (
            <p className="text-[10px] font-bold uppercase tracking-widest text-brand-light/40 mt-1">
              {product.farm}
            </p>
          )}
        </div>

        {/* ВЫБОР ГРАММОВКИ / ВЕСА */}
        {weightKeys.length > 1 && (
          <div className="mb-5 relative z-10">
            <label className="text-[10px] font-black uppercase tracking-wider text-brand-light/50 block mb-2 text-center">
              {t.selectAmount}
            </label>
            <div className="grid grid-cols-4 gap-2">
              {weightKeys.map((wKey) => {
                const isSelected = selectedWeight === wKey;
                const pValue = priceMap[wKey];
                return (
                  <button
                    key={wKey}
                    type="button"
                    onClick={() => {
                      triggerHaptic('light');
                      setSelectedWeight(wKey);
                    }}
                    className={`py-2 px-1 rounded-2xl border flex flex-col items-center justify-center transition-all ${
                      isSelected
                        ? 'border-brand-secondary bg-brand-secondary/20 text-brand-secondary scale-105 shadow-lg'
                        : 'border-white/10 bg-white/5 text-brand-light/70 hover:bg-white/10'
                    }`}
                  >
                    <span className="text-xs font-black uppercase">{wKey}</span>
                    <span className="text-[10px] opacity-80 font-bold">{pValue}<Baht /></span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* БАННЕР ВЫГОДЫ ПРИ УВЕЛИЧЕНИИ ОБЪЕМА (UPSELL) */}
        {nextWeightKey && nextWeightPrice && (
          <div 
            className="mb-5 p-3.5 rounded-2xl border bg-white/5 flex items-center justify-between relative z-10" 
            style={{ borderColor: `${accentColor}30` }}
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl" style={{ backgroundColor: `${accentColor}20`, color: accentColor }}>
                <Sparkles size={16} />
              </div>
              <div className="flex flex-col">
                <span className="text-[11px] font-black text-brand-light">
                  {t.saveDiscount}
                </span>
                <span className="text-[10px] font-bold text-brand-light/60">
                  {nextWeightKey} = {nextWeightPrice}<Baht />
                </span>
              </div>
            </div>
            <button 
              type="button"
              onClick={() => {
                triggerHaptic('light');
                setSelectedWeight(nextWeightKey);
              }}
              className="px-3 py-1.5 rounded-xl text-[10px] font-black uppercase border transition-all"
              style={{ borderColor: accentColor, color: accentColor, backgroundColor: `${accentColor}10` }}
            >
              {nextWeightKey}
            </button>
          </div>
        )}

        {/* НИЖНЯЯ ПАНЕЛЬ С СЧЕТЧИКОМ И ДОБАВЛЕНИЕМ В КОРЗИНУ */}
        <div className="flex items-center justify-between gap-3 relative z-10">
          <div className="flex items-center gap-3 bg-black/40 border border-white/10 rounded-2xl p-1.5 h-14">
            <button 
              type="button"
              onClick={() => { 
                triggerHaptic('light'); 
                setQuantity(Math.max(1, quantity - 1)); 
              }} 
              className="w-10 h-10 flex items-center justify-center bg-white/5 rounded-xl active:bg-white/10 transition-colors text-brand-light/70"
            >
              <Minus size={16} />
            </button>

            <span className="text-base font-black w-6 text-center text-brand-light">
              {quantity}
            </span>

            <button 
              type="button"
              onClick={() => { 
                triggerHaptic('light'); 
                setQuantity(quantity + 1); 
              }} 
              className="w-10 h-10 flex items-center justify-center bg-white/5 rounded-xl active:bg-white/10 transition-colors text-brand-light"
            >
              <Plus size={16} />
            </button>
          </div>

          <button 
            type="button"
            onClick={handleAddToCart} 
            className="flex-1 h-14 bg-brand-secondary text-brand-primary font-black uppercase tracking-widest text-[12px] rounded-2xl active:scale-95 transition-all flex items-center justify-center gap-2 hover:bg-brand-secondary/90 shadow-xl"
          >
            <ShoppingBag size={18} />
            <span>{t.addToCart}</span>
            <span className="opacity-40">|</span>
            <span>{totalPrice}<Baht /></span>
          </button>
        </div>

      </div>
    </div>
  );
};
