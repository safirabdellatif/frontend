export interface Review {
  id: string;
  text: string;
  author: string;
  rating: number;
  productId?: string;
  isPlaceholder: boolean;
}

// مراجعات تجريبية - استبدلها بمراجعات حقيقية (بأسماء سعودية وصور) قبل الإطلاق
export const REVIEWS: Review[] = [
  {
    id: "r1",
    text: "مراجعة تجريبية: بعد شهر من قطرات البيوتين والكولاجين لاحظت شعري صار أكثف وتساقطه قلّ بشكل واضح.",
    author: "عميلة سَنَدي",
    rating: 5,
    productId: "biotin_collagen",
    isPlaceholder: true,
  },
  {
    id: "r2",
    text: "مراجعة تجريبية: طقم التبييض سهل ولطيف، استخدمته قبل المناسبة وابتسامتي صارت أنصع بدون حساسية.",
    author: "عميلة سَنَدي",
    rating: 5,
    productId: "teeth_whitening_kit",
    isPlaceholder: true,
  },
  {
    id: "r3",
    text: "مراجعة تجريبية: بودرة حليب الفراولة لذيذة وسهلة التحضير، وصرت ألاحظ بشرتي أكثر إشراقًا وتفتيحًا مع الاستمرار.",
    author: "عميلة سَنَدي",
    rating: 5,
    productId: "beauty_milk",
    isPlaceholder: true,
  },
  {
    id: "r4",
    text: "مراجعة تجريبية: أخذت عرض القطعتين ووصلني تأكيد قبل الشحن. تجربة شراء مرتبة.",
    author: "عميل سَنَدي",
    rating: 5,
    isPlaceholder: true,
  },
  {
    id: "r5",
    text: "مراجعة تجريبية: الدفع عند الاستلام خلّاني أجرب بدون قلق، والمنتج ما خيّب.",
    author: "عميلة سَنَدي",
    rating: 5,
    isPlaceholder: true,
  },
];
