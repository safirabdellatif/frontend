import type { Metadata } from "next";
import { ShieldCheck, Truck, PhoneCall } from "lucide-react";
import Link from "next/link";
import { ThankYouOrderSummary } from "@/components/checkout/ThankYouOrderSummary";

export const metadata: Metadata = {
  title: "تم استلام طلبك",
  description: "تم تأكيد طلبك في سَنَدي. سنتواصل معك قريبًا.",
};

export default function ThankYouPage({
  searchParams,
}: {
  searchParams: { order?: string; upsell?: string; total?: string; items?: string };
}) {
  const orderNumber = searchParams.order;
  const upsellAccepted = searchParams.upsell === "accepted";
  const total = Number(searchParams.total);
  const encodedItems = searchParams.items;

  return (
    <div className="section-padding">
      <div className="container-max max-w-xl mx-auto text-center">
        {/* Success icon */}
        <div className="w-24 h-24 rounded-full bg-brand-teal/10 flex items-center justify-center mx-auto mb-6 shadow-inner">
          <ShieldCheck className="w-12 h-12 text-brand-teal" />
        </div>

        <h1 className="text-3xl font-extrabold text-brand-charcoal mb-4">اختيار موفق.. استلمنا طلبك! 🎉</h1>
        <p className="text-lg text-brand-gray mb-6">خطوتك الأولى نحو إطلالة تليق بكِ قد بدأت.</p>
        
        {orderNumber && (
          <div className="bg-white border-2 border-brand-mint rounded-2xl p-4 mb-6 inline-block mx-auto shadow-sm">
            <span className="text-brand-gray text-sm block mb-1">رقم الطلب الخاص بك</span>
            <span className="text-brand-teal font-bold text-xl">{orderNumber}</span>
          </div>
        )}
        
        {upsellAccepted && (
          <p className="text-brand-gold font-bold mb-6 bg-brand-gold/10 inline-block px-4 py-2 rounded-full">
            ✨ تمت إضافة العرض الإضافي بنجاح
          </p>
        )}

        <ThankYouOrderSummary orderNumber={orderNumber} total={total} encodedItems={encodedItems} />

        {/* Next steps */}
        <div className="bg-brand-mint/40 rounded-3xl p-8 text-right mb-8 border border-brand-mint">
          <h2 className="font-extrabold text-brand-charcoal mb-6 text-center text-xl">وش بيصير الحين؟</h2>
          <div className="space-y-6">
            {[
              { icon: PhoneCall, title: "مكالمة التأكيد", text: "بنتواصل معك قريبًا لتأكيد طلبك وتفاصيل عنوانك." },
              { icon: ShieldCheck, title: "خلي جوالك قريب", text: "بدون تأكيدك ما راح نقدر نشحن الطلب، تأكدي إن الرقم متاح." },
              { icon: Truck, title: "توصيل سريع", text: "بمجرد التأكيد، بنشحن طلبك ليوصلك خلال 2-4 أيام عمل. والدفع عند الاستلام!" },
            ].map(({ icon: Icon, title, text }, i) => (
              <div key={i} className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-2xl bg-brand-teal flex items-center justify-center flex-shrink-0 shadow-md">
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-brand-charcoal text-base mb-1">{title}</h3>
                  <p className="text-sm text-brand-gray leading-relaxed">{text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Trust badges */}
        <div className="flex flex-wrap justify-center gap-4 mb-10">
          {["الدفع عند الاستلام", "توصيل آمن داخل السعودية", "مكونات مرخصة"].map((badge) => (
            <span
              key={badge}
              className="flex items-center gap-1.5 text-sm font-bold text-brand-charcoal bg-white border border-gray-100 shadow-sm px-4 py-2.5 rounded-full"
            >
              <ShieldCheck className="w-4 h-4 text-brand-teal" />
              {badge}
            </span>
          ))}
        </div>

        <Link href="/products" className="btn-secondary px-10 py-4 text-lg font-bold shadow-soft hover:shadow-card transition-all">
          اكتشفي المزيد من العناية
        </Link>
      </div>
    </div>
  );
}
