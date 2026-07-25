"use client"
import * as React from "react"
import { X, Trash2, Plus, Minus, Bike, Store, Send } from "lucide-react"
import { useCart } from "@/lib/cart-store"
import { triggerHaptic } from "@/lib/utils"

export const BahtSymbol = React.memo(() => (
  <span className="font-sans text-[0.75em] ml-0.5 opacity-90 align-baseline">฿</span>
));

export const CheckoutModal = ({ 
  items, 
  total, 
  t, 
  lang, 
  onClose, 
  onEditItem 
}: { 
  items: any[], 
  total: number, 
  t: any, 
  lang: string, 
  onClose: () => void, 
  onEditItem: (p: any) => void 
}) => {
  const [isClosing, setIsClosing] = React.useState(false);
  const [deliveryMethod, setDeliveryMethod] = React.useState<'delivery' | 'pickup'>('delivery');
  const [paymentMethod, setPaymentMethod] = React.useState<'cash' | 'transfer' | 'rubles'>('cash');
  const [address, setAddress] = React.useState('');
  const [contact, setContact] = React.useState('');
  const [comment, setComment] = React.useState('');

  const { updateQuantity, removeItem, clearCart } = useCart();

  const handleClose = React.useCallback(() => {
    setIsClosing(true);
    setTimeout(onClose, 300);
  }, [onClose]);

  const handleSendOrder = () => {
    triggerHaptic('success');
    
    let message = `🛒 *НОВЫЙ ЗАКАЗ (MPS Phuket)*\n\n`;
    message += `*Способ получения:* ${deliveryMethod === 'delivery' ? '🛵 Доставка' : '🏪 Самовывоз'}\n`;
    message += `*Способ оплаты:* ${
      paymentMethod === 'cash' ? '💵 Наличные' : paymentMethod === 'transfer' ? '🏦 QR / Банк (THB)' : '🇷🇺 Перевод в рублях'
    }\n\n`;
    
    message += `*Состав заказа:*\n`;
    items.forEach((item, index) => {
      const unit = item.category === 'accessories' ? 'шт' : (item.category === 'joints' ? 'шт' : 'г');
      message += `${index + 1}. ${item.name} — ${item.quantity} ${unit} (${item.price * item.quantity}฿)\n`;
    });

    message += `\n*Итого:* ${total}฿\n\n`;

    if (deliveryMethod === 'delivery') {
      message += `*Адрес / Отель:* ${address || 'Не указан'}\n`;
    }
    if (contact) {
      message += `*Контакт:* ${contact}\n`;
    }
    if (comment) {
      message += `*Комментарий:* ${comment}\n`;
    }

    const whatsappUrl = `https://wa.me/66612345678?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    clearCart();
    handleClose();
  };

  return (
    <div className={`fixed inset-0 z-[130] flex items-end sm:items-center justify-center p-0 sm:p-4 transition-all duration-300 ${isClosing ? 'opacity-0' : 'opacity-100'}`}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={handleClose} />

      <div className={`relative w-full max-w-lg bg-brand-primary border border-white/10 sm:rounded-[2.5rem] rounded-t-[2.5rem] p-6 pt-8 shadow-2xl flex flex-col max-h-[90vh] transition-transform duration-300 ${isClosing ? 'translate-y-full sm:translate-y-12' : 'translate-y-0'}`}>
        
        <div className="absolute top-3 left-1/2 -translate-x-1/2 w-12 h-1.5 bg-white/20 rounded-full sm:hidden" />

        <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
          <h2 className="text-xl font-black uppercase tracking-tight text-brand-light">
            {lang === 'ru' ? 'Корзина' : 'Your Cart'}
          </h2>
          <button onClick={handleClose} className="p-2 bg-white/5 hover:bg-white/10 active:scale-90 rounded-full border border-white/10 transition-all text-brand-light">
            <X size={18} />
          </button>
        </div>

        <div className="overflow-y-auto space-y-4 pr-1 no-scrollbar flex-1">
          {/* ITEMS LIST */}
          <div className="space-y-3">
            {items.map((item) => (
              <div key={item.id} className="p-3 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-between gap-3">
                <div className="w-12 h-12 bg-black/40 rounded-xl p-1 flex items-center justify-center shrink-0 cursor-pointer" onClick={() => onEditItem(item)}>
                  <img src={item.image} alt={item.name} className="max-w-full max-h-full object-contain" />
                </div>
                
                <div className="flex-1 min-w-0 cursor-pointer" onClick={() => onEditItem(item)}>
                  <h4 className="text-sm font-black uppercase tracking-tight text-brand-light truncate">{item.name}</h4>
                  <p className="text-[11px] font-bold text-brand-secondary">{item.price * item.quantity} <BahtSymbol /></p>
                </div>

                <div className="flex items-center gap-2 bg-black/40 border border-white/10 rounded-xl p-1">
                  <button onClick={() => { triggerHaptic('light'); updateQuantity(item.id, Math.max(1, item.quantity - 1)); }} className="w-7 h-7 flex items-center justify-center bg-white/5 rounded-lg active:scale-90 text-brand-light/70">
                    <Minus size={12} />
                  </button>
                  <span className="text-[13px] font-black w-4 text-center">{item.quantity}</span>
                  <button onClick={() => { triggerHaptic('light'); updateQuantity(item.id, item.quantity + 1); }} className="w-7 h-7 flex items-center justify-center bg-white/5 rounded-lg active:scale-90 text-brand-light">
                    <Plus size={12} />
                  </button>
                </div>

                <button onClick={() => { triggerHaptic('warning'); removeItem(item.id); }} className="p-2 text-red-400 hover:text-red-300 active:scale-90">
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>

          {/* DELIVERY METHOD TOGGLE */}
          <div className="pt-2">
            <label className="text-[10px] font-black uppercase tracking-wider text-brand-light/50 block mb-2">
              {lang === 'ru' ? 'Способ получения' : 'Receiving Method'}
            </label>
            <div className="grid grid-cols-2 gap-2 p-1 bg-black/40 rounded-2xl border border-white/10">
              <button 
                onClick={() => { triggerHaptic('light'); setDeliveryMethod('delivery'); }}
                className={`py-2.5 px-3 rounded-xl flex items-center justify-center gap-2 text-[11px] font-black uppercase transition-all ${deliveryMethod === 'delivery' ? 'bg-brand-secondary text-brand-primary' : 'text-brand-light/60 hover:text-brand-light'}`}
              >
                <Bike size={15} />
                {lang === 'ru' ? 'Доставка' : 'Delivery'}
              </button>
              <button 
                onClick={() => { triggerHaptic('light'); setDeliveryMethod('pickup'); }}
                className={`py-2.5 px-3 rounded-xl flex items-center justify-center gap-2 text-[11px] font-black uppercase transition-all ${deliveryMethod === 'pickup' ? 'bg-brand-secondary text-brand-primary' : 'text-brand-light/60 hover:text-brand-light'}`}
              >
                <Store size={15} />
                {lang === 'ru' ? 'Самовывоз' : 'Pickup'}
              </button>
            </div>
          </div>

          {/* PAYMENT METHOD */}
          <div>
            <label className="text-[10px] font-black uppercase tracking-wider text-brand-light/50 block mb-2">
              {lang === 'ru' ? 'Способ оплаты' : 'Payment Method'}
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'cash', label: lang === 'ru' ? 'Наличные' : 'Cash' },
                { id: 'transfer', label: lang === 'ru' ? 'QR / THB' : 'Bank QR' },
                { id: 'rubles', label: lang === 'ru' ? 'Рубли (СБП)' : 'Rubles' },
              ].map(method => (
                <button
                  key={method.id}
                  onClick={() => { triggerHaptic('light'); setPaymentMethod(method.id as any); }}
                  className={`py-2.5 px-2 rounded-xl border text-[10px] font-black uppercase transition-all text-center ${paymentMethod === method.id ? 'border-brand-secondary bg-brand-secondary/20 text-brand-secondary' : 'border-white/10 bg-white/5 text-brand-light/60'}`}
                >
                  {method.label}
                </button>
              ))}
            </div>
          </div>

          {/* INPUT FIELDS */}
          <div className="space-y-2 pt-1">
            {deliveryMethod === 'delivery' && (
              <input 
                type="text" 
                placeholder={lang === 'ru' ? 'Отель / Адрес и номер комнаты' : 'Hotel / Address & room number'} 
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-2xl px-4 py-3 text-xs text-brand-light placeholder:text-white/30 focus:outline-none focus:border-brand-secondary transition-colors"
              />
            )}
            <input 
              type="text" 
              placeholder={lang === 'ru' ? 'Ваш Telegram / WhatsApp / Телефон' : 'Your Telegram / WhatsApp / Phone'} 
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded-2xl px-4 py-3 text-xs text-brand-light placeholder:text-white/30 focus:outline-none focus:border-brand-secondary transition-colors"
            />
            <input 
              type="text" 
              placeholder={lang === 'ru' ? 'Комментарий к заказу' : 'Order comment'} 
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded-2xl px-4 py-3 text-xs text-brand-light placeholder:text-white/30 focus:outline-none focus:border-brand-secondary transition-colors"
            />
          </div>
        </div>

        {/* FOOTER ACTION */}
        <div className="pt-4 border-t border-white/10 mt-4 flex items-center justify-between gap-4">
          <div>
            <span className="text-[10px] font-black uppercase text-brand-light/50 block">{lang === 'ru' ? 'Итого' : 'Total'}</span>
            <span className="text-xl font-black text-brand-light">{total} <BahtSymbol /></span>
          </div>

          <button 
            onClick={handleSendOrder}
            className="flex-1 h-14 bg-brand-secondary text-brand-primary font-black uppercase tracking-widest text-[12px] rounded-2xl active:scale-95 transition-all flex items-center justify-center gap-2 hover:bg-brand-secondary/90 shadow-xl"
          >
            <Send size={16} />
            {lang === 'ru' ? 'Заказать в WhatsApp' : 'Order via WhatsApp'}
          </button>
        </div>

      </div>
    </div>
  );
};
