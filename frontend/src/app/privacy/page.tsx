import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "سياسة الخصوصية",
};

export default function PrivacyPage() {
  return (
    <div className="section-padding">
      <div className="container-max max-w-3xl mx-auto prose prose-sm max-w-none">
        <h1 className="text-3xl font-bold text-brand-charcoal mb-8">سياسة الخصوصية</h1>

        <div className="space-y-8 text-brand-gray leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-brand-charcoal mb-3">البيانات التي نجمعها</h2>
            <p>نجمع البيانات التالية عند إتمام الطلب أو تصفح الموقع:</p>
            <ul className="list-disc list-inside space-y-1 mt-2">
              <li>الاسم ورقم الجوال (لتأكيد الطلب والتوصيل)</li>
              <li>تفاصيل الطلب (المنتجات، الكمية، المبلغ)</li>
              <li>عنوان IP ومعلومات المتصفح</li>
              <li>معلمات المتابعة (UTM، معرفات الإعلانات)</li>
              <li>ملفات تعريف الارتباط ومعرفات التحليلات</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-brand-charcoal mb-3">كيف نستخدم بياناتك</h2>
            <ul className="list-disc list-inside space-y-1">
              <li>تأكيد الطلب والتواصل معك قبل الشحن</li>
              <li>تنسيق التوصيل وخدمة العملاء</li>
              <li>منع الطلبات الوهمية وحماية جودة الخدمة</li>
              <li>قياس فعالية الإعلانات وتحسين تجربة الموقع</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-brand-charcoal mb-3">مشاركة البيانات</h2>
            <p>لا نبيع بياناتك. قد نشاركها مع:</p>
            <ul className="list-disc list-inside space-y-1 mt-2">
              <li>شركاء التوصيل والعمليات لإتمام الطلب</li>
              <li>منصات الإعلانات (ميتا، تيك توك، سناب شات) ببيانات مشفرة لقياس الأداء</li>
              <li>نظام جداول بيانات جوجل لإدارة الطلبات داخليًا</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-brand-charcoal mb-3">حماية البيانات ومنع الاحتيال</h2>
            <p>
              لحماية الخدمة من الطلبات الوهمية، قد نتحقق من بعض البيانات التقنية مثل عنوان IP ومؤشرات الأمان المرتبطة بالطلب.
              نستخدم خدمات متخصصة لتقييم مخاطر الطلبات وحصرها في الطلبات الحقيقية من داخل المملكة.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-brand-charcoal mb-3">حقوقك</h2>
            <p>
              يمكنك التواصل معنا لطلب تصحيح أو حذف بياناتك حيث يكون ذلك ممكنًا من الناحية التشغيلية.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
