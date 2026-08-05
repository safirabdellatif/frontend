"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Star, ShoppingBag, ShieldCheck, ChevronLeft, Award, CheckCircle2, HeartHandshake, Shield, Truck, Clock, Droplets, Coffee, Smile, CalendarDays } from "lucide-react";
import Link from "next/link";
import type { Product, ProductOffer } from "@/content/products";
import { PRODUCTS } from "@/content/products";
import { useCartStore } from "@/stores/cart-store";
import { OfferSelector } from "@/components/product/OfferSelector";
import { StickyProductCTA } from "@/components/product/StickyProductCTA";
import { ImagePlaceholder } from "@/components/product/ImagePlaceholder";
import { SocialProofCarousel } from "@/components/sections/SocialProofCarousel";
import { ComparisonCards } from "@/components/sections/ComparisonCards";
import { FAQAccordion } from "@/components/sections/FAQAccordion";
import { TrustStrip } from "@/components/trust/TrustStrip";
import { REVIEWS } from "@/content/reviews";
import { FAQS } from "@/content/faqs";
import { formatSARCompact } from "@/lib/money";
import { generateEventId } from "@/lib/events";
import { trackAddToCart, trackViewContent } from "@/lib/analytics";

interface ProductPageClientProps {
  product: Product;
}

const ACTIVE_INGREDIENTS_COPY: Record<string, string> = {
  biotin_collagen:
    "نستخدم البيوتين والكولاجين بتركيز 60,000 ميكروغرام لكل جرعة لدعم كثافة الشعر وتقليل التساقط بنتائج حقيقية.",
  teeth_whitening_kit:
    "نستخدم ضوء LED بارد احترافي مع جل تبييض مخصص بتركيز مدروس لنتائج ملحوظة وآمنة على الأسنان الحساسة.",
  beauty_milk:
    "نستخدم خلاصة الفراولة الطبيعية بتركيبة مدروسة لدعم نضارة وتفتيح البشرة من الداخل بنتائج حقيقية.",
};

interface UsageStep {
  icon: typeof Droplets;
  title: string;
  body: string;
}

interface UsageProtocol {
  dose: string;
  frequency: string;
  duration: string;
  steps: UsageStep[];
  tips: string[];
  warnings: string[];
}

