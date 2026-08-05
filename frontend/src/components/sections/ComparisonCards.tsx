import { Check, X } from "lucide-react";

const ROWS = [
  { generic: "اسم غير واضح ومصدر غير معروف", mysanad: "علامة سعودية واضحة وتجربة طلب منظمة" },
  { generic: "مكوّنات مجهولة وادعاءات مبالغ فيها", mysanad: "مكوّنات نشطة واضحة (بيوتين • كولاجين • جلوتاثيون • ضوء LED للتبييض)" },
  { generic: "لا يوجد تأكيد واضح قبل الشحن", mysanad: "تأكيد طلب قبل الشحن" },
  { generic: "وصف عام", mysanad: "شرح طريقة الاستخدام والنتائج المتوقعة" },
  { generic: "دعم غير واضح", mysanad: "تواصل ودعم داخل السعودية" },
];

export function ComparisonCards() {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[500px] rounded-3xl overflow-hidden">
        <thead>
          <tr>
            <th className="text-right py-4 px-6 bg-brand-mint text-brand-charcoal font-semibold">
              منتج عشوائي
            </th>
            <th className="text-right py-4 px-6 bg-brand-teal text-white font-semibold">
              منتجات سَنَدي
            </th>
          </tr>
        </thead>
        <tbody>
          {ROWS.map((row, i) => (
            <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-brand-cream"}>
              <td className="py-4 px-6 text-sm text-brand-gray">
                <div className="flex items-center gap-2">
                  <X className="w-4 h-4 text-brand-alert flex-shrink-0" />
                  {row.generic}
                </div>
              </td>
              <td className="py-4 px-6 text-sm text-brand-charcoal">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-brand-success flex-shrink-0" />
                  {row.mysanad}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
