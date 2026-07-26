"use client"
import * as React from "react"
import { motion } from "framer-motion"
import { X, Trash2, SendHorizontal, CreditCard, ShoppingBag, Phone, MessageCircle } from "lucide-react"
import { useCart } from "@/lib/cart-store"
import { TranslationDictionary } from "@/lib/translations"
import { triggerHaptic, Baht } from "@/lib/utils"

interface CheckoutProps {
  isOpen?: boolean;
  items: any[];
  total: number;
  t: TranslationDictionary;
  onClose: () => void;
  onEditItem?: (item: any) => void;
  whatsappNumber?: string;
}

const PAYMENT_METHODS = [
  { id: 'cash', icon: null },
  { id: 'qr', icon: null },
] as const;

const CONTACT_METHODS_DELIVERY = [
  { id: 'phone', icon: Phone },
  { id: 'whatsapp', icon: MessageCircle },
] as const;

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

  const [deliveryType, setDeliveryType] = React.useState<'pickup' | 'delivery'>('pickup');
  const [phone, setPhone] = React.useState('');
  const [paymentMethod, setPaymentMethod] = React.useState('cash');
  const [contactMethod, setContactMethod] = React.useState('phone');
  const [address, setAddress] = React.useState('');
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

    if (deliveryType === 'delivery') {
      msg += `💳 *${t.payMethod}:* ${paymentMethod === 'cash' ? t.payCash : t.payQR}\n`;
      msg += `💬 *${t.contactMethod}:* ${contactMethod === 'phone' ? 'Phone/SMS' : 'WhatsApp'}\n`;
      if (address) msg += `📍 *${t.addressLabel}:* ${address}\n`;
    }

    msg += `📞 *${safeLang === 'ru' ? 'Телефон' : (safeLang === 'th' ? 'โทรศัพท์' : 'Phone')}:* ${phone}`;

    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(msg)}`;
    window.open(whatsappUrl, '_blank');
    clearCart();
    handleClose();
  };

  const { lang } = useCart();
  const safeLang = (lang || 'en') as string;

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
        className="relative w-full max-w-lg bg-brand-primary rim-border sm:rounded-modal rounded-t-modal p-6 pt-8 shadow-2xl flex flex-col max-h-[90vh]"
      >
        <div className="absolute top-3 left-1/2 -translate-x-1/2 w-12 h-1.5 bg-white/20 rounded-full sm:hidden" />

        <button 
          type="button"
          onClick={handleClose} 
          className="absolute top-6 right-6 p-2 bg-white/5 hover:bg-white/10 active:scale-90 rounded-full border border-white/10 transition-all text-brand-light z-20"
        >
          <X size={18} />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-brand-secondary/20 rounded-button text-brand-secondary">
            <ShoppingBag size={22} />
          </div>
          <div>
            <h2 className="text-xl font-black uppercase tracking-tight text-brand-light">{t.checkoutTitle}</h2>
            <p className="text-xs text-brand-light/50">{items.length} {t.items}</p>
          </div>
        </div>

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
                  <div key={`${item.id}-${item.weight}`} className="p-3 bg-white/5 rim-border rounded-button flex items-center justify-between gap-3">
                    <div className="flex-1 min-w-0 cursor-pointer" onClick={() => onEditItem && onEditItem(item)}>
                      <h4 className="text-xs font-black uppercase text-brand-light truncate">{item.name}</h4>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[11px] font-bold text-brand-secondary px-2 py-0.5 bg-brand-secondary/10 rounded-md">{item.weight}</span>
                        <span className="text-xs font-black text-brand-light">{item.price}<Baht /></span>
                      </div>
                    </div>
                    <button 
                      type="button"
                      onClick={() => { triggerHaptic('warning'); removeItem(item.id, item.weight); }}
                      className="p-2 text-red-400/60 hover:text-red-400 hover:bg-red-500/10 rounded-badge transition-all"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>

              {/* RECEIVE METHOD */}
              <div>
                <label className="text-[11px] font-black uppercase tracking-wide text-brand-light/50 block mb-2">{t.receiveMethod}</label>
                <div className="grid grid-cols-2 gap-2">
                  <button 
                    type="button"
                    onClick={() => { triggerHaptic('light'); setDeliveryType('pickup'); }}
                    className={`py-3 px-4 rounded-button border text-xs font-black uppercase transition-all ${deliveryType === 'pickup' ? 'border-brand-secondary bg-brand-secondary/20 text-brand-secondary' : 'rim-border bg-white/5 text-brand-light/60'}`}
                  >
                    {t.selfPickup}
                  </button>
                  <button 
                    type="button"
                    onClick={() => { triggerHaptic('light'); setDeliveryType('delivery'); }}
                    className={`py-3 px-4 rounded-button border text-xs font-black uppercase transition-all ${deliveryType === 'delivery' ? 'border-brand-secondary bg-brand-secondary/20 text-brand-secondary' : 'rim-border bg-white/5 text-brand-light/60'}`}
                  >
                    {t.deliveryCourier}
                  </button>
                </div>
              </div>

              {/* PHONE (always) */}
              <div>
                <label className="text-[11px] font-black uppercase tracking-wide text-brand-light/50 block mb-2">
                  {safeLang === 'ru' ? 'Телефон' : (safeLang === 'th' ? 'โทรศัพท์' : 'Phone')}
                </label>
                <input 
                  type="tel" 
                  placeholder="+66 123 456 789"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-black/40 rim-border rounded-button px-4 py-3 text-xs text-brand-light placeholder:text-white/30 focus:outline-none focus:border-brand-secondary transition-colors"
                />
              </div>

              {/* DELIVERY FIELDS */}
              {deliveryType === 'delivery' && (
                <>
                  {/* PAYMENT METHOD */}
                  <div>
                    <label className="text-[11px] font-black uppercase tracking-wide text-brand-light/50 block mb-2">{t.payMethod}</label>
                    <div className="grid grid-cols-2 gap-2">
                      {PAYMENT_METHODS.map((p) => (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() => { triggerHaptic('light'); setPaymentMethod(p.id); }}
                          className={`py-3 px-4 rounded-button border text-xs font-black uppercase transition-all ${paymentMethod === p.id ? 'border-brand-secondary bg-brand-secondary/20 text-brand-secondary' : 'rim-border bg-white/5 text-brand-light/60'}`}
                        >
                          {p.id === 'cash' ? t.payCash : t.payQR}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* CONTACT METHOD (for delivery) */}
                  <div>
                    <label className="text-[11px] font-black uppercase tracking-wide text-brand-light/50 block mb-2">{t.contactMethod}</label>
                    <div className="grid grid-cols-2 gap-2 mb-2">
                      {CONTACT_METHODS_DELIVERY.map((m) => {
                        const IconComponent = m.icon;
                        return (
                          <button
                            key={m.id}
                            type="button"
                            onClick={() => { triggerHaptic('light'); setContactMethod(m.id); }}
                            className={`py-3 px-4 rounded-button border text-xs font-black uppercase transition-all flex items-center justify-center gap-2 ${contactMethod === m.id ? 'border-brand-secondary bg-brand-secondary/20 text-brand-secondary' : 'rim-border bg-white/5 text-brand-light/60'}`}
                          >
                            {IconComponent && <IconComponent size={16} />}
                            {m.id === 'phone' ? 'Phone/SMS' : 'WhatsApp'}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* ADDRESS */}
                  <div>
                    <label className="text-[11px] font-black uppercase tracking-wide text-brand-light/50 block mb-2">{t.addressLabel}</label>
                    <textarea 
                      rows={2}
                      placeholder={t.addressPlaceholder}
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full bg-black/40 rim-border rounded-button p-3 text-xs text-brand-light placeholder:text-white/30 focus:outline-none focus:border-brand-secondary transition-colors resize-none"
                    />
                  </div>
                </>
              )}
            </>
          )}
        </div>

        {items.length > 0 && (
          <div className="pt-4 border-t border-white/10 mt-4 flex items-center justify-between gap-4 shrink-0">
            <div>
              <span className="text-[11px] font-black uppercase tracking-wide text-brand-light/40 block">{t.total}</span>
              <span className="text-xl font-black text-brand-light">{total}<Baht /></span>
            </div>
            <button 
              type="button"
              onClick={handleSubmit}
              className="flex-1 h-14 btn-metal font-black uppercase tracking-widest text-[11px] rounded-button active:scale-95 transition-all flex items-center justify-center gap-2 hover:brightness-110 shadow-xl"
            >
              <SendHorizontal size={16} />
              {t.checkoutSubmit}
            </button>
          </div>
        )}

      </motion.div>
    </div>
  );
};
