import { Moon, Heart, Armchair, BadgeCheck } from "lucide-react";
import type { ProductFeature } from "@/content/products";

const ICON_MAP: Record<string, React.ElementType> = {
  moon: Moon,
  heart: Heart,
  armchair: Armchair,
  "badge-check": BadgeCheck,
};

interface ProductFeatureGridProps {
  features: ProductFeature[];
}

export function ProductFeatureGrid({ features }: ProductFeatureGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {features.map((feature, i) => {
        const Icon = ICON_MAP[feature.icon] ?? BadgeCheck;
        return (
          <div key={i} className="bg-white rounded-2xl p-5 shadow-soft flex gap-4">
            <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-brand-mint flex items-center justify-center">
              <Icon className="w-5 h-5 text-brand-teal" />
            </div>
            <div>
              <h4 className="font-semibold text-brand-charcoal text-sm mb-1">{feature.title}</h4>
              <p className="text-xs text-brand-gray leading-relaxed">{feature.body.replace(" TO_CONFIRM", "")}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
