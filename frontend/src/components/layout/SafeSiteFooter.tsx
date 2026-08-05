import Link from "next/link";
import { SITE } from "@/content/site";

/** Footer without health, SFDA, halal, or product claims — for /lp ad warming. */
export function SafeSiteFooter() {
  return (
    <footer className="bg-brand-dark text-white mt-24">
      <div className="container-max py-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="flex items-center justify-center w-10 h-10 rounded-2xl bg-brand-teal ring-1 ring-white/10">
                <img
                  src="/brand-mark-light.png"
                  alt=""
                  aria-hidden="true"
                  className="h-7 w-7 object-contain"
                />
              </span>
              <span className="flex flex-col leading-none">
                <span className="text-xl font-bold text-white">سَنَدي</span>
                <span className="text-xs text-brand-gray font-sans">mysanad</span>
              </span>
            </div>
            <p className="text-sm text-gray-300 leading-relaxed">
              متجر سعودي للتسوق أونلاين. دفع عند الاستلام، توصيل داخل المملكة، وخدمة
              عملاء جاهزة للمساعدة.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-4 text-brand-gold">المساعدة</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  تواصل معنا
                </Link>
              </li>
              <li>
                <a
                  href={`mailto:${SITE.supportEmail}`}
                  className="hover:text-white transition-colors"
                >
                  {SITE.supportEmail}
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4 text-brand-gold">السياسات</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>
                <Link href="/privacy" className="hover:text-white transition-colors">
                  سياسة الخصوصية
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-white transition-colors">
                  الشروط وسياسة COD
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-8 border-t border-white/10 flex flex-wrap gap-4 justify-center text-sm text-gray-400">
          {["الدفع عند الاستلام", "توصيل داخل السعودية", "دعم بالعربية"].map((badge) => (
            <span key={badge} className="flex items-center gap-1">
              <span className="text-brand-gold">✓</span> {badge}
            </span>
          ))}
        </div>

        <p className="mt-8 text-center text-xs text-gray-500">
          © {new Date().getFullYear()} سَنَدي mysanad — جميع الحقوق محفوظة
        </p>
      </div>
    </footer>
  );
}
