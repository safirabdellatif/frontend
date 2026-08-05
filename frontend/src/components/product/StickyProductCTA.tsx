"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag } from "lucide-react";
import { formatSARCompact } from "@/lib/money";
import type { ProductOffer } from "@/content/products";

interface StickyProductCTAProps {
  productName: string;
  selectedOffer: ProductOffer;
  onAddToCart: () => void;
  visible?: boolean;
}

export function StickyProductCTA({
  productName,
  selectedOffer,
  onAddToCart,
  visible = true,
}: StickyProductCTAProps) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", damping: 25 }}
          className="fixed bottom-0 inset-x-0 md:hidden z-30 px-4 pb-4 pt-2 bg-brand-cream/95 backdrop-blur border-t border-brand-mint shadow-modal"
        >
          <button
            onClick={onAddToCart}
            className="w-full btn-primary flex items-center justify-center gap-3 py-4 text-base"
          >
            <ShoppingBag className="w-5 h-5" />
            <span>أضيفي العرض للسلة</span>
            <span className="font-bold">{formatSARCompact(selectedOffer.price)}</span>
          </button>
          <p className="text-xs text-center text-brand-gray mt-2">
            الدفع عند الاستلام وتأكيد قبل الشحن
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
