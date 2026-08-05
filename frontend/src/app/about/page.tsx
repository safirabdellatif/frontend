import type { Metadata } from "next";
import Link from "next/link";
import { ShieldCheck, PackageCheck, Truck, PhoneCall, FlaskConical, BadgeCheck } from "lucide-react";
import { SITE } from "@/content/site";

export const metadata: Metadata = {
  title: "معاييرنا الصيدلية | سَنَدي",
  description: "سَنَدي بيت عناية سعودي يطبّق معايير الصيدلية على اختيار التركيبات: ترخيص SFDA، حلال، جرعات مفصّحة، وضمان 30 يومًا.",
};

export default function AboutPage() {
  return (
    <div className="section-padding">
      <div className="container-max max-w-3xl mx-auto">
        <div className="text-center mb-16">
          <span className="inline-flex items-center gap-2 bg-brand-mint text-brand-teal font-semibold text-sm px-4 py-1.5 rounded-full mb-4">
            <FlaskConical className="w-4 h-4" />
            معاييرنا الصيدلية
          </span>
          <h1 className="text-3xl md:text-4xl font-bold text-brand-charcoal mb-4">
            عندما تدخل العناية جسمكِ، تستحق معاملة صيدلية
          </h1>
          <p className="text-brand-gray text-lg leading-relaxed">
            سَنَدي بيت عناية سعودي يختار تركيبات حساسة بعقلية الصيدلي، لا التاجر — قطرات، بودرة، وأطقم تلامس أجزاء حساسة من جسمكِ، فلا مكان للتجربة العشوائية.
          </p>
        </div>

        {/* Brand story */}
        <div className="bg-brand-mint rounded-3xl p-8 mb-12 border border-brand-teal/10">
          <h2 className="text-2xl font-bold text-brand-charcoal mb-4">لماذا أنشأنا سَنَدي</h2>
          <p className="text-brand-gray leading-loose text-base">
            لاحظنا أن السوق السعودي يغرق بمنتجات عناية تأتي من مصادر مجهولة، بجرعات غير مُفصّحة، ومسوّقة كأنها مكياج. لكن هذي التركيبات تُشرب أو تُمتص أو تلامس مناطق حساسة — والمستهلك السعودي يستحق مستوى الثقة الذي يحصل عليه من صيدليته المعتادة.
          </p>
          <p className="text-brand-gray leading-loose text-base mt-4">
            فبنينا سَنَدي بنفس منطق الصيدلية المرخّصة: قائمة قصيرة من التركيبات المختارة، جرعات معلنة، توافق مع هيئة الغذاء والدواء، وضمان واضح. لا كتالوج طويل، ولا مبالغات تسويقية.
          </p>
        </div>

        {/* Pharmacy Standards */}
        <h2 className="text-2xl font-bold text-brand-charcoal mb-6 text-center">معاييرنا قبل قبول أي تركيبة</h2>
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {[
            { icon: BadgeCheck, title: "ترخيص SFDA", body: "كل مكوّن مطابق لمواصفات هيئة الغذاء والدواء السعودية ومُفصّح بوضوح." },
            { icon: FlaskConical, title: "جرعات معلنة", body: "نُعلن التركيز الفعلي لكل مادة فعّالة — لا مكوّنات سرية ولا نسب غامضة." },
            { icon: ShieldCheck, title: "حلال موثّق", body: "خالية من المكوّنات غير الحلال أو المثيرة للشبهة. مناسبة للعائلة المسلمة." },
            { icon: PackageCheck, title: "تعبئة صيدلية", body: "تعبئة محكمة الإغلاق مع تاريخ صلاحية واضح، كما تجدينها على رف الصيدلية." },
            { icon: Truck, title: "شحن داخل المملكة", body: "توصيل 2-4 أيام بمكالمة تأكيد مسبقة، ودفع عند الاستلام بدون مفاجآت." },
            { icon: PhoneCall, title: "دعم سعودي مباشر", body: "فريق دعم سعودي بنفس لهجتكِ، يجاوب على أسئلتكِ قبل وبعد الطلب." },
          ].map(({ icon: Icon, title, body }) => (
            <div key={title} className="bg-white rounded-2xl p-6 shadow-soft flex gap-4 border border-gray-100">
              <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-brand-mint flex items-center justify-center">
                <Icon className="w-6 h-6 text-brand-teal" />
              </div>
              <div>
                <h3 className="font-bold text-brand-charcoal mb-1">{title}</h3>
                <p className="text-sm text-brand-gray leading-relaxed">{body}</p>
              </div>
            </div>
          ))}
        </div>

        {/* What we believe */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-brand-charcoal mb-6">ما نؤمن به</h2>
          <div className="space-y-4">
            {[
              "العناية الحقيقية تُقاس بالجرعة، لا بالتغليف.",
              "ثلاث تركيبات مدروسة تكفي — لا حاجة لكتالوج طويل لتغطية المبيعات.",
              "الشفافية أهم من الكلام التسويقي: نُعلن المكوّن والجرعة، ونحترم ذكاءكِ.",
              "السعر العادل هو ثمن الجودة الصيدلية، لا تكلفة الإعلانات.",
              "إذا لم نُجرّب التركيبة بأنفسنا، لا تصل إلى رفنا.",
            ].map((belief, i) => (
              <div key={i} className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-brand-teal flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-xs font-bold">{i + 1}</span>
                </span>
                <p className="text-brand-charcoal leading-relaxed">{belief}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Disclaimer */}
        <div className="bg-brand-sand rounded-2xl p-6 mb-12 border border-brand-gold/20">
          <p className="text-sm text-brand-gray leading-relaxed">
            <span className="font-bold text-brand-charcoal">تنويه صيدلي : </span>
            {SITE.globalDisclaimer}
          </p>
        </div>

        <div className="text-center">
          <Link href="/products" className="btn-primary px-12 py-4 text-base">
            تصفّح التركيبات المختارة
          </Link>
        </div>
      </div>
    </div>
  );
}