const USAGE_PROTOCOL: Record<string, UsageProtocol> = {
  biotin_collagen: {
    dose: "1 مل (قطّارة كاملة)",
    frequency: "مرة واحدة يوميًا",
    duration: "30 إلى 90 يومًا للاستفادة الكاملة",
    steps: [
      {
        icon: Droplets,
        title: "املئي القطّارة بالكامل",
        body: "اضغطي على الجزء العلوي ثم اسحبيه ليمتلئ بـ 1 مل من القطرات بنكهة التوت.",
      },
      {
        icon: Coffee,
        title: "ضعيها مباشرة تحت اللسان",
        body: "أبقي القطرات تحت اللسان لمدة 30 ثانية قبل البلع، لتعزيز الامتصاص السريع.",
      },
      {
        icon: CalendarDays,
        title: "الاستمرار 30 يومًا على الأقل",
        body: "أفضل النتائج تظهر بين الأسبوع 6 و12 من الاستخدام اليومي المنتظم.",
      },
    ],
    tips: [
      "يُفضّل تناولها صباحًا قبل الفطور لامتصاص أعلى.",
      "احفظي العبوة في مكان جاف وبارد، بعيدًا عن أشعة الشمس المباشرة.",
      "التزمي بالجرعة اليومية — الانتظام أهم من زيادة الجرعة.",
    ],
    warnings: [
      "لا تتجاوزي الجرعة المُوصى بها (1 مل/يوم).",
      "للحوامل والمرضعات: يُفضَّل استشارة الصيدلي قبل البدء.",
      "إذا ظهرت حساسية أو طفح، أوقفي الاستخدام واستشيري المختص.",
    ],
  },
  teeth_whitening_kit: {
    dose: "3 إلى 5 قطرات من الجل على كل سن",
    frequency: "جلسة واحدة يوميًا (30 دقيقة)",
    duration: "7 إلى 14 يومًا لنتائج ملحوظة",
    steps: [
      {
        icon: Smile,
        title: "نظّفي أسنانك جيدًا",
        body: "اغسلي أسنانك بالفرشاة والمعجون قبل الاستخدام، وجفّفيها بمنشفة نظيفة.",
      },
      {
        icon: Droplets,
        title: "ضعي الجل داخل قالب LED",
        body: "وزّعي 3–5 قطرات من جل التبييض على القالب الداخلي، ثم ضعيه على أسنانك.",
      },
      {
        icon: Clock,
        title: "شغّلي ضوء LED لمدة 30 دقيقة",
        body: "اضغطي زر التشغيل واتركي الضوء يعمل لـ 30 دقيقة، ثم أزيلي القالب واشطفي فمك بالماء.",
      },
    ],
    tips: [
      "للحصول على أفضل نتيجة: استخدميه يوميًا لمدة 7–14 يومًا، ثم جلسة صيانة أسبوعية.",
      "تجنّبي تناول القهوة أو الشاي أو الأطعمة الملوّنة خلال الساعتين التاليتين.",
      "اشحني الجهاز بالكامل قبل أول استخدام لضمان كفاءة الضوء.",
    ],
    warnings: [
      "غير مناسب لمن يعاني من تسوّس نشط أو مشاكل لثوية حادة — راجعي طبيب الأسنان أولاً.",
      "إذا شعرتِ بحساسية مفرطة، خفّفي الجلسات إلى مرة كل يومين.",
      "غير موصى به للحوامل والأطفال دون 16 سنة.",
    ],
  },
  beauty_milk: {
    dose: "كيس واحد (5–7 جم)",
    frequency: "مرة واحدة يوميًا",
    duration: "30 إلى 60 يومًا لاستفادة ملحوظة",
    steps: [
      {
        icon: Droplets,
        title: "افتحي كيس البودرة",
        body: "خذي كيسًا واحدًا من العبوة، قصّيه من الزاوية وأفرغيه في كوب فارغ.",
      },
      {
        icon: Coffee,
        title: "أضيفي 150 مل ماء بارد أو حليب",
        body: "حرّكي البودرة في 150–200 مل من الماء البارد أو الحليب حتى تذوب تمامًا (10 ثوانٍ تقريبًا).",
      },
      {
        icon: CalendarDays,
        title: "اشربيه يوميًا بانتظام",
        body: "يُفضَّل تناوله في الصباح أو بعد الإفطار. النتائج تظهر مع الاستمرار 30–60 يومًا.",
      },
    ],
    tips: [
      "استخدمي ماءً باردًا (لا ساخنًا) للحفاظ على فعالية المكوّنات النشطة.",
      "يمكن خلطه مع الحليب البارد للحصول على طعم أكثر كثافة وفائدة مضاعفة.",
      "احفظي الأكياس في مكان جاف بعيدًا عن الرطوبة المباشرة.",
    ],
    warnings: [
      "كيس واحد فقط يوميًا — لا تضاعفي الجرعة.",
      "للحوامل والمرضعات: استشيري الصيدلي قبل البدء.",
      "أوقفي الاستخدام عند ظهور أي حساسية واستشيري المختص.",
    ],
  },
};

