import { ShieldCheck, Truck, PhoneCall, BadgeCheck, Award } from "lucide-react";
import { SITE } from "@/content/site";
import { cn } from "@/lib/utils";

const ICONS = {
  "shield-check": ShieldCheck,
  truck: Truck,
  "phone-call": PhoneCall,
  "badge-check": BadgeCheck,
  award: Award,
} as const;

interface TrustStripProps {
  variant?: "light" | "dark";
}

export function TrustStrip({ variant = "light" }: TrustStripProps) {
  // Adding warranty to the badges if not present
  const badges = [
    { label: "ضمان صيدلية 30 يوم", icon: "award" as const },
    ...SITE.trustBadges,
  ];

  return (
    <div className={cn(
      "w-full overflow-x-auto border-b",
      variant === "dark" ? "bg-brand-teal text-white border-brand-teal" : "bg-brand-mint border-brand-mint/50"
    )}>
      <div className="container-max flex items-center justify-center gap-6 md:gap-12 py-3 flex-nowrap min-w-max md:min-w-0">
        {badges.map((badge) => {
          const Icon = ICONS[badge.icon as keyof typeof ICONS] ?? ShieldCheck;
          return (
            <div key={badge.label} className={cn(
              "flex items-center gap-2",
              variant === "dark" ? "text-white" : "text-brand-teal"
            )}>
              <Icon className="w-4 h-4 md:w-5 md:h-5 flex-shrink-0" />
              <span className="text-xs md:text-sm font-bold whitespace-nowrap">{badge.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
