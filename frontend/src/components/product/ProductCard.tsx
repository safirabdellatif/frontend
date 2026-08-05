import Link from "next/link";
import { Star, ShieldCheck, Truck } from "lucide-react";
import type { Product } from "@/content/products";
import { ImagePlaceholder } from "./ImagePlaceholder";
import { formatSARCompact } from "@/lib/money";

interface ProductCardProps {
  product: Product;
  showCTA?: boolean;
}

export function ProductCard({ product, showCTA = true }: ProductCardProps) {
  const defaultOffer = product.offers.find((o) => o.defaultSelected) ?? product.offers[0];

  return (
    <div className="bg-white rounded-3xl overflow-hidden shadow-card hover:shadow-lg transition-all transform hover:-translate-y-1 duration-300 flex flex-col relative group">
      {/* Warranty Badge */}
      <div className="absolute top-3 right-3 z-10 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-sm flex items-center gap-1.5 border border-brand-gold/20">
        <ShieldCheck className="w-4 h-4 text-brand-gold" />
        <span className="font-bold text-xs text-brand-charcoal">ضمان 30 يوم</span>
      </div>

      {(product.cardImage ?? product.mainImage) ? (
        <div className="flex h-72 items-center justify-center overflow-hidden bg-gradient-to-b from-brand-sand/40 to-white p-2 md:h-[22rem] md:p-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={product.cardImage ?? product.mainImage}
            alt={product.imagePlaceholders[0]?.alt ?? product.nameAr}
            className="h-full w-full origin-center scale-[1.2] object-contain object-center transition-transform duration-300 group-hover:scale-[1.27]"
          />
        </div>
      ) : (
        <ImagePlaceholder
          label={product.imagePlaceholders[0]?.label ?? "صورة المنتج"}
          alt={product.imagePlaceholders[0]?.alt ?? product.nameAr}
          className="h-72 md:h-[22rem]"
        />
      )}
      <div className="p-6 flex flex-col flex-1">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((i) => (
              <Star key={i} className="w-4 h-4 fill-brand-gold text-brand-gold" />
            ))}
            <span className="text-xs font-bold text-brand-charcoal mr-1">+4.8</span>
          </div>
          <span className="text-[10px] font-bold text-green-700 bg-green-50 px-2 py-1 rounded-full border border-green-100">
            حلال
          </span>
        </div>

        <h3 className="font-bold text-xl text-brand-charcoal mb-2">{product.nameAr}</h3>
        <p className="text-sm text-brand-gray leading-relaxed mb-5 flex-1 line-clamp-2">
          {product.heroSubheading}
        </p>

        <div className="bg-gray-50 rounded-2xl p-4 mb-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold bg-brand-teal text-white px-2 py-1 rounded-full">
              {defaultOffer?.badge}
            </span>
            <span className="font-extrabold text-brand-teal text-xl">
              {formatSARCompact(defaultOffer?.price ?? 279)}
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs text-brand-gray font-medium">
            <Truck className="w-3.5 h-3.5 text-brand-teal" />
            <span>توصيل سريع (2-4 أيام)</span>
          </div>
        </div>

        {showCTA && (
          <Link
            href={`/products/${product.slug}`}
            className="btn-primary text-center text-base font-bold py-3.5 shadow-md hover:shadow-lg transition-all"
          >
            اكتشفي التفاصيل - دفع عند الاستلام
          </Link>
        )}
      </div>
    </div>
  );
}
