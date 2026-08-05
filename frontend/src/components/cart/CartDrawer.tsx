"use client";

import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingBag, Trash2, ShieldCheck, Truck, Clock } from "lucide-react";
import { useCartStore } from "@/stores/cart-store";
import { useCheckoutStore } from "@/stores/checkout-store";
import { PRODUCTS, CROSS_SELL_REASONS, type ProductId } from "@/content/products";
import { formatSARCompact } from "@/lib/money";
import { ProductThumbnail } from "@/components/product/ProductThumbnail";
import { CartCrossSellCard } from "./CartCrossSellCard";
import { CheckoutModal } from "@/components/checkout/CheckoutModal";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { items, removeItem, totalPrice } = useCartStore();
  const { step, setStep } = useCheckoutStore();
  const drawerRef = useRef<HTMLDivElement>(null);

  // Focus trap and escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);

  // Compute cross-sells: products not in cart
  const cartProductIds = items.map((i) => i.productId as ProductId);
  const primaryProductId = cartProductIds[0];
  const crossSellIds = primaryProductId
    ? (PRODUCTS[primaryProductId]?.crossSellProductIds ?? []).filter(
        (id) => !cartProductIds.includes(id)
      )
    : [];

  const total = totalPrice();

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
              onClick={onClose}
              aria-hidden="true"
            />

            {/* Drawer */}
            <motion.div
              ref={drawerRef}
              role="dialog"
              aria-label="سلة التسوق"
              aria-modal="true"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 300 }}
              className="fixed top-0 left-0 h-full w-full md:w-[420px] bg-brand-cream z-50 shadow-2xl flex flex-col overflow-hidden border-l border-brand-mint/50"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-5 py-4 bg-white border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-brand-teal" />
                  <h2 className="font-bold text-brand-charcoal text-lg">سلة التسوق</h2>
                  {items.length > 0 && (
                    <span className="text-xs bg-brand-teal text-white px-2 py-0.5 rounded-full font-bold">
                      {items.length}
                    </span>
                  )}
                </div>
                <button
                  onClick={onClose}
                  aria-label="أغلق السلة"
                  className="p-2 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
                {/* Urgency Banner */}
                {items.length > 0 && (
                  <div className="bg-orange-50 border border-orange-100 rounded-xl p-3 flex items-start gap-3">
                    <Clock className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-bold text-orange-800">الكمية محدودة جداً</p>
                      <p className="text-xs text-orange-600 mt-0.5">أكملي طلبك الآن قبل نفاذ المخزون</p>
                    </div>
                  </div>
                )}

                {items.length === 0 ? (
                  <div className="text-center py-16 text-brand-gray">
                    <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                      <ShoppingBag className="w-10 h-10 text-gray-300" />
                    </div>
                    <p className="font-bold text-brand-charcoal text-lg">سلتك فارغة</p>
                    <p className="text-sm mt-2">أضف منتجًا من صفحة المنتجات وابدأ روتين العناية</p>
                  </div>
                ) : (
                  <>
                    {/* Cart items */}
                    {items.map((item) => (
                      <div
                        key={item.productId}
                        className="bg-white rounded-2xl p-4 flex items-center gap-3 shadow-sm border border-gray-50"
                      >
                        <ProductThumbnail
                          productId={item.productId as ProductId}
                          className="w-20 h-20"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-sm text-brand-charcoal">{item.productName}</p>
                          <p className="text-xs font-medium text-brand-teal mt-1">{item.offerLabel}</p>
                          {item.source === "upsell" && (
                            <span className="text-[10px] font-bold bg-brand-gold/20 text-brand-gold px-2 py-0.5 rounded-full mt-1.5 inline-block">
                              عرض خاص
                            </span>
                          )}
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <span className="font-extrabold text-brand-charcoal text-lg">{formatSARCompact(item.offerPrice)}</span>
                          <button
                            onClick={() => removeItem(item.productId)}
                            aria-label="احذف المنتج"
                            className="text-xs text-red-500 hover:text-red-600 font-medium flex items-center gap-1"
                          >
                            <Trash2 className="w-3 h-3" /> حذف
                          </button>
                        </div>
                      </div>
                    ))}

                    {/* Cross-sells */}
                    {crossSellIds.length > 0 && (
                      <div className="pt-4">
                        <p className="text-sm font-bold text-brand-charcoal mb-3 flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-brand-gold"></span>
                          منتجات تكمل إطلالتك
                        </p>
                        <div className="space-y-3">
                          {crossSellIds.map((id) => (
                            <CartCrossSellCard
                              key={id}
                              productId={id}
                              reason={CROSS_SELL_REASONS[primaryProductId]?.[id] ?? ""}
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Footer with CTA */}
              {items.length > 0 && (
                <div className="border-t border-gray-100 px-5 py-5 bg-white shadow-[0_-4px_20px_-10px_rgba(0,0,0,0.1)]">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-base font-medium text-brand-gray">المجموع الإجمالي</span>
                    <span className="font-extrabold text-2xl text-brand-teal">{formatSARCompact(total)}</span>
                  </div>
                  
                  <button
                    onClick={() => {
                      onClose();
                      setStep("form");
                    }}
                    className="btn-primary w-full py-4 text-lg font-bold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all"
                  >
                    إتمام الطلب - الدفع عند الاستلام
                  </button>
                  
                  <div className="grid grid-cols-2 gap-2 mt-4">
                    <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-brand-gray bg-gray-50 py-2 rounded-lg">
                      <Truck className="w-4 h-4 text-brand-teal" />
                      توصيل سريع
                    </div>
                    <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-brand-gray bg-gray-50 py-2 rounded-lg">
                      <ShieldCheck className="w-4 h-4 text-brand-teal" />
                      الدفع عند الاستلام
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Checkout Modal - rendered outside drawer */}
      {(step === "form" || step === "submitting" || step === "upsell" || step === "done" || step === "error") && (
        <CheckoutModal />
      )}
    </>
  );
}
