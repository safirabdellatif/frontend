import type { Metadata } from "next";
import { PhoneCall, Mail, MessageCircle } from "lucide-react";
import { SITE } from "@/content/site";

export const metadata: Metadata = {
  title: "تواصل معنا",
  description: "تواصل مع فريق سَنَدي عبر البريد الإلكتروني أو نموذج التواصل. نحن هنا للمساعدة.",
};

export default function ContactPage() {
  return (
    <div className="section-padding">
      <div className="container-max max-w-2xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-brand-charcoal mb-4">تواصل معنا</h1>
          <p className="text-brand-gray text-lg">
            عندك سؤال قبل الطلب؟ فريق سَنَدي يساعدك تختار المنتج والعرض المناسب.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <div className="bg-green-50 border-2 border-green-200 rounded-3xl p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center flex-shrink-0">
              <MessageCircle className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="font-bold text-brand-charcoal">نموذج التواصل</p>
              <p className="text-sm text-brand-gray">عبّئ النموذج بالأسفل ونرد عليك بأسرع وقت</p>
            </div>
          </div>

          <a
            href={`mailto:${SITE.supportEmail}`}
            className="bg-brand-mint border-2 border-brand-teal/20 rounded-3xl p-6 flex items-center gap-4 hover:shadow-card transition-shadow"
          >
            <div className="w-12 h-12 rounded-xl bg-brand-mint flex items-center justify-center flex-shrink-0">
              <Mail className="w-6 h-6 text-brand-teal" />
            </div>
            <div>
              <p className="font-bold text-brand-charcoal">البريد الإلكتروني</p>
              <p className="text-sm text-brand-gray">{SITE.supportEmail}</p>
            </div>
          </a>
        </div>

        <div className="bg-white rounded-3xl shadow-card p-8">
          <h2 className="text-xl font-bold text-brand-charcoal mb-6">أرسل رسالة</h2>
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-brand-charcoal mb-1">الاسم</label>
              <input
                type="text"
                placeholder="اسمك الكريم"
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-brand-charcoal focus:border-brand-teal focus:outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-brand-charcoal mb-1">البريد الإلكتروني</label>
              <input
                type="email"
                placeholder="example@email.com"
                dir="ltr"
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-brand-charcoal focus:border-brand-teal focus:outline-none transition-colors text-right"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-brand-charcoal mb-1">رقم الجوال</label>
              <input
                type="tel"
                placeholder="05XXXXXXXX"
                dir="ltr"
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-brand-charcoal focus:border-brand-teal focus:outline-none transition-colors text-right"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-brand-charcoal mb-1">رسالتك</label>
              <textarea
                rows={4}
                placeholder="كيف نقدر نساعدك؟"
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-brand-charcoal focus:border-brand-teal focus:outline-none transition-colors resize-none"
              />
            </div>
            <button type="submit" className="btn-primary w-full py-4">أرسل رسالتك</button>
          </form>
        </div>

        <div className="mt-8 bg-brand-mint rounded-2xl p-5">
          <p className="text-sm text-brand-gray">
            <span className="font-semibold text-brand-charcoal">ساعات الدعم:</span> أيام الأسبوع من 9 صباحًا حتى 10 مساءً (بتوقيت الرياض)
          </p>
          <p className="text-sm text-brand-gray mt-2">
            سيتم التواصل معك لتأكيد الطلب قبل الشحن في حال قدّمت طلبًا.
          </p>
        </div>
      </div>
    </div>
  );
}
