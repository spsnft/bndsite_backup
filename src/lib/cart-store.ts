"use client"
import { create } from "zustand"
import { persist } from "zustand/middleware"
import { getInterpolatedPrice, isElite } from "./utils"

interface CartItem {
  id: string;
  name: string;
  price: number;
  weight: string;
  quantity: number;
  image?: string;
  subcategory?: string;
  type?: string;
  prices?: Record<string, number>;
  category?: string;
}

interface CartStore {
  items: CartItem[];
  lang: 'en' | 'ru' | 'th';
  setLang: (lang: 'en' | 'ru' | 'th') => void;
  addItem: (newItem: CartItem) => void;
  removeItem: (id: string, weight: string) => void;
  clearCart: () => void;
  getTotal: () => number;
}

function isValidPrice(value: unknown): value is number {
  return typeof value === 'number' && !isNaN(value) && value >= 0;
}

function validatePrices(prices: unknown): Record<string, number> | null {
  if (!prices || typeof prices !== 'object') return null;
  const valid: Record<string, number> = {};
  for (const [key, value] of Object.entries(prices)) {
    if (isValidPrice(value)) valid[key] = value;
  }
  return Object.keys(valid).length > 0 ? valid : null;
}

function safeInterpolate(weight: number, prices: unknown, isEliteProduct: boolean): number {
  const validPrices = validatePrices(prices);
  if (!validPrices) return 0;

  try {
    const result = getInterpolatedPrice(weight, validPrices, isEliteProduct);
    if (!isValidPrice(result)) return 0;
    return Math.round(result);
  } catch {
    return 0;
  }
}

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      lang: 'en',

      setLang: (lang) => set({ lang }),

      addItem: (newItem) => set((state) => {
        if (!newItem) return state;

        const itemPrice = isValidPrice(newItem.price) ? newItem.price : 0;
        const addedWeightNum = parseFloat(newItem.weight) || 0;

        if (addedWeightNum <= 0) return state;
        if (!newItem.id) return state;

        const existingIndex = state.items.findIndex((i) => i.id === newItem.id);

        if (existingIndex > -1) {
          const existingItem = state.items[existingIndex];
          const currentWeightNum = parseFloat(existingItem.weight) || 0;
          const totalWeightNum = currentWeightNum + addedWeightNum;

          const safeItemForCheck = { ...newItem, ...existingItem };
          const isEliteProduct = isElite(safeItemForCheck) && safeItemForCheck.subcategory?.toLowerCase() !== 'import loose';

          const priceData = existingItem.prices || newItem.prices;
          const interpolated = safeInterpolate(totalWeightNum, priceData, isEliteProduct);

          const newTotalPrice = interpolated > 0
            ? interpolated
            : (existingItem.price || 0) + itemPrice;

          const unit = existingItem.category === 'joints' ? 'PCS' : 'G';

          const updatedItems = [...state.items];
          updatedItems[existingIndex] = {
            ...existingItem,
            weight: `${totalWeightNum}${unit}`,
            price: newTotalPrice,
            quantity: 1
          };

          return { items: updatedItems };
        }

        return {
          items: [...state.items, {
            ...newItem,
            price: itemPrice,
            quantity: 1
          }]
        };
      }),

      removeItem: (id, weight) => set((state) => ({
        items: state.items.filter((i) => !(i.id === id && i.weight === weight))
      })),

      clearCart: () => set({ items: [] }),

      getTotal: () => {
        const items = get().items || [];
        return items.reduce((acc, item) => acc + (isValidPrice(item.price) ? item.price : 0), 0);
      },
    }),
    { 
      name: "bnd-global-cart-v1" 
    }
  )
);
