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
    slug: "aisen-professional-lipstick-shaver",
    sku: "SANAD-AISEN-1X",
    mainImage: "/products/hero.png",
    nameAr: "Aisen Professional Lipstick Shaver for Facial",
    shortNameAr: "Aisen Lipstick Shaver",
    heroHeadline: "أداة احترافية لإزالة الشعر غير المرغوب من الوجه بذكاء وسهولة",
    heroSubheading:
      "ماكينة Aisen Professional Lipstick Shaver for Facial مصممة لتقديم إزالة دقيقة وملائمة للمنزل مع أداء نظيف ومريح، ومناسبة لاستخدامات العناية اليومية والتهيئة السريعة قبل المناسبات.",
    painAngles: [
      "تبحثين عن حل عملي لإزالة الشعر الخفيف من الوجه دون تعقيد؟",
      "ترغبين في أداة مريحة وسريعة للروتين اليومي؟",
      "تريدين أداة مريحة للظهور الأنظف قبل المناسبات أو الصور؟",
    ],
    benefits: [
      "إزالة سريعة ومريحة للشعر الخفيف على الوجه",
      "تصميم عملي يناسب الاستخدام المنزلي بسهولة",
      "مناسب للروتين اليومي قبل المناسبات أو الظهور الاجتماعي",
      "سهلة الحمل والتخزين مع الاستخدام الآمن حسب التعليمات",
      "مناسبة لمن يبحثن عن حل نظيف وبسيط للعناية الشخصية",
    ],
    features: [
      { title: "تصميم احترافي مريح", body: "أداة عملية ومناسبة للاستخدام المنزلي مع تفاصيل تصميم تساعد على سهولة التحكم والتعامل.", icon: "badge-check" },
      { title: "إزالة دقيقة وسريعة", body: "مصممة لتقديم إزالة نظيفة للشعر الخفيف مع نتائج أسرع من الطرق التقليدية غير المنظمة.", icon: "heart" },
      { title: "مناسبة للروتين اليومي", body: "أسهل في الاستخدام من الحلول المعقدة وتُناسب العناية الشخصية اليومية والتهيئة السريعة.", icon: "moon" },
      { title: "حل عملي للمنزل", body: "تجمع بين الراحة والسهولة، وتمنحك أداة عملية بديلاً بسيطًا للطرق التقليدية.", icon: "armchair" },
    ],
    materials: [
      { title: "نوع الأداة", body: "أداة عناية شخصية احترافية", status: "TO_CONFIRM" },
      { title: "طريقة الاستخدام", body: "مناسبة للاستخدام المنزلي وفق التعليمات", status: "TO_CONFIRM" },
      { title: "الاستعمال المقصود", body: "إزالة الشعر الخفيف من الوجه", status: "TO_CONFIRM" },
    ],
    useCases: ["إزالة الشعر الخفيف من الوجه", "الاستعداد للمناسبات", "الروتين اليومي للعناية الشخصية", "الاستعمال المنزلي السريع"],
    offers: OFFERS,
    crossSellProductIds: ["biotin_collagen", "beauty_milk"],
    upsellProductId: "beauty_milk",
    upsellCopy: "أضف منتج العناية اليومي للطلب بسعر خاص مرة واحدة فقط",
    scienceAngle:
      "التركيز هنا على الراحة والسهولة في الاستخدام، مع تصميم عملي يهدف إلى توفير تجربة عناية شخصية أكثر سلاسة وملاءمة للمنزل.",
    disclaimer: DISCLAIMER,
    imagePlaceholders: [
      { alt: "Aisen Professional Lipstick Shaver for Facial", label: "صورة المنتج الأساسية" },
      { alt: "أداة إزالة شعر الوجه من Aisen", label: "طريقة الاستخدام" },
      { alt: "تجربة الاستخدام المنزلي", label: "الاستعمال اليومي" },
      { alt: "أداة عناية شخصية عملية", label: "النتيجة العملية" },
    ],
    cardImage: "/products/hero.png",
    galleryImages: [
      { src: "/products/hero.png", alt: "Aisen Professional Lipstick Shaver for Facial" },
      { src: "/products/hero.png", alt: "أداة إزالة الشعر من Aisen" },
      { src: "/products/hero.png", alt: "استخدام منزلي مريح" },
    ],
    featureImages: [
      "/products/hero.png",
      "/products/hero.png",
      "/products/hero.png",
      "/products/hero.png",
    ],
    lifestyleImages: [
      { src: "/products/hero.png", alt: "استخدام يومي مريح" },
      { src: "/products/hero.png", alt: "استعداد سريع للمناسبة" },
      { src: "/products/hero.png", alt: "أداة منزلية عملية" },
      { src: "/products/hero.png", alt: "حل عناية شخصي سهل" },
    ],
    testimonialImage: "/products/shared-testimonial.png",
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

export const PRODUCT_LIST = [
  PRODUCTS.teeth_whitening_kit,
  PRODUCTS.biotin_collagen,
  PRODUCTS.beauty_milk,
];

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
