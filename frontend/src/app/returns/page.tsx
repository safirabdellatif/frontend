import type { Metadata } from "next";
import { SITE } from "@/content/site";

export const metadata: Metadata = {
  title: "سياسة الاستبدال والإرجاع",
};

export default function ReturnsPage() {
  return (
    <div className="section-padding">
      <div className="container-max max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-brand-charcoal mb-8">سياسة الاستبدال والإرجاع</h1>

        <div className="space-y-8 text-brand-gray leading-relaxed">
          <section className="bg-brand-mint rounded-2xl p-6">
            <h2 className="text-xl font-bold text-brand-charcoal mb-3">الشروط العامة</h2>
            <ul className="space-y-2">
              <li>يتم الاستبدال خلال 7 أيام من تاريخ الاستلام.</li>
              <li>المنتج يجب أن يكون غير مستخدم وبالتغليف الأصلي إلا في حالة عيب مصنعي.</li>
              <li>يجب التواصل معنا برقم الطلب وصور للمنتج قبل إرجاعه.</li>
              <li>المنتجات ذات الاستخدام المباشر قد لا تقبل الإرجاع بعد الاستخدام إلا في حالة الخلل.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-brand-charcoal mb-3">كيفية طلب الاستبدال</h2>
            <ol className="list-decimal list-inside space-y-2">
              <li>تواصل معنا عبر البريد الإلكتروني أو نموذج التواصل.</li>
              <li>أرسل رقم الطلب وصورًا للمنتج المستلم.</li>
              <li>سيتواصل معك فريق سَنَدي لتأكيد الطلب وترتيب الاستبدال.</li>
            </ol>
          </section>

          <section>
            <h2 className="text-xl font-bold text-brand-charcoal mb-3">استثناءات</h2>
            <ul className="space-y-2">
              <li>المنتجات المستخدمة أو التالفة من قِبَل العميل.</li>
              <li>المنتجات التي تجاوزت فترة الاستبدال (7 أيام).</li>
              <li>الطلبات التي تم تأكيدها وشحنها بالمواصفات الصحيحة.</li>
            </ul>
          </section>

          <section>
            <p className="text-sm">
              للاستفسار: <a href={`mailto:${SITE.supportEmail}`} className="text-brand-teal font-medium hover:underline">{SITE.supportEmail}</a>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
