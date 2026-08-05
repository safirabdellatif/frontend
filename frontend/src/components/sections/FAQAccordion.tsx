"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";
import type { FAQ } from "@/content/faqs";

interface FAQAccordionProps {
  faqs: FAQ[];
}

export function FAQAccordion({ faqs }: FAQAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="divide-y divide-brand-mint">
      {faqs.map((faq, i) => (
        <div key={i} className="py-1">
          <button
            className="w-full flex items-center justify-between py-4 text-right gap-4"
            onClick={() => setOpenIndex(openIndex === i ? null : i)}
            aria-expanded={openIndex === i}
          >
            <span className="font-semibold text-brand-charcoal text-sm md:text-base">
              {faq.question}
            </span>
            {openIndex === i ? (
              <Minus className="w-5 h-5 text-brand-teal flex-shrink-0" />
            ) : (
              <Plus className="w-5 h-5 text-brand-gray flex-shrink-0" />
            )}
          </button>
          <AnimatePresence>
            {openIndex === i && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <p className="pb-4 text-sm text-brand-gray leading-relaxed">{faq.answer}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}
