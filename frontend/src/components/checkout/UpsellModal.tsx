"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useCheckoutStore } from "@/stores/checkout-store";
import { submitUpsell } from "@/lib/api";
import { generateEventId } from "@/lib/events";
import { formatSARCompact } from "@/lib/money";
import { useRouter } from "next/navigation";

const ORDER_SUMMARY_STORAGE_KEY = "mysanad-last-order-summary";

function encodeItems(items: { productId: string; productName: string; quantity: number; price: number }[]): string {
  try {
    if (typeof window === "undefined") return "";
    return encodeURIComponent(window.btoa(unescape(encodeURIComponent(JSON.stringify(items)))));
  } catch {
    return "";
  }
}

export function UpsellModal() {
  const { upsell, orderId, orderNumber, orderTotal, orderItems, reset } = useCheckoutStore();
  const [secondsLeft, setSecondsLeft] = useState(upsell?.expiresInSeconds ?? 15);
  const [deciding, setDeciding] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const router = useRouter();

  const saveOrderSummary = (items = orderItems, total = orderTotal) => {
    if (typeof window === "undefined") return;
    try {
      window.sessionStorage.setItem(
        ORDER_SUMMARY_STORAGE_KEY,
        JSON.stringify({
          orderNumber,
          total,
          items,
        })
      );
    } catch {
      // The thank-you page can still show payment details from the URL.
    }
  };

  const buildThankYouUrl = (
    items: { productId: string; productName: string; quantity: number; price: number }[],
    total: number | null,
    upsellAccepted: boolean
  ) => {
    const params = new URLSearchParams();
    if (orderNumber) params.set("order", orderNumber);
    if (upsellAccepted) params.set("upsell", "accepted");
    if (total !== null && total !== undefined) params.set("total", String(total));
    const encoded = encodeItems(items);
    if (encoded) params.set("items", encoded);
    return `/thank-you?${params.toString()}`;
  };

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          clearInterval(timerRef.current!);
          handleDecline();
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current!);
  }, []);

  const handleDecline = async () => {
    if (deciding) return;
    setDeciding(true);
    if (orderId) {
      await submitUpsell(orderId, { accepted: false }).catch(() => {});
    }
    saveOrderSummary();
    const url = buildThankYouUrl(orderItems, orderTotal, false);
    reset();
    router.push(url);
  };

  const handleAccept = async () => {
    if (deciding || !upsell || !orderId) return;
    clearInterval(timerRef.current!);
    setDeciding(true);
    const eventId = generateEventId("UpsellAccept");
    const result = await submitUpsell(orderId, {
      accepted: true,
      productId: upsell.productId,
      eventId,
    }).catch(() => {});
    const finalTotal = result?.total ?? (orderTotal !== null ? orderTotal + upsell.price : null);
    const itemsWithUpsell = [
      ...orderItems,
      {
        productId: upsell.productId,
        productName: upsell.productNameAr,
        quantity: 1,
        price: upsell.price,
      },
    ];
    saveOrderSummary(itemsWithUpsell, finalTotal);
    const url = buildThankYouUrl(itemsWithUpsell, finalTotal, true);
    reset();
    router.push(url);
  };

  if (!upsell) return null;

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-3xl shadow-modal max-w-sm w-full p-7 text-center"
      >
        {/* Timer */}
        <div className="w-14 h-14 rounded-full bg-brand-gold/20 text-brand-gold font-bold text-2xl flex items-center justify-center mx-auto mb-5">
          {secondsLeft}
        </div>

        <p className="text-xs text-brand-teal font-semibold uppercase tracking-widest mb-2">
          عرض خاص لطلبك فقط
        </p>
        <h2 className="text-xl font-bold text-brand-charcoal mb-2">
          {upsell.productNameAr}
        </h2>
        <p className="text-sm text-brand-gray leading-relaxed mb-5">
          أضيفي {upsell.productNameAr} لروتينك الآن بسعر{" "}
          <span className="font-extrabold text-brand-teal text-lg">{formatSARCompact(upsell.price)}</span>{" "}
          بدل السعر الأساسي، وادفعي عند الاستلام. لن نطلب بياناتك من جديد!
        </p>

        {/* Progress bar */}
        <div className="w-full bg-gray-100 rounded-full h-1.5 mb-6 overflow-hidden">
          <motion.div
            className="h-full bg-brand-gold rounded-full"
            initial={{ width: "100%" }}
            animate={{ width: "0%" }}
            transition={{ duration: upsell.expiresInSeconds, ease: "linear" }}
          />
        </div>

        <button
          onClick={handleAccept}
          disabled={deciding}
          className="btn-primary w-full py-4 text-base font-bold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all mb-3 disabled:opacity-60 disabled:transform-none"
        >
          أضيفيها لطلبي - {formatSARCompact(upsell.price)} فقط
        </button>
        <button
          onClick={handleDecline}
          disabled={deciding}
          className="text-sm text-brand-gray font-medium hover:text-brand-charcoal transition-colors disabled:opacity-60"
        >
          لا شكرًا، أكملي الطلب بدون العرض
        </button>
      </motion.div>
    </div>
  );
}
