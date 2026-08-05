export type ProductId = "biotin_collagen" | "teeth_whitening_kit" | "beauty_milk";

export interface ProductOffer {
  quantity: 1 | 2 | 3;
  price: number;
  label: string;
  badge: string;
  defaultSelected?: boolean;
}

export interface ProductFeature {
  title: string;
  body: string;
  icon: string;
}

export interface ProductMaterial {
  title: string;
  body: string;
  status?: "TO_CONFIRM";
}

export interface ProductImagePlaceholder {
  alt: string;
  label: string;
}

export interface ProductGalleryImage {
  src: string;
  alt: string;
}

export interface Product {
  id: ProductId;
  slug: string;
  sku: string;
  nameAr: string;
  shortNameAr: string;
  heroHeadline: string;
  heroSubheading: string;
  painAngles: string[];
  benefits: string[];
  features: ProductFeature[];
  materials: ProductMaterial[];
  useCases: string[];
  offers: ProductOffer[];
  crossSellProductIds: ProductId[];
  upsellProductId: ProductId;
  upsellCopy: string;
  imagePlaceholders: ProductImagePlaceholder[];
  mainImage?: string;
  /** Homepage / products grid only — does not replace mainImage elsewhere */
  cardImage?: string;
  galleryImages?: ProductGalleryImage[];
  featureImages?: string[];
  lifestyleImages?: ProductGalleryImage[];
  testimonialImage?: string;
  scienceAngle: string;
  disclaimer: string;
}

export const OFFERS: ProductOffer[] = [
  { quantity: 1, price: 199, label: "قطعة واحدة", badge: "للتجربة", defaultSelected: true },
  { quantity: 2, price: 279, label: "قطعتان", badge: "الأكثر طلبًا" },
  { quantity: 3, price: 349, label: "3 قطع", badge: "أفضل قيمة" },
];

const DISCLAIMER =
  "منتج عناية تجميلي وغذائي تكميلي. النتائج تختلف من شخص لآخر مع الاستمرار في الروتين، وليس بديلاً عن استشارة المختص للحالات الطبية.";

