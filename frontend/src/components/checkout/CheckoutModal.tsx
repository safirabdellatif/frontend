"use client";

import { ShieldCheck, Loader2 } from "lucide-react";
import { useCheckoutStore } from "@/stores/checkout-store";
import { formatSARCompact } from "@/lib/money";
import { UpsellModal } from "./UpsellModal";

export function CheckoutModal() {
  const {
    step,
    setStep,
    reset,
    upsell,
    orderId,
    orderNumber,
    orderTotal,
    orderItems,
    errorMessage,
  } = useCheckoutStore();

  if (step === "upsell" && upsell && orderId) {
    return <UpsellModal />;
  }

  if (step === "submitting") {
    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center">
        <div className="bg-white rounded-3xl p-8 flex flex-col items-center gap-4 shadow-2xl">
          <Loader2 className="w-10 h-10 text-brand-teal animate-spin" />
          <p className="font-bold text-brand-charcoal">جاري تأكيد الطلب...</p>
        </div>
      </div>
    );
  }

  if (step === "done") {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl">
          <div className="w-20 h-20 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-6">
            <ShieldCheck className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-extrabold text-brand-charcoal mb-3">تم استلام طلبك بنجاح!</h2>
          <p className="text-base text-brand-gray mb-6 leading-relaxed">
            شكراً لثقتك بسَنَدي. سيتواصل معك فريقنا قريباً لتأكيد الطلب قبل الشحن.
          </p>
          <div className="bg-gray-50 rounded-2xl p-4 mb-6 text-right space-y-2">
            {orderItems.map((item) => (
              <div key={item.productId} className="flex justify-between text-sm">
                <span className="font-bold text-brand-charcoal">
                  {item.productName}{item.quantity > 1 ? ` x ${item.quantity}` : ""}
                </span>
                <span className="font-extrabold text-brand-teal">{formatSARCompact(item.price)}</span>
              </div>
            ))}
            {orderNumber && (
              <div className="flex justify-between text-sm pt-2 border-t border-gray-200">
                <span className="text-brand-gray">رقم الطلب</span>
                <span className="font-extrabold text-brand-charcoal">{orderNumber}</span>
              </div>
            )}
            {orderTotal !== null && (
              <div className="flex justify-between text-sm">
                <span className="text-brand-gray">المبلغ عند الاستلام</span>
                <span className="font-extrabold text-brand-teal">{formatSARCompact(orderTotal)}</span>
              </div>
            )}
          </div>
          <button onClick={reset} className="btn-primary w-full py-4 text-lg">
            حسناً، بانتظاركم
          </button>
        </div>
      </div>
    );
  }

  if (step === "error") {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl">
          <h2 className="text-xl font-bold text-red-600 mb-3">تعذر اتمام الطلب</h2>
          <p className="text-brand-gray mb-6">
            {errorMessage || "تعذر استقبال الطلب حالياً. تواصل معنا للمساعدة."}
          </p>
          <div className="flex gap-3">
            <button onClick={reset} className="btn-secondary flex-1 py-3">اغلاق</button>
            <button onClick={() => setStep("idle")} className="btn-primary flex-1 py-3">حاولي مجدداً</button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
