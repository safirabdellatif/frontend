import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "الشروط وسياسة الدفع عند الاستلام",
};

export default function TermsPage() {
  return (
    <div className="section-padding">
      <div className="container-max max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-brand-charcoal mb-8">الشروط وسياسة الدفع عند الاستلام</h1>

        <div className="space-y-8 text-brand-gray leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-brand-charcoal mb-3">الدفع عند الاستلام (COD)</h2>
            <ul className="space-y-2">
              <li>الدفع عند الاستلام متاح داخل المملكة العربية السعودية.</li>
              <li>يتم التواصل مع العميلة لتأكيد الطلب قبل الشحن.</li>
              <li>قد يتم إلغاء الطلب إذا تعذر تأكيده أو كان الرقم غير صحيح.</li>
              <li>قد نستخدم أنظمة تحقق للحد من الطلبات الوهمية وحماية جودة الخدمة.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-brand-charcoal mb-3">التوصيل</h2>
            <ul className="space-y-2">
              <li>التوصيل داخل المملكة العربية السعودية.</li>
              <li>يتم تأكيد الطلب قبل الشحن.</li>
              <li>مدة التوصيل تعتمد على المدينة وشركة الشحن.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-brand-charcoal mb-3">الأسعار والعروض</h2>
            <p>
              الأسعار المعروضة بالريال السعودي. العروض سارية حسب ما هو محدد في الموقع. تحتفظ سَنَدي بحق تعديل الأسعار والعروض دون إشعار مسبق.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-brand-charcoal mb-3">استخدام الموقع</h2>
            <p>
              باستخدام موقع سَنَدي وإتمام الطلب، توافقين على هذه الشروط وسياسة الخصوصية.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
