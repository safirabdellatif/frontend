import type { Metadata } from "next";
import Link from "next/link";
import { PRODUCT_LIST } from "@/content/products";
import { ProductCard } from "@/components/product/ProductCard";
import { TrustStrip } from "@/components/trust/TrustStrip";
import { ComparisonCards } from "@/components/sections/ComparisonCards";
import { FAQAccordion } from "@/components/sections/FAQAccordion";
import { FAQS } from "@/content/faqs";

export const metadata: Metadata = {
  title: "منتجاتنا",
  description: "تركيبات سَنَدي بمعايير صيدلية — قطرات البيوتين والكولاجين للشعر، طقم تبييض الأسنان الاحترافي بضوء LED، وبودرة حليب الفراولة لنضارة وتفتيح البشرة. مرخّص SFDA، حلال، والدفع عند الاستلام.",
};

const FILTERS = [
  { label: "الكل", value: "all" },
  { label: "للشعر", value: "hair" },
  { label: "للأسنان", value: "teeth" },
  { label: "لإشراقة البشرة", value: "skin" },
  { label: "مكمل غذائي", value: "supplement" },
  { label: "للرجال والنساء", value: "unisex" },
];

export default function ProductsPage() {
  return (
    <>
      <TrustStrip />

      {/* Hero */}
      <section className="section-padding bg-brand-mint">
        <div className="container-max text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-brand-charcoal mb-4">
            ثلاث تركيبات مختارة بمعايير صيدلية
          </h1>
          <p className="text-brand-gray text-lg max-w-xl mx-auto">
            لا كتالوج طويل ولا حشو. كل تركيبة مرخّصة SFDA، حلال، بجرعات مفصّحة — للشعر، الأسنان، وإشراقة البشرة.
          </p>
          {/* Filter chips */}
          <div className="flex flex-wrap justify-center gap-3 mt-8">
            {FILTERS.map((f) => (
              <span
                key={f.value}
                className="px-4 py-2 rounded-full text-sm font-medium bg-white text-brand-teal border border-brand-teal/30 hover:bg-brand-teal hover:text-white transition-colors cursor-pointer"
              >
                {f.label}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="section-padding">
        <div className="container-max">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {PRODUCT_LIST.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Bundle guidance */}
      <section className="section-padding bg-brand-sand">
        <div className="container-max max-w-2xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-brand-charcoal mb-4">أي تركيبة تناسب احتياجكِ؟</h2>
          <div className="grid md:grid-cols-3 gap-4 text-right">
            {PRODUCT_LIST.map((p) => (
              <Link
                key={p.id}
                href={`/products/${p.slug}`}
                className="bg-white rounded-2xl p-5 shadow-soft hover:shadow-card transition-shadow block"
              >
                <p className="font-bold text-brand-charcoal text-sm mb-1">{p.shortNameAr}</p>
                <p className="text-xs text-brand-gray leading-relaxed">{p.heroHeadline}</p>
                <p className="text-xs text-brand-teal mt-2 font-medium">تعرفي على المنتج ←</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison */}
      <section className="section-padding">
        <div className="container-max">
          <h2 className="text-2xl font-bold text-brand-charcoal mb-8 text-center">
            سَنَدي مقارنةً بمنتجات العناية العشوائية
          </h2>
          <ComparisonCards />
        </div>
      </section>

      {/* FAQ */}
      <section className="section-padding bg-brand-mint">
        <div className="container-max max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-brand-charcoal mb-8 text-center">أسئلة شائعة</h2>
          <FAQAccordion faqs={FAQS} />
        </div>
      </section>
    </>
  );
}
