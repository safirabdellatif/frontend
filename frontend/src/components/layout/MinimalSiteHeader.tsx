"use client";

import Link from "next/link";

export function MinimalSiteHeader() {
  return (
    <header className="sticky top-0 z-40 bg-brand-cream/95 backdrop-blur border-b border-brand-mint shadow-soft">
      <div className="container-max flex items-center justify-between h-16">
        <Link href="/" className="flex items-center gap-3">
          <span className="flex items-center justify-center w-10 h-10 rounded-2xl bg-brand-teal shadow-soft ring-1 ring-brand-mint">
            <img
              src="/brand-mark-light.png"
              alt=""
              aria-hidden="true"
              className="h-7 w-7 object-contain"
            />
          </span>
          <span className="flex flex-col leading-none">
            <span className="text-xl font-bold text-brand-teal tracking-tight">سَنَدي</span>
            <span className="text-xs text-brand-gray font-sans">mysanad</span>
          </span>
        </Link>
        <Link
          href="/contact"
          className="text-sm font-medium text-brand-teal hover:text-brand-charcoal transition-colors"
        >
          تواصل معنا
        </Link>
      </div>
    </header>
  );
}
