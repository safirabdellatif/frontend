/** On-site paths available in the redirect manager dropdown. */
export const REDIRECT_TARGET_OPTIONS = [
  { path: "/", label: "الرئيسية" },
  { path: "/lp", label: "صفحة LP (آمنة للإعلانات)" },
  { path: "/products", label: "كل المنتجات" },
  { path: "/products/biotin-collagen-drops", label: "قطرات البيوتين والكولاجين" },
  { path: "/products/teeth-whitening-kit", label: "طقم تبييض الأسنان" },
  { path: "/products/beauty-milk-glutathione", label: "بودرة حليب الفراولة" },
  { path: "/about", label: "عن سَنَدي" },
  { path: "/contact", label: "تواصل معنا" },
];

export type RedirectTargetPath = (typeof REDIRECT_TARGET_OPTIONS)[number]["path"];

export function buildAdRedirectUrl(slug: string, siteOrigin = "https://mysanad.shop"): string {
  return `${siteOrigin.replace(/\/$/, "")}/ads/${slug}`;
}
