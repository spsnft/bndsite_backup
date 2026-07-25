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
  prices?: any;
  category?: string;
}

interface CartStore {
  items: CartItem[];
  lang: 'en' | 'ru' | 'th'; // <-- ДОБАВЛЕН ТАЙСКИЙ
  setLang: (lang: 'en' | 'ru' | 'th') => void; // <-- ДОБАВЛЕН ТАЙСКИЙ
  addItem: (newItem: any) => void;
  removeItem: (id: string, weight: string) => void;
  clearCart: () => void;
  getTotal: () => number;
}

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      lang: 'en',

      setLang: (lang) => set({ lang }),

      addItem: (newItem) => set((state) => {
        if (!newItem) return state;

        const existingIndex = state.items.findIndex((i) => i.id === newItem.id);
        const addedWeightNum = parseFloat(newItem.weight) || 0;

        if (existingIndex > -1) {
          const existingItem = state.items[existingIndex];
          const currentWeightNum = parseFloat(existingItem.weight) || 0;
          const totalWeightNum = currentWeightNum + addedWeightNum;

          const safeItemForCheck = { ...newItem, ...existingItem };
          const isEliteProduct = isElite(safeItemForCheck) && safeItemForCheck.subcategory?.toLowerCase() !== 'import loose';

          const priceData = existingItem.prices || newItem.prices;
          let newTotalPrice = 0;
          try {
            newTotalPrice = Math.round(
              getInterpolatedPrice(totalWeightNum, priceData, isEliteProduct)
            );
          } catch (e) {
            console.error("Price interpolation failed", e);
          }

          if (!newTotalPrice || newTotalPrice === 0) {
            newTotalPrice = (existingItem.price || 0) + (newItem.price || 0);
          }

          const updatedItems = [...state.items];
          updatedItems[existingIndex] = {
            ...existingItem,
            weight: `${totalWeightNum}${existingItem.category === 'joints' ? 'PCS' : 'G'}`,
            price: newTotalPrice,
            quantity: 1
          };

          return { items: updatedItems };
        }

        return { items: [...state.items, { ...newItem, quantity: 1 }] };
      }),

      removeItem: (id, weight) => set((state) => ({
        items: state.items.filter((i) => !(i.id === id && i.weight === weight))
      })),

      clearCart: () => set({ items: [] }),

      getTotal: () => {
        const items = get().items || [];
        return items.reduce((acc, item) => acc + (Number(item.price) || 0), 0);
      },
    }),
    { 
      name: "bnd-global-cart-v1" 
    }
  )
);
