"use client"
import * as React from "react"
import { motion } from "framer-motion"
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

    msg += `\n💵 *${t.total}: ${total}