export function ProductPageClient({ product }: ProductPageClientProps) {
  const { addItem, openCart } = useCartStore();
  const defaultOffer = product.offers.find((o) => o.defaultSelected) ?? product.offers[0];
  const [selectedOffer, setSelectedOffer] = useState<ProductOffer>(defaultOffer);
  const [showSticky, setShowSticky] = useState(false);
  const [activeImage, setActiveImage] = useState(product.mainImage ?? "");

  useEffect(() => {
    trackViewContent(product.id, selectedOffer.price);
    const handleScroll = () => setShowSticky(window.scrollY > 400);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [product.id]);

  const handleAddToCart = () => {
    const eventId = generateEventId("AddToCart");
    addItem({
      productId: product.id,
      productName: product.nameAr,
      quantity: selectedOffer.quantity,
      unitBundlePrice: selectedOffer.price,
      offerPrice: selectedOffer.price,
      offerLabel: selectedOffer.label,
      source: "product_page",
    });
    trackAddToCart(product.id, selectedOffer.price, eventId);
    openCart();
  };

  const productReviews = REVIEWS.filter(
    (r) => !r.productId || r.productId === product.id
  );

  return (
    <>
      <TrustStrip />

      {/* Breadcrumb */}
      <div className="container-max py-3">
        <nav className="flex items-center gap-2 text-xs text-brand-gray">
          <Link href="/" className="hover:text-brand-teal">الرئيسية</Link>
          <ChevronLeft className="w-3 h-3" />
          <Link href="/products" className="hover:text-brand-teal">المنتجات</Link>
          <ChevronLeft className="w-3 h-3" />
          <span className="text-brand-charcoal">{product.shortNameAr}</span>
        </nav>
      </div>

      {/* Hero Section */}
      <section className="section-padding pt-4">
        <div className="container-max">
          <div className="grid md:grid-cols-2 gap-12 items-start">
            {/* Copy */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="order-2 md:order-1"
            >
              {/* Trust Badge */}
              <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-3 py-1.5 rounded-full text-xs font-bold mb-4 border border-green-200">
                <ShieldCheck className="w-4 h-4" />
                <span>حلال • مكوّنات نشطة واضحة</span>
              </div>

              {/* Stars */}
              <div className="flex items-center gap-2 mb-3">
                <div className="flex items-center gap-0.5">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} className="w-5 h-5 fill-brand-gold text-brand-gold" />
                  ))}
                </div>
                <span className="text-sm font-semibold text-brand-charcoal">+4.8 من مئات العملاء في السعودية</span>
              </div>

              <h1 className="text-3xl md:text-5xl font-extrabold text-brand-charcoal mb-4 leading-tight">
                {product.heroHeadline}
              </h1>
              <p className="text-brand-charcoal font-bold text-xl mb-3">{product.nameAr}</p>
              <p className="text-brand-gray text-lg leading-relaxed mb-6">{product.heroSubheading}</p>

              {/* Benefits with high conversion icons */}
              <ul className="space-y-3 mb-8">
                {product.benefits.slice(0, 4).map((b, i) => (
                  <li key={i} className="flex items-center gap-3 text-base font-medium text-brand-charcoal">
                    <span className="w-6 h-6 rounded-full bg-brand-teal/10 flex items-center justify-center flex-shrink-0">
                      <CheckCircle2 className="w-4 h-4 text-brand-teal" />
                    </span>
                    {b}
                  </li>
                ))}
              </ul>

              {/* Offer Selector */}
              <div className="mb-6 bg-brand-sand/30 p-5 rounded-2xl border border-brand-sand">
                <p className="text-base font-bold text-brand-charcoal mb-4">اختر العرض المناسب لك:</p>
                <OfferSelector
                  offers={product.offers}
                  onOfferChange={setSelectedOffer}
                />
              </div>

              {/* CTA */}
              <button
                onClick={handleAddToCart}
                className="btn-primary w-full py-4 text-lg flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1"
              >
                <ShoppingBag className="w-6 h-6" />
                اطلب الآن — ثقة تبدأ من إطلالتك
                <span className="font-extrabold bg-white/20 px-2 py-1 rounded-lg">{formatSARCompact(selectedOffer.price)}</span>
              </button>
              
              {/* Trust Under CTA */}
              <div className="grid grid-cols-2 gap-2 mt-4">
                <div className="flex items-center justify-center gap-1.5 text-xs font-medium text-brand-gray bg-gray-50 py-2 rounded-lg">
                  <Truck className="w-4 h-4 text-brand-teal" />
                  توصيل سريع (2-4 أيام)
                </div>
                <div className="flex items-center justify-center gap-1.5 text-xs font-medium text-brand-gray bg-gray-50 py-2 rounded-lg">
                  <Shield className="w-4 h-4 text-brand-teal" />
                  ضمان ذهبي 30 يوم
                </div>
              </div>
            </motion.div>

            {/* Images */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="order-1 md:order-2 relative"
            >
              {/* Warranty Badge Overlay */}
              <div className="absolute top-4 right-4 z-10 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg flex items-center gap-2 border border-brand-gold/20">
                <Award className="w-5 h-5 text-brand-gold" />
                <span className="font-bold text-sm text-brand-charcoal">ضمان 30 يوم</span>
              </div>
              
              {activeImage ? (
                <div className="relative h-80 md:h-[500px] rounded-3xl mb-4 shadow-card bg-gradient-to-b from-brand-sand/30 to-white overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={activeImage}
                    alt={product.imagePlaceholders[0]?.alt ?? product.nameAr}
                    className="h-full w-full object-contain object-center p-2"
                  />
                </div>
              ) : (
                <ImagePlaceholder
                  label={product.imagePlaceholders[0]?.label ?? "صورة المنتج"}
                  alt={product.imagePlaceholders[0]?.alt ?? product.nameAr}
                  className="h-80 md:h-[500px] rounded-3xl mb-4 shadow-card"
                />
              )}
              <div className="grid grid-cols-3 gap-3">
                {(product.galleryImages?.length
                  ? [{ src: product.mainImage ?? "", alt: product.imagePlaceholders[0]?.alt ?? product.nameAr }, ...product.galleryImages]
                  : []
                ).map((img, i) =>
                  img.src ? (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setActiveImage(img.src)}
                      className={`h-28 rounded-2xl overflow-hidden shadow-soft transition-all ${
                        activeImage === img.src ? "ring-2 ring-brand-teal" : "hover:opacity-90"
                      }`}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={img.src} alt={img.alt} className="h-full w-full object-cover object-center" />
                    </button>
                  ) : null
                )}
                {!product.galleryImages?.length &&
                  product.imagePlaceholders.slice(1, 4).map((img, i) => (
                    <ImagePlaceholder
                      key={i}
                      label={img.label}
                      alt={img.alt}
                      className="h-28 rounded-2xl hover:opacity-90 transition-opacity cursor-pointer shadow-soft"
                      showBrand={false}
                    />
                  ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Authority & Science Proof Section */}
      <section className="py-16 bg-brand-mint/30 border-y border-brand-mint/50">
        <div className="container-max">
          <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-12 text-center">
            <div className="flex flex-col items-center gap-3 max-w-xs">
              <div className="w-20 h-20 rounded-full bg-white shadow-soft flex items-center justify-center">
                <ShieldCheck className="w-10 h-10 text-green-600" />
              </div>
              <h3 className="font-bold text-brand-charcoal text-xl">مكوّنات مرخصة</h3>
              <p className="text-sm text-brand-gray">جميع مكوناتنا مصرحة ومطابقة لمواصفات هيئة الغذاء والدواء (SFDA) لضمان أمانك التام.</p>
            </div>
            <div className="hidden md:block w-px h-24 bg-gray-200"></div>
            <div className="flex flex-col items-center gap-3 max-w-xs">
              <div className="w-20 h-20 rounded-full bg-white shadow-soft flex items-center justify-center">
                <HeartHandshake className="w-10 h-10 text-blue-600" />
              </div>
              <h3 className="font-bold text-brand-charcoal text-xl">تركيبات نشطة فعّالة</h3>
              <p className="text-sm text-brand-gray">{ACTIVE_INGREDIENTS_COPY[product.id]}</p>
            </div>
            <div className="hidden md:block w-px h-24 bg-gray-200"></div>
            <div className="flex flex-col items-center gap-3 max-w-xs">
              <div className="w-20 h-20 rounded-full bg-white shadow-soft flex items-center justify-center">
                <Award className="w-10 h-10 text-brand-gold" />
              </div>
              <h3 className="font-bold text-brand-charcoal text-xl">ضمان ذهبي 30 يوم</h3>
              <p className="text-sm text-brand-gray">استرجاع سهل وبدون تعقيد لأن ثقتنا في منتجاتنا مطلقة.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pain section - Emotional Connection */}
      <section className="section-padding bg-brand-charcoal text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-brand-teal via-transparent to-transparent"></div>
        <div className="container-max max-w-5xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <span className="text-brand-mint font-bold text-sm tracking-wider mb-2 block">نعرف شعوركِ تمامًا</span>
            <h2 className="text-3xl md:text-5xl font-extrabold mb-6">
              تفاصيل صغيرة.. تأخذ الكثير من تفكيركِ وثقتكِ
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              ندرك أن مظهركِ هو جزء من حضوركِ القوي في كل مناسبة وصورة. الإحباط من الحلول المؤقتة والمنتجات التي لا تفيد انتهى. سَنَدي هنا ليقدم لكِ العناية التي تستحقينها.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {product.painAngles.map((pain, i) => (
              <div key={i} className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 hover:border-brand-mint/50 transition-colors flex flex-col items-center text-center transform hover:-translate-y-1">
                <div className="w-16 h-16 rounded-full bg-brand-teal/30 flex items-center justify-center mb-6">
                  <span className="text-3xl">💭</span>
                </div>
                <p className="text-white font-medium text-lg leading-relaxed">"{pain}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Alternating Features Section */}
      <section className="section-padding bg-white">
        <div className="container-max">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-brand-charcoal mb-4">
              الحل اللي صممناه خصيصًا لإطلالتك
            </h2>
            <p className="text-brand-gray text-lg max-w-2xl mx-auto">
              كل تفصيلة في سَنَدي مدروسة بعناية لتمنحك نتيجة تجميلية واضحة مع الاستمرار.
            </p>
          </div>

          <div className="space-y-20">
            {product.features.map((feature, index) => {
              const isEven = index % 2 === 0;
              return (
                <div key={index} className={`flex flex-col ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'} gap-10 items-center`}>
                  <div className="w-full md:w-1/2">
                    {product.featureImages?.[index] ? (
                      <div className="h-80 md:h-[400px] rounded-3xl shadow-card w-full overflow-hidden bg-gradient-to-b from-brand-sand/30 to-white">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={product.featureImages[index]}
                          alt={feature.title}
                          className="h-full w-full object-cover object-center"
                        />
                      </div>
                    ) : (
                      <ImagePlaceholder
                        label={`ميزة: ${feature.title}`}
                        alt={feature.title}
                        className="h-80 md:h-[400px] rounded-3xl shadow-card w-full"
                      />
                    )}
                  </div>
                  <div className="w-full md:w-1/2 space-y-4">
                    <div className="w-12 h-12 rounded-2xl bg-brand-teal/10 flex items-center justify-center text-brand-teal mb-2">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <h3 className="text-2xl md:text-3xl font-bold text-brand-charcoal">
                      {feature.title}
                    </h3>
                    <p className="text-lg text-brand-gray leading-relaxed">
                      {feature.body}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Ingredients / Materials Section */}
      <section className="section-padding bg-brand-charcoal text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-brand-teal via-transparent to-transparent"></div>
        <div className="container-max max-w-5xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <span className="text-brand-mint font-bold text-sm tracking-wider mb-2 block">السر في التركيبة</span>
            <h2 className="text-3xl md:text-5xl font-extrabold mb-6">
              مكوّنات نشطة.. نتائج تلاحظينها
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              لا نعتمد على الوعود الفارغة. كل قطرة وكل مسحة تحتوي على تركيبة دقيقة ومصرحة من هيئة الغذاء والدواء، صُممت خصيصًا لتمنحكِ نتيجة فعلية ترافقكِ كل يوم.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {product.materials.map((mat, i) => (
              <div key={i} className="bg-white/5 backdrop-blur-lg rounded-3xl p-8 border border-white/10 hover:border-brand-mint/40 transition-colors shadow-2xl transform hover:-translate-y-1">
                <div className="w-16 h-16 rounded-full bg-brand-teal flex items-center justify-center mb-6 shadow-lg">
                  <ShieldCheck className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-extrabold text-2xl mb-4 text-brand-mint">{mat.title}</h3>
                {mat.status === "TO_CONFIRM" ? (
                  <p className="text-gray-300 text-base leading-relaxed font-medium">
                    مكوّن نشط فعّال ضمن تركيبة واضحة وآمنة للاستخدام اليومي المستمر.
                  </p>
                ) : (
                  <p className="text-gray-300 text-base leading-relaxed font-medium">{mat.body}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How to use — pharmacist-style protocol */}
      {USAGE_PROTOCOL[product.id] && (
        <section className="section-padding bg-white">
          <div className="container-max max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <span className="inline-flex items-center gap-2 bg-brand-mint text-brand-teal font-semibold text-sm px-4 py-1.5 rounded-full mb-4">
                <ShieldCheck className="w-4 h-4" />
                نشرة الاستخدام
              </span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-brand-charcoal mb-4">
                كيفية الاستخدام — بمعايير صيدلية
              </h2>
              <p className="text-brand-gray text-lg max-w-2xl mx-auto">
                التزمي بهذا البروتوكول البسيط للحصول على نتائج فعلية مع الاستمرار.
              </p>
            </div>

            {/* Dose / Frequency / Duration cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
              {[
                { label: "الجرعة", value: USAGE_PROTOCOL[product.id].dose, icon: Droplets },
                { label: "التكرار", value: USAGE_PROTOCOL[product.id].frequency, icon: Clock },
                { label: "مدة الكورس", value: USAGE_PROTOCOL[product.id].duration, icon: CalendarDays },
              ].map(({ label, value, icon: Icon }) => (
                <div key={label} className="bg-brand-mint/40 border border-brand-teal/20 rounded-2xl p-5 text-center">
                  <Icon className="w-7 h-7 text-brand-teal mx-auto mb-2" />
                  <p className="text-xs font-bold text-brand-gray uppercase tracking-wider mb-1">{label}</p>
                  <p className="text-base font-bold text-brand-charcoal leading-snug">{value}</p>
                </div>
              ))}
            </div>

            {/* Steps timeline */}
            <div className="space-y-6 mb-12">
              {USAGE_PROTOCOL[product.id].steps.map((step, i) => {
                const Icon = step.icon;
                return (
                  <div key={i} className="flex gap-5 items-start bg-white border-2 border-brand-mint rounded-2xl p-6 shadow-soft">
                    <div className="flex-shrink-0 relative">
                      <div className="w-14 h-14 rounded-2xl bg-brand-teal flex items-center justify-center text-white">
                        <Icon className="w-7 h-7" />
                      </div>
                      <span className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-brand-gold text-white text-sm font-extrabold flex items-center justify-center shadow-md">
                        {i + 1}
                      </span>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-extrabold text-brand-charcoal text-lg md:text-xl mb-1">{step.title}</h3>
                      <p className="text-brand-gray leading-relaxed">{step.body}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Tips full-width */}
            <div className="bg-brand-mint/30 rounded-2xl p-6 border border-brand-teal/15">
              <div className="flex items-center gap-2 mb-4">
                <CheckCircle2 className="w-6 h-6 text-brand-teal" />
                <h3 className="font-extrabold text-brand-charcoal text-lg">نصائح لزيادة الفعالية</h3>
              </div>
              <ul className="grid md:grid-cols-2 gap-x-6 gap-y-3">
                {USAGE_PROTOCOL[product.id].tips.map((tip, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-brand-charcoal leading-relaxed">
                    <span className="text-brand-teal font-bold mt-0.5">✓</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      )}

      {product.testimonialImage ? (
        <section className="section-padding bg-white">
          <div className="container-max max-w-5xl mx-auto">
            <div className="text-center mb-8">
              <span className="text-brand-teal font-bold text-sm tracking-wider mb-2 block">نتائج حقيقية</span>
              <h2 className="text-2xl md:text-3xl font-extrabold text-brand-charcoal">
                الفرق يظهر مع الانتظام — كما تلاحظينه أنتِ
              </h2>
            </div>
            <div className="rounded-3xl overflow-hidden shadow-card bg-gradient-to-b from-brand-sand/30 to-white">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={product.testimonialImage}
                alt={`نتائج ${product.shortNameAr} — قبل وبعد`}
                className="w-full h-auto object-contain"
              />
            </div>
          </div>
        </section>
      ) : null}

      {/* Social proof */}
      <section className="section-padding bg-brand-sand/50 overflow-hidden">
        <div className="container-max">
          <div className="text-center mb-12">
            <span className="text-brand-teal font-bold text-sm tracking-wider mb-2 block">تجارب حقيقية</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-brand-charcoal mb-4">
              آلاف العملاء في السعودية يثقون بنا
            </h2>
            <div className="flex items-center justify-center gap-1">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star key={i} className="w-6 h-6 fill-brand-gold text-brand-gold" />
              ))}
              <span className="mr-2 font-bold text-brand-charcoal text-lg">4.8/5</span>
            </div>
          </div>
          <SocialProofCarousel reviews={productReviews} />
        </div>
      </section>

      {/* UGC placeholders */}
      <section className="section-padding bg-white">
        <div className="container-max">
          <h2 className="text-2xl md:text-3xl font-extrabold text-brand-charcoal mb-8 text-center">
            شوف المنتج على الطبيعة
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {product.lifestyleImages?.map((item, i) => (
              <div
                key={i}
                className="rounded-3xl aspect-[3/4] shadow-soft hover:shadow-card transition-all transform hover:-translate-y-1 relative overflow-hidden"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={item.src} alt={item.alt} className="h-full w-full object-cover object-center" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Second offer CTA - High Conversion */}
      <section className="section-padding bg-brand-teal text-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="container-max max-w-2xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full text-sm font-bold mb-6">
            <Clock className="w-4 h-4" />
            <span>الكمية محدودة - اطلب قبل نفاذ المخزون</span>
          </div>
          
          <h2 className="text-3xl md:text-4xl font-extrabold mb-4 leading-tight">{product.heroHeadline}</h2>
          <p className="text-brand-mint text-lg mb-8">ابدأ روتين ثقتك اليوم، إطلالتك تستاهل.</p>
          
          <div className="flex flex-col gap-4 mb-8">
            {product.offers.map((offer) => {
              const isDefault = offer.defaultSelected;
              return (
                <div
                  key={offer.quantity}
                  className={`rounded-2xl p-5 flex justify-between items-center border-2 transition-all cursor-pointer ${
                    isDefault 
                      ? "bg-white text-brand-teal border-white shadow-xl transform scale-105" 
                      : "bg-white/10 text-white border-white/20 hover:bg-white/20"
                  }`}
                  onClick={() => setSelectedOffer(offer)}
                >
                  <div className="text-right">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-extrabold text-lg">{offer.label}</span>
                      {offer.badge && (
                        <span className={`text-xs px-2 py-1 rounded-full font-bold ${isDefault ? "bg-brand-teal text-white" : "bg-white/20 text-white"}`}>
                          {offer.badge}
                        </span>
                      )}
                    </div>
                    {isDefault && <p className="text-sm text-brand-gray font-medium">ابدأ بقطعة وجرّب النتيجة</p>}
                  </div>
                  <div className="text-left">
                    <span className="font-extrabold text-2xl block">{formatSARCompact(offer.price)}</span>
                    {offer.quantity > 1 && (
                      <span className={`text-xs font-bold ${isDefault ? "text-green-600" : "text-brand-mint"}`}>
                        توفير رائع!
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          
          <button
            onClick={handleAddToCart}
            className="bg-brand-gold text-brand-charcoal font-extrabold py-5 rounded-2xl hover:bg-yellow-400 transition-colors w-full text-lg flex items-center justify-center gap-3 shadow-xl transform hover:-translate-y-1"
          >
            <ShoppingBag className="w-6 h-6" />
            أضف للسلة الآن — الدفع عند الاستلام
          </button>
          
          <div className="mt-6 flex flex-wrap justify-center gap-4 text-sm font-medium text-brand-mint">
            <span className="flex items-center gap-1"><ShieldCheck className="w-4 h-4" /> ضمان 30 يوم</span>
            <span className="flex items-center gap-1"><Truck className="w-4 h-4" /> توصيل سريع</span>
            <span className="flex items-center gap-1"><CheckCircle2 className="w-4 h-4" /> تأكيد قبل الشحن</span>
          </div>
        </div>
      </section>

      {/* Comparison */}
      <section className="section-padding bg-gray-50">
        <div className="container-max">
          <div className="text-center mb-12">
            <span className="text-brand-teal font-bold text-sm tracking-wider mb-2 block">الفرق واضح</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-brand-charcoal mb-4">
              ليش سَنَدي مو أي منتج عادي؟
            </h2>
          </div>
          <ComparisonCards />
        </div>
      </section>

      {/* FAQ */}
      <section className="section-padding bg-white">
        <div className="container-max max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-extrabold text-brand-charcoal mb-4">
              عندك استفسار؟
            </h2>
            <p className="text-brand-gray text-lg">جمعنا لك أكثر الأسئلة اللي توصلنا من عملائنا</p>
          </div>
          <FAQAccordion faqs={FAQS} />
        </div>
      </section>

      {/* Sticky CTA mobile */}
      <StickyProductCTA
        productName={product.nameAr}
        selectedOffer={selectedOffer}
        onAddToCart={handleAddToCart}
        visible={showSticky}
      />
    </>
  );
}
