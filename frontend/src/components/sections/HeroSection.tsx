"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ShieldCheck, Truck, BadgeCheck, Star, Award, HeartHandshake } from "lucide-react";
import { ImagePlaceholder } from "@/components/product/ImagePlaceholder";

interface HeroSectionProps {
  heading: string;
  subheading: string;
  primaryCTA?: { label: string; href: string };
  secondaryCTA?: { label: string; href: string };
  imagePlaceholderLabel?: string;
  heroImage?: string;
}

export function HeroSection({
  heading,
  subheading,
  primaryCTA = { label: "تسوّق منتجات العناية", href: "/products" },
  secondaryCTA = { label: "تعرّف على سَنَدي", href: "/about" },
  imagePlaceholderLabel = "مجموعة سَنَدي للعناية والثقة",
  heroImage = "/products/hero.png?v=20260611b",
}: HeroSectionProps) {
  return (
    <section className="relative section-padding overflow-hidden bg-gradient-to-b from-brand-sand/50 to-white">
      <div className="container-max">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Copy side (right in RTL) */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Micro trust */}
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <div className="flex items-center gap-1 text-brand-gold bg-brand-gold/10 px-3 py-1 rounded-full">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} className="w-4 h-4 fill-brand-gold" />
                ))}
                <span className="text-sm font-bold text-brand-charcoal mr-1">+4.8 تقييم في السعودية</span>
              </div>
              <span className="text-xs text-green-700 bg-green-100 px-3 py-1 rounded-full font-bold flex items-center gap-1 border border-green-200">
                <ShieldCheck className="w-4 h-4" /> حلال ومكوّنات واضحة
              </span>
            </div>

            <h1 className="text-4xl md:text-6xl font-extrabold text-brand-charcoal leading-tight mb-5">
              {heading}
            </h1>
            <p className="text-lg md:text-xl text-brand-gray leading-relaxed mb-8 font-medium">
              {subheading}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-10">
              <Link href={primaryCTA.href} className="btn-primary text-center text-lg py-4 px-8 shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all">
                {primaryCTA.label}
              </Link>
              <Link href={secondaryCTA.href} className="btn-secondary text-center text-lg py-4 px-8 hover:bg-brand-sand transition-colors">
                {secondaryCTA.label}
              </Link>
            </div>

            <div className="grid grid-cols-3 gap-4 bg-white p-4 rounded-2xl shadow-soft border border-gray-50">
              {[
                { icon: ShieldCheck, label: "الدفع عند الاستلام" },
                { icon: Truck, label: "توصيل سريع 2-4 أيام" },
                { icon: Award, label: "ضمان ذهبي 30 يوم" },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex flex-col items-center text-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-brand-mint flex items-center justify-center">
                    <Icon className="w-5 h-5 text-brand-teal" />
                  </div>
                  <span className="text-xs text-brand-charcoal font-bold">{label}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Image side (left in RTL) */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="relative"
          >
            {/* Floating Badge */}
            <div className="absolute -top-4 -right-4 z-10 bg-white p-3 rounded-2xl shadow-xl flex items-center gap-3 border border-gray-100 animate-bounce-slow">
              <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center">
                <HeartHandshake className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-brand-gray font-medium">مكوّنات</p>
                <p className="text-sm font-bold text-brand-charcoal">نشطة وحلال</p>
              </div>
            </div>

            {heroImage ? (
              <div className="relative aspect-square w-full overflow-hidden rounded-3xl bg-gradient-to-b from-[#F5F0E8] via-[#F2F5F0] to-[#E8F2EE] shadow-card">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={heroImage}
                  alt="مجموعة منتجات سَنَدي: قطرات البيوتين والكولاجين، حليب الجمال، وطقم تبييض الأسنان بضوء LED"
                  className="absolute inset-0 h-full w-full origin-center scale-[1.22] object-cover object-[50%_46%]"
                />
              </div>
            ) : (
              <ImagePlaceholder
                label={imagePlaceholderLabel}
                alt="سَنَدي - منتجات العناية والثقة"
                className="aspect-square w-full rounded-3xl shadow-card"
              />
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