export const PRODUCTS: Record<ProductId, Product> = {
  biotin_collagen: {
    id: "biotin_collagen",
    slug: "biotin-collagen-drops",
    sku: "SANAD-BC-7K3F",
    mainImage: "/products/biotin-collagen.png",
    nameAr: "قطرات البيوتين والكولاجين للشعر",
    shortNameAr: "قطرات البيوتين والكولاجين",
    heroHeadline: "شعر أكثف وأقوى — من الداخل",
    heroSubheading:
      "قطرات سائلة بنكهة التوت تجمع بين البيوتين والكولاجين بتركيز 60,000 ميكروغرام لكل جرعة — لدعم كثافة الشعر وتقليل التساقط بطريقة سهلة وسريعة الامتصاص.",
    painAngles: [
      "شعرك بدأ يخف وتلاحظين تساقطًا أكثر من المعتاد؟",
      "تبحثين عن مكمل سهل بدون حبوب كبيرة يصعب بلعها؟",
      "جربتِ منتجات خارجية كثيرة بدون نتيجة تذكر؟",
    ],
    benefits: [
      "يدعم مظهر شعر أكثف وأقوى مع الاستمرار",
      "يقلّل التساقط الظاهر ويغذّي فروة الرأس من الداخل",
      "تركيبة سائلة سريعة الامتصاص بنكهة التوت اللذيذة",
      "روتين قطرة واحدة يوميًا — سهل والتزام مستمر",
      "خالٍ من السكر ومن الجلوتين والكائنات المعدّلة وراثيًا",
    ],
    features: [
      { title: "بيوتين + كولاجين بتركيز عالٍ", body: "60,000 ميكروغرام في كل جرعة (2 مل) لدعم كثافة الشعر وقوّته من الجذور.", icon: "badge-check" },
      { title: "قطرات سائلة بنكهة التوت", body: "أسهل من الحبوب وأسرع امتصاصًا، فقط قطرات تحت اللسان أو في مشروبك المفضل.", icon: "heart" },
      { title: "روتين يومي بسيط", body: "جرعة واحدة في اليوم تكفي لتغذية شعرك من الداخل.", icon: "moon" },
      { title: "نظيف وبدون إضافات", body: "بدون سكر، بدون جلوتين، وبدون كائنات معدّلة وراثيًا — مكوّنات مختارة بعناية.", icon: "armchair" },
    ],
    materials: [
      { title: "البيوتين (فيتامين B7)", body: "TO_CONFIRM", status: "TO_CONFIRM" },
      { title: "الكولاجين المتحلل", body: "TO_CONFIRM", status: "TO_CONFIRM" },
      { title: "نكهة التوت الطبيعية", body: "TO_CONFIRM", status: "TO_CONFIRM" },
    ],
    useCases: ["تساقط الشعر", "ضعف كثافة الشعر", "تقوية الجذور", "روتين العناية الداخلية للشعر"],
    offers: OFFERS,
    crossSellProductIds: ["teeth_whitening_kit", "beauty_milk"],
    upsellProductId: "teeth_whitening_kit",
    upsellCopy: "أضف طقم تبييض الأسنان للطلب بسعر خاص مرة واحدة فقط",
    scienceAngle:
      "البيوتين عنصر أساسي يدعم بناء الكيراتين — البروتين الذي يتكوّن منه الشعر، فيما يدعم الكولاجين تغذية بصيلات الشعر وقوّتها. الجمع بينهما في تركيبة سائلة يمنح امتصاصًا أسرع مقارنةً بالحبوب.",
    disclaimer: DISCLAIMER,
    imagePlaceholders: [
      { alt: "عبوة قطرات البيوتين والكولاجين للشعر", label: "قطرات البيوتين والكولاجين - صورة المنتج" },
      { alt: "طريقة الاستخدام بالقطارة", label: "طريقة الاستخدام" },
      { alt: "تفاصيل التركيز والمكوّنات", label: "60,000 ميكروغرام لكل جرعة" },
      { alt: "نكهة التوت الطبيعية", label: "نكهة التوت اللذيذة" },
    ],
    cardImage: "/products/biotin-collagen-card.png",
    galleryImages: [
      { src: "/products/biotin-collagen-gallery-1.png", alt: "طريقة الاستخدام — قطرة تحت اللسان" },
      { src: "/products/biotin-collagen-gallery-2.png", alt: "قطّارة البيوتين والكولاجين بتركيز عالٍ" },
      { src: "/products/biotin-collagen-gallery-3.png", alt: "نكهة التوت الطبيعية مع القطرات" },
    ],
    featureImages: [
      "/products/biotin-collagen-feature-1.png",
      "/products/biotin-collagen-feature-2.png",
      "/products/biotin-collagen-feature-3.png",
      "/products/biotin-collagen-feature-4.png",
    ],
    lifestyleImages: [
      { src: "/products/biotin-collagen-gallery-1.png", alt: "تجربة الاستخدام اليومي" },
      { src: "/products/biotin-collagen-feature-3.png", alt: "تحدي الانتظام 30 يومًا" },
      { src: "/products/biotin-collagen-gallery-3.png", alt: "نكهة التوت اللذيذة" },
      { src: "/products/biotin-collagen-feature-1.png", alt: "نتائج الكثافة والقوة" },
    ],
    testimonialImage: "/products/biotin-collagen-testimonial.png",
  },
  teeth_whitening_kit: {
    id: "teeth_whitening_kit",
    slug: "teeth-whitening-kit",
    sku: "SANAD-TW-9P2L",
    mainImage: "/products/teeth-whitening-kit.png",
    nameAr: "طقم تبييض الأسنان الاحترافي بضوء LED",
    shortNameAr: "طقم تبييض الأسنان",
    heroHeadline: "ابتسامة أنصع في المنزل بنتائج احترافية",
    heroSubheading:
      "طقم تبييض احترافي بضوء LED بارد لطيف على الأسنان مع جل التبييض المخصص. نتائج ملحوظة خلال 30 دقيقة فقط لكل جلسة، ومناسب للأسنان الحساسة.",
    painAngles: [
      "تتجنبين الابتسام بثقة بسبب اصفرار الأسنان؟",
      "آثار القهوة والشاي تركت تصبغات مزعجة؟",
      "تبحثين عن نتائج عيادة بسعر منزلي وبدون موعد؟",
    ],
    benefits: [
      "نتائج تبييض ملحوظة خلال جلسات قصيرة",
      "ضوء LED بارد احترافي لطيف على الأسنان واللثة",
      "تقنية احترافية بنتائج تشبه نتائج العيادة في منزلك",
      "آمن للأسنان الحساسة عند الاستخدام حسب التعليمات",
      "30 دقيقة فقط لكل جلسة ضمن روتينك اليومي",
    ],
    features: [
      { title: "جهاز LED بارد احترافي", body: "ضوء أزرق احترافي يسرّع عمل جل التبييض دون رفع حرارة الفم.", icon: "badge-check" },
      { title: "جل تبييض مخصص", body: "جل بتركيبة مدروسة يعمل بتناغم مع ضوء LED للحصول على أقصى نتيجة.", icon: "heart" },
      { title: "لطيف على الحساسية", body: "تركيبة مدروسة لتقليل احتمالية تهيج الأسنان أو اللثة.", icon: "moon" },
      { title: "سهل الاستخدام في المنزل", body: "فعّل جهاز LED لمدة 30 دقيقة فقط — والنتيجة تتراكم مع كل جلسة.", icon: "armchair" },
    ],
    materials: [
      { title: "تركيبة جل التبييض", body: "TO_CONFIRM", status: "TO_CONFIRM" },
      { title: "مواصفات ضوء LED", body: "TO_CONFIRM", status: "TO_CONFIRM" },
      { title: "عدد الجلسات في الطقم", body: "TO_CONFIRM", status: "TO_CONFIRM" },
    ],
    useCases: ["تصبغات القهوة والشاي", "ابتسامة المناسبات", "تبييض ما قبل التصوير", "روتين العناية بالفم"],
    offers: OFFERS,
    crossSellProductIds: ["biotin_collagen", "beauty_milk"],
    upsellProductId: "beauty_milk",
    upsellCopy: "أضف بودرة حليب الفراولة للطلب بسعر خاص مرة واحدة فقط",
    scienceAngle:
      "يعمل ضوء LED البارد على تنشيط جل التبييض على سطح المينا، فيسرّع تفاعل التبييض وتظهر نتائج أوضح في وقت أقل — مع راحة أعلى للأسنان الحساسة مقارنةً بالطرق التقليدية.",
    disclaimer: DISCLAIMER,
    imagePlaceholders: [
      { alt: "طقم تبييض الأسنان الاحترافي بضوء LED", label: "طقم التبييض - صورة المنتج" },
      { alt: "جهاز LED أثناء الاستخدام", label: "جهاز LED بارد احترافي" },
      { alt: "جل التبييض المخصص", label: "جل التبييض" },
      { alt: "ابتسامة واثقة بعد الاستخدام", label: "نتائج تدريجية" },
    ],
    cardImage: "/products/teeth-whitening-card.png",
    galleryImages: [
      { src: "/products/teeth-whitening-gallery-1.png", alt: "استخدام طقم LED في المنزل" },
      { src: "/products/teeth-whitening-gallery-2.png", alt: "جل التبييض مع أقلام التبييض" },
      { src: "/products/teeth-whitening-gallery-3.png", alt: "نتائج تدريجية — يوم 1 إلى يوم 14" },
    ],
    featureImages: [
      "/products/teeth-whitening-feature-1.png",
      "/products/teeth-whitening-feature-2.png",
      "/products/teeth-whitening-feature-3.png",
      "/products/teeth-whitening-feature-4.png",
    ],
    lifestyleImages: [
      { src: "/products/teeth-whitening-gallery-1.png", alt: "جلسة تبييض منزلية" },
      { src: "/products/teeth-whitening-gallery-2.png", alt: "تحضير جل التبييض" },
      { src: "/products/teeth-whitening-gallery-3.png", alt: "نتائج بعد أسبوعين" },
      { src: "/products/teeth-whitening-feature-4.png", alt: "طقم تبييض احترافي كامل" },
    ],
    testimonialImage: "/products/teeth-whitening-testimonial.png",
  },
  beauty_milk: {
    id: "beauty_milk",
    slug: "beauty-milk-glutathione",
    sku: "SANAD-BM-4M8X",
    mainImage: "/products/beauty-milk.png",
    nameAr: "بودرة حليب الفراولة لنضارة وتفتيح البشرة",
    shortNameAr: "بودرة حليب الفراولة",
    heroHeadline: "نضارة وتفتيح للبشرة من الداخل بنكهة الفراولة",
    heroSubheading:
      "بودرة يومية بنكهة الفراولة الفاخرة بتركيبة مدروسة تدعم إشراقة البشرة وتوحيد لونها — بأكياس مفردة عملية تذوب بسرعة في الماء أو الحليب.",
    painAngles: [
      "لون بشرتك غير موحّد وتبحثين عن إشراقة طبيعية؟",
      "تعبت من مستحضرات التفتيح الخارجية بدون فرق حقيقي؟",
      "تريدين روتين عناية لذيذ وسهل تستمتعين به كل يوم؟",
    ],
    benefits: [
      "يدعم إشراقة البشرة وتوحيد لونها مع الاستمرار",
      "تركيبة مدروسة لدعم نضارة البشرة وتفتيحها من الداخل",
      "بنكهة الفراولة الطبيعية اللذيذة",
      "أكياس مفردة سهلة الاستخدام في أي وقت",
      "بودرة سريعة الذوبان في الماء أو الحليب",
    ],
    features: [
      { title: "تركيبة لإشراقة البشرة", body: "مكوّنات مختارة تساعد على دعم نضارة وإشراقة البشرة من الداخل.", icon: "badge-check" },
      { title: "نكهة الفراولة الفاخرة", body: "نكهة طبيعية لذيذة تجعل روتين الجمال شيئًا تتطلعين إليه يوميًا.", icon: "heart" },
      { title: "أكياس مفردة عملية", body: "أضيفي الكيس على الماء البارد أو الحليب — يذوب في ثوانٍ.", icon: "moon" },
      { title: "روتين يومي ممتع", body: "كوب واحد يوميًا ضمن روتينك ليدعم إشراقة بشرتك من الداخل.", icon: "armchair" },
    ],
    materials: [
      { title: "تركيبة دعم نضارة البشرة", body: "TO_CONFIRM", status: "TO_CONFIRM" },
      { title: "خلاصة الفراولة الطبيعية", body: "TO_CONFIRM", status: "TO_CONFIRM" },
      { title: "عدد الأكياس في العبوة", body: "TO_CONFIRM", status: "TO_CONFIRM" },
    ],
    useCases: ["عدم توحّد لون البشرة", "بهتان البشرة", "روتين إشراقة المناسبات", "روتين العناية الداخلية اليومي"],
    offers: OFFERS,
    crossSellProductIds: ["biotin_collagen", "teeth_whitening_kit"],
    upsellProductId: "biotin_collagen",
    upsellCopy: "أضف قطرات البيوتين والكولاجين للطلب بسعر خاص مرة واحدة فقط",
    scienceAngle:
      "بودرة حليب الفراولة تجمع بين مكوّنات مختارة تدعم بشرة أكثر إشراقًا من الداخل — تساعد على مقاومة العوامل التي تؤثر على نضارة البشرة، وعند تناولها بانتظام تدعم مظهر بشرة أكثر إشراقًا وتوحدًا.",
    disclaimer: DISCLAIMER,
    imagePlaceholders: [
      { alt: "عبوة بودرة حليب الفراولة", label: "بودرة حليب الفراولة - صورة المنتج" },
      { alt: "كيس مفرد جاهز للاستخدام", label: "كيس مفرد عملي" },
      { alt: "نكهة الفراولة الفاخرة", label: "فراولة فاخرة" },
      { alt: "روتين يومي ممتع", label: "روتين الإشراقة اليومي" },
    ],
    cardImage: "/products/beauty-milk-card.png",
    galleryImages: [
      { src: "/products/beauty-milk-gallery-1.png", alt: "تحضير الكيس مع الحليب" },
      { src: "/products/beauty-milk-gallery-2.png", alt: "10 أكياس مفردة عملية" },
      { src: "/products/beauty-milk-gallery-3.png", alt: "روتين الإشراقة اليومي" },
    ],
    featureImages: [
      "/products/beauty-milk-feature-1.png",
      "/products/beauty-milk-feature-2.png",
      "/products/beauty-milk-feature-3.png",
      "/products/beauty-milk-feature-4.png",
    ],
    lifestyleImages: [
      { src: "/products/beauty-milk-gallery-1.png", alt: "طريقة التحضير الصحيحة" },
      { src: "/products/beauty-milk-feature-3.png", alt: "تجربة يومية في المنزل" },
      { src: "/products/beauty-milk-gallery-2.png", alt: "أكياس مفردة جاهزة" },
      { src: "/products/beauty-milk-gallery-3.png", alt: "كوب الإشراقة اليومي" },
    ],
    testimonialImage: "/products/beauty-milk-testimonial.png",
  },
};

export const PRODUCT_LIST = Object.values(PRODUCTS);

export const CROSS_SELL_REASONS: Record<string, Record<string, string>> = {
  biotin_collagen: {
    teeth_whitening_kit: "كمّل ثقتك بابتسامة أنصع",
    beauty_milk: "إشراقة من الداخل تكمل عنايتك",
  },
  teeth_whitening_kit: {
    biotin_collagen: "ادعمي شعرك وبشرتك وأظافرك من الداخل",
    beauty_milk: "نضارة وإشراقة تكمل ابتسامتك",
  },
  beauty_milk: {
    biotin_collagen: "ادعمي شعرك وأظافرك بجانب إشراقتك",
    teeth_whitening_kit: "ابتسامة أنصع تكمل إطلالتك",
  },
};
