import Link from "next/link";
import { SITE } from "@/content/site";
import { PRODUCT_LIST } from "@/content/products";

export function SiteFooter() {
  return (
    <footer className="bg-brand-dark text-white mt-24">
      <div className="container-max py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
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
              بيت عناية سعودي بمعايير صيدلية. نختار تركيبات مرخّصة من هيئة الغذاء والدواء، حلال، بجرعات مفصّحة — للشعر، الأسنان، وإشراقة البشرة.
            </p>
          </div>

          {/* Products */}
          <div>
            <h3 className="font-semibold mb-4 text-brand-gold">المنتجات</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              {PRODUCT_LIST.map((p) => (
                <li key={p.id}>
                  <Link href={`/products/${p.slug}`} className="hover:text-white transition-colors">
                    {p.shortNameAr}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Help */}
          <div>
            <h3 className="font-semibold mb-4 text-brand-gold">المساعدة</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><Link href="/contact" className="hover:text-white transition-colors">تواصل معنا</Link></li>
              <li><Link href="/returns" className="hover:text-white transition-colors">الاستبدال والإرجاع</Link></li>
              <li><a href={`mailto:${SITE.supportEmail}`} className="hover:text-white transition-colors">{SITE.supportEmail}</a></li>
            </ul>
          </div>

          {/* Policies */}
          <div>
            <h3 className="font-semibold mb-4 text-brand-gold">السياسات</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><Link href="/privacy" className="hover:text-white transition-colors">سياسة الخصوصية</Link></li>
              <li><Link href="/terms" className="hover:text-white transition-colors">الشروط وسياسة COD</Link></li>
              <li><Link href="/returns" className="hover:text-white transition-colors">سياسة الاستبدال</Link></li>
            </ul>
          </div>
        </div>

        {/* Trust row */}
        <div className="mt-12 pt-8 border-t border-white/10 flex flex-wrap gap-4 justify-center text-sm text-gray-400">
          {["مرخّص SFDA", "حلال موثّق", "الدفع عند الاستلام", "ضمان صيدلية 30 يوم"].map((badge) => (
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
