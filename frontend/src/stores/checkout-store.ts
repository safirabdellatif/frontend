"use client";

import { create } from "zustand";

export type CheckoutStep = "idle" | "form" | "submitting" | "upsell" | "done" | "error";

export interface OrderSummaryItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
}

interface CheckoutState {
  step: CheckoutStep;
  orderId: string | null;
  orderNumber: string | null;
  orderTotal: number | null;
  orderItems: OrderSummaryItem[];
  upsell: {
    productId: string;
    productNameAr: string;
    price: number;
    expiresInSeconds: number;
  } | null;
  errorMessage: string | null;
  setStep: (step: CheckoutStep) => void;
  setOrderResult: (data: {
    orderId: string;
    orderNumber: string;
    total: number;
    items: OrderSummaryItem[];
    upsell?: CheckoutState["upsell"];
  }) => void;
  setError: (message: string) => void;
  reset: () => void;
}

export const useCheckoutStore = create<CheckoutState>((set) => ({
  step: "idle",
  orderId: null,
  orderNumber: null,
  orderTotal: null,
  orderItems: [],
  upsell: null,
  errorMessage: null,

  setStep: (step) => set({ step }),

  setOrderResult: (data) =>
    set({
      step: data.upsell ? "upsell" : "done",
      orderId: data.orderId,
      orderNumber: data.orderNumber,
      orderTotal: data.total,
      orderItems: data.items,
      upsell: data.upsell ?? null,
      errorMessage: null,
    }),

  setError: (message) => set({ step: "error", errorMessage: message }),

  reset: () =>
    set({
      step: "idle",
      orderId: null,
      orderNumber: null,
      orderTotal: null,
      orderItems: [],
      upsell: null,
      errorMessage: null,
    }),
}));
