"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import type { ProductOffer } from "@/content/products";
import { formatSARCompact } from "@/lib/money";
import { cn } from "@/lib/utils";

interface OfferSelectorProps {
  offers: ProductOffer[];
  onOfferChange?: (offer: ProductOffer) => void;
}

export function OfferSelector({ offers, onOfferChange }: OfferSelectorProps) {
  const defaultOffer = offers.find((o) => o.defaultSelected) ?? offers[1] ?? offers[0];
  const [selected, setSelected] = useState<ProductOffer>(defaultOffer);

  const handleSelect = (offer: ProductOffer) => {
    setSelected(offer);
    onOfferChange?.(offer);
  };

  return (
    <div className="flex flex-col gap-3">
      {offers.map((offer) => {
        const isSelected = selected.quantity === offer.quantity;
        const originalPrice = offer.quantity * 199;
        const saving = originalPrice - offer.price;

        return (
          <motion.button
            key={offer.quantity}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleSelect(offer)}
            className={cn(
              "relative flex items-center justify-between rounded-2xl border-2 px-5 py-4 text-right transition-all duration-200 cursor-pointer",
              isSelected
                ? "border-brand-teal bg-brand-mint shadow-soft"
                : "border-gray-200 bg-white hover:border-brand-teal/50"
            )}
          >
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  "w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors",
                  isSelected ? "border-brand-teal bg-brand-teal" : "border-gray-300"
                )}
              >
                {isSelected && <Check className="w-3 h-3 text-white" />}
              </div>
              <div>
                <div className="font-semibold text-brand-charcoal">{offer.label}</div>
                {saving > 0 && (
                  <div className="text-xs text-brand-success mt-0.5">
                    وفري {saving} ريال مقارنة بالسعر المفرد
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-col items-start gap-1">
              {offer.badge && (
                <span
                  className={cn(
                    "text-xs font-semibold px-2 py-0.5 rounded-full",
                    offer.badge === "الأكثر اختيارًا"
                      ? "bg-brand-teal text-white"
                      : offer.badge === "أفضل قيمة"
                      ? "bg-brand-gold text-white"
                      : "bg-gray-100 text-brand-gray"
                  )}
                >
                  {offer.badge}
                </span>
              )}
              <div className="flex items-center gap-2">
                {saving > 0 && (
                  <span className="text-xs text-brand-gray line-through">
                    {originalPrice} ريال
                  </span>
                )}
                <span className="font-bold text-brand-teal text-lg">
                  {formatSARCompact(offer.price)}
                </span>
              </div>
            </div>
          </motion.button>
        );
      })}
    </div>
  );
}
