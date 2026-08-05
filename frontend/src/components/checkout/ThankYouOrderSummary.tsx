"use client";

import { useEffect, useState } from "react";
import { Banknote, PackageCheck } from "lucide-react";
import { formatSARCompact } from "@/lib/money";

interface OrderSummaryItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
}

const ORDER_SUMMARY_STORAGE_KEY = "mysanad-last-order-summary";

interface StoredOrderSummary {
  orderNumber: string | null;
  total: number | null;
  items: OrderSummaryItem[];
}

interface ThankYouOrderSummaryProps {
  orderNumber?: string;
  total?: number;
  encodedItems?: string;
}

function decodeItems(encoded?: string): OrderSummaryItem[] {
  if (!encoded || typeof window === "undefined") return [];
  try {
    const json = decodeURIComponent(escape(window.atob(decodeURIComponent(encoded))));
    const parsed = JSON.parse(json);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (i) =>
        i &&
        typeof i.productName === "string" &&
        typeof i.quantity === "number" &&
        typeof i.price === "number"
    );
  } catch {
    return [];
  }
}

export function ThankYouOrderSummary({ orderNumber, total, encodedItems }: ThankYouOrderSummaryProps) {
  const [summary, setSummary] = useState<StoredOrderSummary | null>(null);
  const [urlItems, setUrlItems] = useState<OrderSummaryItem[]>([]);
  const hasTotal = Number.isFinite(total) && Number(total) > 0;

  const storageItems =
    summary && (!orderNumber || !summary.orderNumber || summary.orderNumber === orderNumber)
      ? summary.items
      : [];
  const items = urlItems.length > 0 ? urlItems : storageItems;

  useEffect(() => {
    setUrlItems(decodeItems(encodedItems));
  }, [encodedItems]);

  useEffect(() => {
    try {
      const raw = window.sessionStorage.getItem(ORDER_SUMMARY_STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as StoredOrderSummary;
      setSummary(parsed);
    } catch {
      setSummary(null);
    }
  }, []);

  return (
    <div className="bg-white border border-gray-100 rounded-3xl p-6 text-right mb-8 shadow-soft">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-11 h-11 rounded-2xl bg-green-50 flex items-center justify-center">
          <Banknote className="w-6 h-6 text-green-600" />
        </div>
        <div>
          <h2 className="font-extrabold text-brand-charcoal text-xl">ملخص الطلب والدفع</h2>
          <p className="text-sm text-brand-gray">راجعي المنتجات والمبلغ قبل مكالمة التأكيد.</p>
        </div>
      </div>

      {items.length > 0 && (
        <div className="mb-5 rounded-2xl bg-gray-50 border border-gray-100 p-4">
          <div className="flex items-center gap-2 mb-3">
            <PackageCheck className="w-5 h-5 text-brand-teal" />
            <h3 className="font-extrabold text-brand-charcoal">المنتجات المطلوبة</h3>
          </div>
          <div className="space-y-3">
            {items.map((item) => (
              <div key={`${item.productId}-${item.productName}`} className="flex justify-between gap-4 text-sm">
                <div>
                  <p className="font-bold text-brand-charcoal">{item.productName}</p>
                  <p className="text-xs text-brand-gray">الكمية: {item.quantity}</p>
                </div>
                <span className="font-extrabold text-brand-teal whitespace-nowrap">{formatSARCompact(item.price)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-3">
        <div className="flex justify-between gap-4 border-b border-gray-100 pb-3">
          <span className="text-sm font-bold text-brand-gray">طريقة الدفع</span>
          <span className="font-extrabold text-brand-charcoal">الدفع عند الاستلام</span>
        </div>
        {hasTotal && (
          <div className="flex justify-between gap-4 border-b border-gray-100 pb-3">
            <span className="text-sm font-bold text-brand-gray">المبلغ المطلوب عند الاستلام</span>
            <span className="font-extrabold text-brand-teal">{formatSARCompact(Number(total))}</span>
          </div>
        )}
        <div className="flex justify-between gap-4">
          <span className="text-sm font-bold text-brand-gray">متى تدفعين؟</span>
          <span className="font-extrabold text-brand-charcoal">بعد تأكيد الطلب ووصول الشحنة</span>
        </div>
      </div>
    </div>
  );
}
