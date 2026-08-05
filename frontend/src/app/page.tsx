import { HeroSection } from "@/components/sections/HeroSection";
import { TrustStrip } from "@/components/trust/TrustStrip";
import { ProductCard } from "@/components/product/ProductCard";
import { SocialProofCarousel } from "@/components/sections/SocialProofCarousel";
import { FAQAccordion } from "@/components/sections/FAQAccordion";
import { PRODUCT_LIST } from "@/content/products";
import { REVIEWS } from "@/content/reviews";
import { FAQS } from "@/content/faqs";
import Link from "next/link";
import { ShieldCheck, PackageCheck, Star, Truck, Heart, Award, CheckCircle2 } from "lucide-react";

export default function HomePage() {
  return (
    <>
      <TrustStrip />

      <HeroSection
        heading="عناية بمعايير صيدلية — لا وعود، نتائج"
        subheading="سَنَدي بيت عناية سعودي يختار لكِ تركيبات مدروسة بمعايير صيدلية: قطرات البيوتين والكولاجين للشعر، طقم تبييض الأسنان الاحترافي بضوء LED، وبودرة حليب الفراولة لنضارة وتفتيح البشرة. مرخّص، حلال، والدفع عند الاستلام."
        primaryCTA={{ label: "تصفّح التركيبات", href: "/products" }}
        secondaryCTA={{ label: "معاييرنا الصيدلية", href: "/about" }}
      />

      {/* Pain empathy - Emotional connection for KSA women */}
      <section className="section-padding bg-brand-charcoal text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-brand-teal via-transparent to-transparent"></div>
        <div className="container-max max-w-4xl mx-auto text-center relative z-10">
          <span className="text-brand-mint font-bold text-sm tracking-wider mb-4 block">الفلسفة</span>
          <h2 className="text-3xl md:text-5xl font-extrabold mb-6 leading-tight">
            منتجاتنا تدخل جسمكِ — لهذا نختارها بعقلية صيدلي، لا بعقلية تاجر
          </h2>
          <p className="text-gray-300 leading-relaxed text-lg md:text-xl mb-8">
            قطرات تشربينها، بودرة تذوب في حليبك، طقم يلامس أسنانك.. هذي ليست مستحضرات سطحية، بل تركيبات تستحق مراجعة دقيقة قبل أن تصل إليكِ.
            <br className="hidden md:block mt-2" />
            في <span className="text-brand-mint font-bold">سَنَدي</span> نختار كل تركيبة بعقلية صيدلية مرخّصة: مكوّنات مفصّحة، جرعات واضحة، مطابقة لمعايير هيئة الغذاء والدواء — بلا مبالغات.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <div className="bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full border border-white/20 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-brand-mint" />
              <span className="font-medium">مرخّص من SFDA</span>
            </div>
            <div className="bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full border border-white/20 flex items-center gap-2">
              <Heart className="w-5 h-5 text-brand-mint" />
              <span className="font-medium">حلال ومفصّح المكوّنات</span>
            </div>
            <div className="bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full border border-white/20 flex items-center gap-2">
              <Award className="w-5 h-5 text-brand-mint" />
              <span className="font-medium">ضمان صيدلية 30 يوم</span>
            </div>
          </div>
        </div>
      </section>

      {/* Science & Authority Section (SFDA) */}
      <section className="py-16 bg-brand-mint/30 border-b border-brand-mint/50">
        <div className="container-max">
          <div className="text-center mb-10">
            <span className="text-brand-teal font-bold text-sm tracking-wider mb-2 block">معاييرنا الصيدلية</span>
            <h2 className="text-3xl font-extrabold text-brand-charcoal">ثلاث معايير لا نتنازل عنها قبل أن نضيف أي تركيبة</h2>
          </div>
          <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-12 text-center">
            <div className="flex flex-col items-center gap-3 max-w-xs">
              <div className="w-20 h-20 rounded-full bg-white shadow-soft flex items-center justify-center">
                <ShieldCheck className="w-10 h-10 text-green-600" />
              </div>
              <h3 className="font-bold text-brand-charcoal text-xl">ترخيص SFDA</h3>
              <p className="text-sm text-brand-gray">جميع المكوّنات مفصّحة ومطابقة لمواصفات هيئة الغذاء والدواء السعودية — نفس المعايير التي تتبعها الصيدليات الموثوقة في المملكة.</p>
            </div>
            <div className="hidden md:block w-px h-24 bg-gray-200"></div>
            <div className="flex flex-col items-center gap-3 max-w-xs">
              <div className="w-20 h-20 rounded-full bg-white shadow-soft flex items-center justify-center">
                <Award className="w-10 h-10 text-brand-gold" />
              </div>
              <h3 className="font-bold text-brand-charcoal text-xl">ضمان صيدلية 30 يوم</h3>
              <p className="text-sm text-brand-gray">إذا لم تلاحظي الفرق خلال 30 يومًا، نسترجع طلبك بدون أسئلة — ثقة بمعايير الصيدليات.</p>
            </div>
            <div className="hidden md:block w-px h-24 bg-gray-200"></div>
            <div className="flex flex-col items-center gap-3 max-w-xs">
              <div className="w-20 h-20 rounded-full bg-white shadow-soft flex items-center justify-center">
                <CheckCircle2 className="w-10 h-10 text-brand-teal" />
              </div>
              <h3 className="font-bold text-brand-charcoal text-xl">جرعات مفصّحة</h3>
              <p className="text-sm text-brand-gray">نُعلن التركيز الفعلي لكل مادة فعّالة (مثلاً البيوتين 60,000 ميكروغرام/جرعة) — لأن الجرعة هي ما يصنع النتيجة، لا التغليف.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Product grid */}
      <section className="section-padding bg-gray-50">
        <div className="container-max">
          <div className="text-center mb-12">
            <span className="text-brand-teal font-bold text-sm tracking-wider mb-2 block">التركيبات</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-brand-charcoal mb-4">
              ثلاث تركيبات فقط — كل واحدة لمشكلة واحدة
            </h2>
            <p className="text-brand-gray text-lg max-w-2xl mx-auto">
              لا كتالوج طويل ولا منتجات حشو. كل تركيبة في سَنَدي مرّت بمراجعة دقيقة قبل أن تصل إليكِ: الشعر، الأسنان، وإشراقة البشرة.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {PRODUCT_LIST.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Why MySanad */}
      <section className="section-padding bg-brand-mint">
        <div className="container-max">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-extrabold text-brand-charcoal">ليش سَنَدي؟</h2>
            <p className="text-brand-gray text-lg mt-3">لأن منتجات العناية الحساسة تستحق معاملة صيدلية</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: Star, title: "تركيبات مفصّحة", body: "جرعات معلنة بالميكروغرام لكل مادة فعّالة — نفس شفافية النشرة الصيدلية" },
              { icon: ShieldCheck, title: "ضمان صيدلية 30 يوم", body: "لم تلاحظي فرقًا؟ نسترجع طلبك بدون أسئلة معقدة" },
              { icon: PackageCheck, title: "الدفع عند الاستلام", body: "مكالمة تأكيد قبل الشحن وتدفعين فقط عند الاستلام" },
              { icon: Truck, title: "توصيل داخل السعودية", body: "2-4 أيام لجميع مناطق المملكة بتعبئة صيدلية مغلقة" },
            ].map(({ icon: Icon, title, body }) => (
              <div key={title} className="text-center p-6 bg-white rounded-3xl shadow-soft hover:shadow-card transition-shadow">
                <div className="w-14 h-14 rounded-2xl bg-brand-mint flex items-center justify-center mx-auto mb-4">
                  <Icon className="w-7 h-7 text-brand-teal" />
                </div>
                <h3 className="font-bold text-brand-charcoal text-lg mb-2">{title}</h3>
                <p className="text-sm text-brand-gray leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bundle value */}
      <section className="section-padding bg-white">
        <div className="container-max max-w-4xl mx-auto text-center">
          <span className="text-brand-teal font-bold text-sm tracking-wider mb-2 block">باقات الاستمرار</span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-brand-charcoal mb-4">
            النتائج تظهر مع الانتظام — لذا صمّمنا الباقات لتدوم
          </h2>
          <p className="text-brand-gray text-lg mb-10 max-w-2xl mx-auto">
            معظم التركيبات النشطة تحتاج 30 إلى 90 يومًا من الاستخدام المنتظم. اختاري الباقة التي تكفي لكورس كامل.
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { label: "قطعة واحدة", price: 199, badge: "للتجربة", saving: null, popular: true },
              { label: "قطعتان", price: 279, badge: "الأكثر طلبًا", saving: 119, popular: false },
              { label: "3 قطع", price: 349, badge: "أفضل قيمة", saving: 248, popular: false },
            ].map(({ label, price, badge, saving, popular }) => (
              <div key={label} className={`bg-white rounded-3xl p-6 shadow-soft text-center border-2 transition-transform transform hover:-translate-y-1 ${popular ? 'border-brand-teal shadow-xl scale-105' : 'border-gray-100'}`}>
                <p className={`text-sm font-bold mb-2 inline-block px-3 py-1 rounded-full ${popular ? 'bg-brand-teal text-white' : 'bg-brand-mint text-brand-teal'}`}>{badge}</p>
                <p className="font-bold text-brand-charcoal text-lg mb-2">{label}</p>
                <p className="text-3xl font-extrabold text-brand-teal mb-2">{price} <span className="text-sm">ريال</span></p>
                {saving && (
                  <p className="text-sm font-bold text-green-600 mt-2 bg-green-50 py-1 rounded-lg">وفّر {saving} ريال</p>
                )}
              </div>
            ))}
          </div>
          <Link href="/products" className="btn-primary inline-flex items-center justify-center gap-2 mt-12 px-12 py-5 text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all">
            اختر منتجك المناسب
          </Link>
        </div>
      </section>

      {/* Social proof */}
      <section className="section-padding bg-brand-sand overflow-hidden">
        <div className="container-max">
          <div className="text-center mb-10">
            <span className="text-brand-teal font-bold text-sm tracking-wider mb-2 block">من عميلاتنا</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-brand-charcoal mb-4">تجارب موثّقة من داخل المملكة</h2>
            <div className="flex items-center justify-center gap-1">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star key={i} className="w-6 h-6 fill-brand-gold text-brand-gold" />
              ))}
              <span className="mr-2 font-bold text-brand-charcoal text-lg">4.8/5</span>
            </div>
          </div>
          <SocialProofCarousel reviews={REVIEWS} />
        </div>
      </section>

      {/* FAQ */}
      <section className="section-padding bg-white">
        <div className="container-max max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-extrabold text-brand-charcoal mb-4">عندك استفسار؟</h2>
            <p className="text-brand-gray text-lg">أكثر الأسئلة اللي توصلنا من عملائنا</p>
          </div>
          <FAQAccordion faqs={FAQS.slice(0, 6)} />
        </div>
      </section>

      {/* Final CTA */}
      <section className="section-padding bg-brand-teal text-white text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="container-max relative z-10">
          <h2 className="text-3xl md:text-5xl font-extrabold mb-6">ابدئي روتينكِ بمعايير صيدلية</h2>
          <p className="text-brand-mint text-xl mb-10 max-w-2xl mx-auto">
            تركيبات مفصّحة، ترخيص SFDA، حلال، والدفع عند الاستلام. سَنَدي تختار لكِ كل تفصيلة قبل أن تصل إليكِ.
          </p>
          <Link
            href="/products"
            className="inline-flex items-center justify-center gap-2 bg-brand-gold text-brand-charcoal font-extrabold px-12 py-5 rounded-2xl hover:bg-yellow-400 transition-all shadow-xl transform hover:-translate-y-1 text-lg"
          >
            تصفّحي التركيبات — ضمان 30 يوم
          </Link>
        </div>
      </section>
    </>
  );
}
