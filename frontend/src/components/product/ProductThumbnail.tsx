"use client";

import { useState } from "react";
import type { ProductId } from "@/content/products";
import { PRODUCTS } from "@/content/products";
import { ImagePlaceholder } from "./ImagePlaceholder";
import { cn } from "@/lib/utils";

interface ProductThumbnailProps {
  productId: ProductId;
  className?: string;
  imageClassName?: string;
}

export function ProductThumbnail({
  productId,
  className,
  imageClassName,
}: ProductThumbnailProps) {
  const [failed, setFailed] = useState(false);
  const product = PRODUCTS[productId];

  if (!product) return null;

  const alt = product.imagePlaceholders[0]?.alt ?? product.nameAr;
  const label = product.imagePlaceholders[0]?.label ?? product.shortNameAr;

  if (!product.mainImage || failed) {
    return (
      <ImagePlaceholder
        label={product.shortNameAr}
        alt={alt}
        className={className}
        showBrand={false}
      />
    );
  }

  return (
    <div
      className={cn(
        "flex-shrink-0 overflow-hidden rounded-xl bg-gradient-to-b from-brand-sand/40 to-white",
        className
      )}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={product.mainImage}
        alt={alt}
        onError={() => setFailed(true)}
        className={cn("h-full w-full object-contain object-center p-1", imageClassName)}
      />
    </div>
  );
}
