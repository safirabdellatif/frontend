import type { Review } from "@/content/reviews";

/** Ad-safe reviews — no product names or health claims. */
export const LP_REVIEWS: Review[] = [
  {
    id: "lp1",
    text: "تجربة طلب سلسة من البداية للنهاية، والتوصيل كان أسرع مما توقعت.",
    author: "نورة — الرياض",
    rating: 5,
    isPlaceholder: true,
  },
  {
    id: "lp2",
    text: "خدمة عملاء لطيفة ورد سريع على استفساري قبل الطلب.",
    author: "سارة — جدة",
    rating: 5,
    isPlaceholder: true,
  },
  {
    id: "lp3",
    text: "الدفع عند الاستلام يعطيك راحة، والتغليف كان مرتبًا.",
    author: "ريم — الدمام",
    rating: 5,
    isPlaceholder: true,
  },
  {
    id: "lp4",
    text: "أحببت وضوح الأسعار وسرعة تأكيد الطلب.",
    author: "هيفاء — مكة",
    rating: 5,
    isPlaceholder: true,
  },
  {
    id: "lp5",
    text: "تجربة شراء مريحة ومناسبة للطلب أول مرة.",
    author: "لمى — الخبر",
    rating: 5,
    isPlaceholder: true,
  },
];

export const LP_FAKE_ACTIVITY = [
  { name: "فاطمة", city: "الرياض", minutesAgo: 6 },
  { name: "مريم", city: "جدة", minutesAgo: 11 },
  { name: "أمل", city: "الدمام", minutesAgo: 18 },
  { name: "دانة", city: "المدينة", minutesAgo: 24 },
  { name: "شهد", city: "أبها", minutesAgo: 31 },
];
