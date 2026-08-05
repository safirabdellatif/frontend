"use client";

import { Plus } from "lucide-react";
import type { ProductId } from "@/content/products";
import { PRODUCTS, OFFERS } from "@/content/products";
import { useCartStore } from "@/stores/cart-store";
import { ProductThumbnail } from "@/components/product/ProductThumbnail";
import { formatSARCompact } from "@/lib/money";
import { generateEventId } from "@/lib/events";
import { trackAddToCart } from "@/lib/analytics";

interface CartCrossSellCardProps {
  productId: ProductId;
  reason: string;
}

export function CartCrossSellCard({ productId, reason }: CartCrossSellCardProps) {
  const { addItem, openCart } = useCartStore();
  const product = PRODUCTS[productId];
  if (!product) return null;

  const offer = OFFERS.find((o) => o.quantity === 1)!;

  const handleAdd = () => {
    const eventId = generateEventId("AddToCart");
    addItem({
      productId,
      productName: product.nameAr,
      quantity: 1,
      unitBundlePrice: offer.price,
      offerPrice: offer.price,
      offerLabel: offer.label,
      source: "cart_cross_sell",
    });
    trackAddToCart(productId, offer.price, eventId);
  };

  return (
    <div className="bg-brand-mint/50 rounded-2xl p-4 flex items-center gap-4">
      <ProductThumbnail productId={productId} className="w-16 h-16" />
      <div className="flex-1">
        <p className="font-semibold text-sm text-brand-charcoal">{product.shortNameAr}</p>
        <p className="text-xs text-brand-teal mt-0.5">{reason}</p>
        <p className="font-bold text-brand-teal mt-1">{formatSARCompact(offer.price)}</p>
      </div>
      <button
        onClick={handleAdd}
        aria-label={`أضيفي ${product.shortNameAr}`}
        className="flex-shrink-0 w-9 h-9 rounded-xl bg-brand-teal text-white flex items-center justify-center hover:bg-brand-dark transition-colors"
      >
        <Plus className="w-5 h-5" />
      </button>
    </div>
  );
}
