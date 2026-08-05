"use client";

import useEmblaCarousel from "embla-carousel-react";
import { Star } from "lucide-react";
import type { Review } from "@/content/reviews";

interface SocialProofCarouselProps {
  reviews: Review[];
}

export function SocialProofCarousel({ reviews }: SocialProofCarouselProps) {
  const [emblaRef] = useEmblaCarousel({ loop: true });

  return (
    <div className="overflow-hidden" ref={emblaRef}>
      <div className="flex gap-4 rtl:flex-row-reverse">
        {reviews.map((review) => (
          <div
            key={review.id}
            className="flex-none w-72 md:w-80 bg-white rounded-3xl shadow-soft p-6 flex flex-col gap-3"
          >
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${i <= review.rating ? "fill-brand-gold text-brand-gold" : "text-gray-200"}`}
                />
              ))}
            </div>
            <p className="text-sm text-brand-charcoal leading-relaxed">{review.text}</p>
            <p className="text-xs text-brand-gray font-medium">{review.author}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
