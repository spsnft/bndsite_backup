"use client"
import * as React from "react"
import { X, Trash2, SendHorizontal, CreditCard, ShoppingBag } from "lucide-react"
import { useCart } from "@/lib/cart-store"
import { TranslationDictionary } from "@/lib/translations"
import { triggerHaptic, CONTACT_METHODS, Baht } from "@/lib/utils"

interface CheckoutProps {
  isOpen?: boolean;
  items: any[];
  total: number;
  t: TranslationDictionary;
  onClose: () => void;
  onEditItem?: (item: any) => void;
  whatsappNumber?: string;
}

export const Checkout = ({ 
  isOpen = true,
  items, 
  total,
  t,
  onClose, 
  onEditItem,
  whatsappNumber = "66612345678"
}: CheckoutProps) => {
  const { removeItem, clearCart } = useCart();

  const [deliveryType, setDeliveryType] = React.useState<'delivery' | 'pickup'>('delivery');
  const [selectedContact, setSelectedContact] = React.useState('telegram');
  const [contactInfo, setContactInfo] = React.useState('');
  const [paymentMethod, setPaymentMethod] = React.useState('cash');
  const [address, setAddress] = React.useState('');
  const [notes, setNotes] = React.useState('');
  const [isClosing, setIsClosing] = React.useState(false);

  const handleClose = React.useCallback(() => {
    triggerHaptic('light');
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, 300);
  }, [onClose]);

  if (!isOpen && !isClosing) return null;

  const handleSubmit = () => {
    if (items.length === 0) return;
    triggerHaptic('success');

    let msg = `🛒 *${t.checkoutTitle.toUpperCase()}*\n\n`;
    
    items.forEach((item, idx) => {
      msg += `${idx + 1}. *${item.name}* — ${item.weight} x ${item.quantity || 1} = *${item.price}฿*\n`;
    });

    msg += `\n💵 *${t.total}: ${total}฿*\n`;
    msg += `🚚 *${t.receiveMethod}:* ${deliveryType === 'delivery' ? t.deliveryCourier : t.selfPickup}\n`;
    msg += `💬 *${t.contactMethod}:* ${selectedContact.toUpperCase()} (${contactInfo || 'Not specified'})\n`;
    msg += `💳 *${t.payMethod}:* ${paymentMethod === 'cash' ? t.payCash : paymentMethod === 'qr' ? t.payQR : t.payRub}\n`;

    if (deliveryType === 'delivery' && address) {
      msg += `📍 *${t.addressLabel}:* ${address}\n`;
    }
    if (notes) {
      msg += `📝 *${t.notesLabel}:* ${notes}\n`;
    }

    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(msg)}`;
    window.open(whatsappUrl, '_blank');
    clearCart();
    handleClose();
  };

  return (
    <div className={`fixed inset-0 z-[120] flex items-end sm:items-center justify-center p-0 sm:p-4 transition-all duration-300 ${isClosing ? 'opacity-0' : 'opacity-100'}`}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={handleClose} />

      <div className={`relative w-full max-w-lg bg-brand-primary border border-white/10 sm:rounded-[2.5rem] rounded-t-[2.5rem] p-6 pt-8 shadow-2xl flex flex-col max-h-[90vh] transition-transform duration-300 ${isClosing ? 'translate-y-full sm:translate-y-12' : 'translate-y-0'}`}>
        
        {/* Мобильный индикатор свайпа */}
        <div className="absolute top-3 left-1/2 -translate-x-1/2 w-12 h-1.5 bg-white/20 rounded-full sm:hidden" />

        {/* Кнопка закрытия */}
        <button 
          type="button"
          onClick={handleClose} 
          className="absolute top-6 right-6 p-2 bg-white/5 hover:bg-white/10 active:scale-90 rounded-full border border-white/10 transition-all text-brand-light z-20"
        >
          <X size={18} />
        </button>

        {/* HEADER */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-brand-secondary/20 rounded-2xl text-brand-secondary">
            <ShoppingBag size={22} />
          </div>
          <div>
            <h2 className="text-xl font-black uppercase tracking-tight text-brand-light">{t.checkoutTitle}</h2>
            <p className="text-xs text-brand-light/50">{items.length} {t.items}</p>
          </div>
        </div>

        {/* ITEMS LIST & FORM */}
        <div className="overflow-y-auto space-y-5 pr-1 no-scrollbar flex-1">
          {items.length === 0 ? (
            <div className="py-12 text-center text-brand-light/40 font-bold uppercase tracking-wider text-xs">
              {t.emptyCart}
            </div>
          ) : (
            <>
              {/* CART ITEMS */}
              <div className="space-y-2">
                {items.map((item) => (
                  <div key={`${item.id}-${item.weight}`} className="p-3 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-between gap-3">
                    <div className="flex-1 min-w-0 cursor-pointer" onClick={() => onEditItem && onEditItem(item)}>
                      <h4 className="text-xs font-black uppercase text-brand-light truncate">{item.name}</h4>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[10px] font-bold text-brand-secondary px-2 py-0.5 bg-brand-secondary/10 rounded-md">{item.weight}</span>
                        <span className="text-xs font-black text-brand-light">{item.price}<Baht /></span>
                      </div>
                    </div>
                    <button 
                      type="button"
                      onClick={() => { triggerHaptic('warning'); removeItem(item.id, item.weight); }}
                      className="p-2 text-red-400/60 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>

              {/* RECEIVE METHOD */}
              <div>
                <label className="text-[10px] font-black uppercase tracking-wider text-brand-light/50 block mb-2">{t.receiveMethod}</label>
                <div className="grid grid-cols-2 gap-2">
                  <button 
                    type="button"
                    onClick={() => { triggerHaptic('light'); setDeliveryType('delivery'); }}
                    className={`py-3 px-4 rounded-2xl border text-xs font-black uppercase transition-all ${deliveryType === 'delivery' ? 'border-brand-secondary bg-brand-secondary/20 text-brand-secondary' : 'border-white/10 bg-white/5 text-brand-light/60'}`}
                  >
                    {t.deliveryCourier}
                  </button>
                  <button 
                    type="button"
                    onClick={() => { triggerHaptic('light'); setDeliveryType('pickup'); }}
                    className={`py-3 px-4 rounded-2xl border text-xs font-black uppercase transition-all ${deliveryType === 'pickup' ? 'border-brand-secondary bg-brand-secondary/20 text-brand-secondary' : 'border-white/10 bg-white/5 text-brand-light/60'}`}
                  >
                    {t.selfPickup}
                  </button>
                </div>
              </div>

              {/* CONTACT METHOD */}
              <div>
                <label className="text-[10px] font-black uppercase tracking-wider text-brand-light/50 block mb-2">{t.contactMethod}</label>
                <div className="grid grid-cols-4 gap-1.5 mb-2">
                  {(CONTACT_METHODS || []).map((m: any) => {
                    const IconComponent = m.icon;
                    return (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => { triggerHaptic('light'); setSelectedContact(m.id); }}
                        className={`py-2 px-2 rounded-xl border text-[10px] font-bold uppercase transition-all flex flex-col items-center gap-1 ${selectedContact === m.id ? 'border-brand-secondary bg-brand-secondary/20 text-brand-secondary' : 'border-white/10 bg-white/5 text-brand-light/60'}`}
                      >
                        {IconComponent && <IconComponent size={14} />}
                        <span>{m.label}</span>
                      </button>
                    );
                  })}
                </div>
                <input 
                  type="text" 
                  placeholder={t.phContact}
                  value={contactInfo}
                  onChange={(e) => setContactInfo(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-2xl px-4 py-3 text-xs text-brand-light placeholder:text-white/30 focus:outline-none focus:border-brand-secondary transition-colors"
                />
              </div>

              {/* PAYMENT METHOD */}
              <div>
                <label className="text-[10px] font-black uppercase tracking-wider text-brand-light/50 block mb-2">{t.payMethod}</label>
                <div className="space-y-1.5">
                  {[
                    { id: 'cash', label: t.payCash },
                    { id: 'qr', label: t.payQR },
                    { id: 'rub', label: t.payRub }
                  ].map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => { triggerHaptic('light'); setPaymentMethod(p.id); }}
                      className={`w-full py-3 px-4 rounded-2xl border text-xs font-bold transition-all text-left flex items-center justify-between ${paymentMethod === p.id ? 'border-brand-secondary bg-brand-secondary/20 text-brand-secondary' : 'border-white/10 bg-white/5 text-brand-light/70'}`}
                    >
                      <span>{p.label}</span>
                      <CreditCard size={16} className="opacity-50" />
                    </button>
                  ))}
                </div>
              </div>

              {/* ADDRESS (IF DELIVERY) */}
              {deliveryType === 'delivery' && (
                <div>
                  <label className="text-[10px] font-black uppercase tracking-wider text-brand-light/50 block mb-2">{t.addressLabel}</label>
                  <textarea 
                    rows={2}
                    placeholder={t.addressPlaceholder}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-2xl p-3 text-xs text-brand-light placeholder:text-white/30 focus:outline-none focus:border-brand-secondary transition-colors resize-none"
                  />
                </div>
              )}

              {/* NOTES */}
              <div>
                <label className="text-[10px] font-black uppercase tracking-wider text-brand-light/50 block mb-2">{t.notesLabel}</label>
                <input 
                  type="text" 
                  placeholder={t.notesPlaceholder}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-2xl px-4 py-3 text-xs text-brand-light placeholder:text-white/30 focus:outline-none focus:border-brand-secondary transition-colors"
                />
              </div>
            </>
          )}
        </div>

        {/* FOOTER CTA */}
        {items.length > 0 && (
          <div className="pt-4 border-t border-white/10 mt-4 flex items-center justify-between gap-4 shrink-0">
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-brand-light/40 block">{t.total}</span>
              <span className="text-xl font-black text-brand-light">{total}<Baht /></span>
            </div>
            <button 
              type="button"
              onClick={handleSubmit}
              className="flex-1 h-14 bg-brand-secondary text-brand-primary font-black uppercase tracking-widest text-[11px] rounded-2xl active:scale-95 transition-all flex items-center justify-center gap-2 hover:bg-brand-secondary/90 shadow-xl"
            >
              <SendHorizontal size={16} />
              {t.checkoutSubmit}
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
