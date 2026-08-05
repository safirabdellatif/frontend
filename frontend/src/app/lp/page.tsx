import type { Metadata } from "next";
import { LP_FAKE_ACTIVITY, LP_REVIEWS } from "@/content/lp-safe";
import { SocialProofCarousel } from "@/components/sections/SocialProofCarousel";
import { Star, Truck, ShieldCheck, Clock3 } from "lucide-react";

export const metadata: Metadata = {
  title: "تسوق بثقة",
  description:
    "متجر سعودي للتسوق أونلاين. دفع عند الاستلام، توصيل داخل المملكة، وخدمة عملاء جاهزة للمساعدة.",
  robots: { index: false, follow: false },
};

export default function LpPage() {
  return (
    <div className="bg-brand-cream">
      <section className="container-max py-16 md:py-24">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-brand-teal">
            mysanad.shop
          </p>
          <h1 className="mt-4 text-4xl md:text-5xl font-bold text-brand-charcoal leading-tight">
            تسوقي براحة… وادفعي عند الاستلام
          </h1>
          <p className="mt-5 text-lg text-brand-gray leading-relaxed">
            تجربة طلب بسيطة، توصيل داخل السعودية، ودعم بالعربية. مناسبة للزوار
            الجدد الذين يريدون التعرف على المتجر أولًا.
          </p>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {[
            { icon: Truck, title: "توصيل داخل المملكة", body: "شحن سريع لمعظم المدن." },
            { icon: ShieldCheck, title: "دفع عند الاستلام", body: "ادفعي عند استلام الطلب." },
            { icon: Clock3, title: "تأكيد سريع", body: "يتم تأكيد الطلب بعد الإرسال." },
          ].map(({ icon: Icon, title, body }) => (
            <div
              key={title}
              className="rounded-3xl bg-white p-6 shadow-soft border border-brand-mint/40"
            >
              <Icon className="h-6 w-6 text-brand-teal mb-3" />
              <h2 className="font-bold text-brand-charcoal">{title}</h2>
              <p className="mt-2 text-sm text-brand-gray">{body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container-max pb-8">
        <div className="rounded-[2rem] bg-white p-6 md:p-8 shadow-soft border border-brand-mint/40">
          <div className="flex items-center gap-2 mb-6">
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star key={i} className="h-4 w-4 fill-brand-gold text-brand-gold" />
              ))}
            </div>
            <span className="text-sm font-semibold text-brand-charcoal">4.8/5</span>
            <span className="text-sm text-brand-gray">· آراء عملاء</span>
          </div>
          <SocialProofCarousel reviews={LP_REVIEWS} />
        </div>
      </section>

      <section className="container-max pb-20">
        <div className="rounded-[2rem] border border-brand-mint/50 bg-white/70 p-6 md:p-8">
          <h2 className="text-xl font-bold text-brand-charcoal mb-4">نشاط حديث</h2>
          <div className="space-y-3">
            {LP_FAKE_ACTIVITY.map((item) => (
              <div
                key={`${item.name}-${item.city}`}
                className="flex items-center justify-between rounded-2xl bg-brand-cream px-4 py-3 text-sm"
              >
                <span className="font-medium text-brand-charcoal">
                  {item.name} — {item.city}
                </span>
                <span className="text-brand-gray">طلبت منذ {item.minutesAgo} دقيقة</span>
              </div>
            ))}
          </div>
          <p className="mt-4 text-xs text-brand-gray">
            عرض توضيحي للنشاط — لا يمثل طلبات حقيقية مباشرة.
          </p>
        </div>
      </section>
    </div>
  );
}
