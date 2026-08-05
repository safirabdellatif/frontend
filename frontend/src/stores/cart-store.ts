"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ProductId } from "@/content/products";

export interface CartItem {
  productId: ProductId;
  productName: string;
  quantity: number;
  unitBundlePrice: number;
  offerPrice: number;
  offerLabel: string;
  source: "product_page" | "cart_cross_sell" | "upsell";
}

interface CartStore {
  items: CartItem[];
  isOpen: boolean;
  addItem: (item: CartItem) => void;
  removeItem: (productId: ProductId) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  totalPrice: () => number;
  itemCount: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (item) => {
        set((state) => {
          if (item.source === "upsell") {
            const hasUpsell = state.items.some((i) => i.source === "upsell");
            if (hasUpsell) return state;
            return { items: [...state.items, item] };
          }
          const existing = state.items.findIndex(
            (i) => i.productId === item.productId && i.source !== "upsell"
          );
          if (existing !== -1) {
            const updated = [...state.items];
            updated[existing] = item;
            return { items: updated };
          }
          return { items: [...state.items, item] };
        });
      },

      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter((i) => i.productId !== productId),
        }));
      },

      clearCart: () => set({ items: [] }),

      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),

      totalPrice: () =>
        get().items.reduce((sum, item) => sum + item.offerPrice, 0),

      itemCount: () => get().items.length,
    }),
    { name: "mysanad-cart" }
  )
);
