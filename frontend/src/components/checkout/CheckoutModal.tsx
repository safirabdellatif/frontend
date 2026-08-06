"use client";

import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { X, ShieldCheck, Truck } from "lucide-react";
import { useCartStore } from "@/stores/cart-store";
import { useCheckoutStore } from "@/stores/checkout-store";
import { isValidSaudiPhone } from "@/lib/phone";
import { createOrder } from "@/lib/api";
import { getStoredAttribution } from "@/lib/attribution";
import { generateEventId, generateSessionId } from "@/lib/events";
import { trackInitiateCheckout, trackPurchase } from "@/lib/analytics";
import { formatSARCompact } from "@/lib/money";
import { UpsellModal } from "./UpsellModal";

const schema = z.object({
  name: z
    .string()
    .min(2, "الاسم قصير جدًا")
    .max(80, "الاسم طويل جدًا")
    .refine((v) => !/^\d+$/.test(v), "الاسم لا يمكن أن يكون أرقامًا فقط"),
  phone: z
    .string()
    .refine(isValidSaudiPhone, "فضلاً أدخلي رقم جوال سعودي صحيح"),
});

type FormValues = z.infer<typeof schema>;

export function CheckoutModal() {
  const { items, totalPrice, clearCart } = useCartStore();
  const {
    step,
    setStep,
    setOrderResult,
    setError,
    reset,
    upsell,
    orderId,
    orderNumber,
    orderTotal,
    orderItems,
    errorMessage,
  } = useCheckoutStore();
  const modalRef = useRef<HTMLDivElement>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const isOpen = step === "form" || step === "submitting";

  useEffect(() => {
    if (step === "form") {
      trackInitiateCheckout(totalPrice());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen]);

  const handleClose = () => {
    if (step !== "submitting") reset();
  };

  const onSubmit = async (data: FormValues) => {
    setStep("submitting");
    const eventId = generateEventId("Purchase");
    const sessionId = generateSessionId();
    const attribution = getStoredAttribution();
    const cartItems = items;
    const total = totalPrice();

    try {
      const result = await createOrder({
        customer: { name: data.name, phone: data.phone },
        cart: { items: cartItems, total, currency: "SAR" },
        attribution,
        analytics: {
          eventId,
          sessionId,
          userAgent: navigator.userAgent,
        },
      });

      clearCart();
      setOrderResult({
        orderId: result.orderId,
        orderNumber: result.orderNumber,
        total: result.total,
        items: cartItems.map((item) => ({
          productId: item.productId,
          productName: item.productName,
          quantity: item.quantity,
          price: item.offerPrice,
        })),
        upsell: result.upsell
          ? {
              productId: result.upsell.productId,
              productNameAr: result.upsell.productNameAr,
              price: result.upsell.price,
              expiresInSeconds: result.upsell.expiresInSeconds,
            }
          : undefined,
      });

      const contentIds = cartItems.map((i) => i.productId);
      trackPurchase(result.orderId, `purchase_${eventId}`, result.total, contentIds);
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "صار خطأ مؤقت. حاولي مرة ثانية بعد لحظات.";
      setError(message);
    }
  };

  const total = totalPrice();

  if (step === "upsell" && upsell && orderId) {
    return <UpsellModal />;
  }

  if (step === "done") {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl">
          <div className="w-20 h-20 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-6 shadow-inner">
            <ShieldCheck className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-extrabold text-brand-charcoal mb-3">تم استلام طلبك بنجاح!</h2>
          <p className="text-base text-brand-gray mb-8 leading-relaxed">
            شكراً لثقتك بسَنَدي. سيتواصل معك فريقنا قريباً لتأكيد الطلب قبل الشحن. يرجى التأكد من أن رقمك متاح.
          </p>
          <div className="bg-gray-50 border border-gray-100 rounded-2xl p-5 mb-6 text-right space-y-3">
            {orderItems.length > 0 && (
              <div className="space-y-2 border-b border-gray-200 pb-3">
                <p className="text-sm font-extrabold text-brand-charcoal">ملخص الطلب</p>
                {orderItems.map((item) => (
                  <div key={item.productId} className="flex justify-between gap-4 text-sm">
                    <span className="font-bold text-brand-charcoal">
                      {item.productName}
                      {item.quantity > 1 ? ` × ${item.quantity}` : ""}
                    </span>
                    <span className="font-extrabold text-brand-teal">{formatSARCompact(item.price)}</span>
                  </div>
                ))}
              </div>
            )}
            {orderNumber && (
              <div className="flex justify-between gap-4">
                <span className="text-sm font-bold text-brand-gray">رقم الطلب</span>
                <span className="font-extrabold text-brand-charcoal">{orderNumber}</span>
              </div>
            )}
            {orderTotal !== null && (
              <div className="flex justify-between gap-4">
                <span className="text-sm font-bold text-brand-gray">المبلغ عند الاستلام</span>
                <span className="font-extrabold text-brand-teal">{formatSARCompact(orderTotal)}</span>
              </div>
            )}
            <div className="flex justify-between gap-4">
              <span className="text-sm font-bold text-brand-gray">طريقة الدفع</span>
              <span className="font-extrabold text-brand-charcoal">الدفع عند الاستلام</span>
            </div>
          </div>
          <button onClick={reset} className="btn-primary w-full py-4 text-lg shadow-lg hover:shadow-xl transition-all">
            حسنًا، بانتظاركم
          </button>
        </div>
      </div>
    );
  }

  if (step === "error") {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl">
          <h2 className="text-xl font-bold text-red-600 mb-3">تعذر إتمام الطلب</h2>
          <p className="text-brand-gray mb-6">
            {errorMessage ||
              "تعذر استقبال الطلب حاليًا. تواصل معنا عبر البريد الإلكتروني للمساعدة."}
          </p>
          <div className="flex gap-3">
            <button onClick={reset} className="btn-secondary flex-1 py-3">
              إغلاق
            </button>
            <button onClick={() => setStep("form")} className="btn-primary flex-1 py-3">
              حاولي مجددًا
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={handleClose}
            aria-hidden="true"
          />
          <motion.div
            ref={modalRef}
            role="dialog"
            aria-label="إتمام الطلب"
            aria-modal="true"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25 }}
            className="fixed inset-0 flex items-end md:items-center justify-center z-50 p-0 md:p-4"
          >
            <div className="bg-white w-full md:max-w-sm rounded-t-3xl md:rounded-3xl shadow-2xl p-5 md:p-6 max-h-[95vh] overflow-y-auto">
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-xl font-extrabold text-brand-charcoal">أكملي طلبك</h2>
                  <div className="flex items-center gap-3 mt-1 text-xs text-brand-gray font-medium">
                    <span className="flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5 text-green-600" /> الدفع عند الاستلام</span>
                    <span className="flex items-center gap-1"><Truck className="w-3.5 h-3.5 text-brand-teal" /> توصيل 2-4 أيام</span>
                  </div>
                </div>
                <button
                  onClick={handleClose}
                  aria-label="أغلق"
                  className="p-2 rounded-xl hover:bg-gray-100 transition-colors"
                  disabled={step === "submitting"}
                >
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              {/* Compact order summary */}
              <div className="flex items-center justify-between bg-brand-mint/30 rounded-xl px-4 py-3 mb-5">
                <span className="text-sm font-medium text-brand-charcoal">
                  {items.map((i) => i.productName).join(" + ")}
                </span>
                <span className="font-extrabold text-brand-teal text-lg">{formatSARCompact(total)}</span>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
                <div>
                  <input
                    id="name"
                    type="text"
                    autoComplete="name"
                    placeholder="الاسم الكريم"
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3.5 text-brand-charcoal focus:border-brand-teal focus:ring-4 focus:ring-brand-teal/10 focus:outline-none transition-all text-base"
                    {...register("name")}
                  />
                  {errors.name && (
                    <p role="alert" className="text-xs text-red-500 font-medium mt-1">{errors.name.message}</p>
                  )}
                </div>

                <div>
                  <input
                    id="phone"
                    type="tel"
                    autoComplete="tel"
                    placeholder="رقم الجوال — 05XXXXXXXX"
                    dir="ltr"
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3.5 text-brand-charcoal focus:border-brand-teal focus:ring-4 focus:ring-brand-teal/10 focus:outline-none transition-all text-base text-right"
                    {...register("phone")}
                  />
                  {errors.phone && (
                    <p role="alert" className="text-xs text-red-500 font-medium mt-1">{errors.phone.message}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={step === "submitting"}
                  className="btn-primary w-full py-4 text-lg font-extrabold shadow-lg hover:shadow-xl transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {step === "submitting" ? "جاري تأكيد الطلب..." : `تأكيد الطلب — ${formatSARCompact(total)}`}
                </button>

                <p className="text-center text-xs text-brand-gray opacity-70">
                  بياناتك محمية ولن نطلب منك الدفع الآن
                </p>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
