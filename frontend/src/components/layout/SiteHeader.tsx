"use client";

import Link from "next/link";
import { ShoppingBag, Menu, X } from "lucide-react";
import { useState } from "react";
import { useCartStore } from "@/stores/cart-store";
import { CartDrawer } from "@/components/cart/CartDrawer";

const NAV_LINKS = [
  { href: "/", label: "الرئيسية" },
  { href: "/products", label: "المنتجات" },
  { href: "/about", label: "عن سَنَدي" },
  { href: "/contact", label: "تواصل معنا" },
];

export function SiteHeader() {
  const { itemCount, openCart, isOpen, closeCart } = useCartStore();
  const [menuOpen, setMenuOpen] = useState(false);
  const count = itemCount();

  return (
    <>
      <header className="sticky top-0 z-40 bg-brand-cream/95 backdrop-blur border-b border-brand-mint shadow-soft">
        <div className="container-max flex items-center justify-between h-16">
          {/* Brand */}
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

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-7">
            {NAV_LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="text-sm font-medium text-brand-charcoal hover:text-brand-teal transition-colors"
              >
                {l.label}
              </Link>
            ))}
          </nav>

          {/* Cart + Mobile menu */}
          <div className="flex items-center gap-3">
            <button
              aria-label="السلة"
              onClick={openCart}
              className="relative p-2 rounded-xl hover:bg-brand-mint transition-colors"
            >
              <ShoppingBag className="w-6 h-6 text-brand-charcoal" />
              {count > 0 && (
                <span className="absolute -top-1 -left-1 w-5 h-5 rounded-full bg-brand-teal text-white text-xs flex items-center justify-center font-bold">
                  {count}
                </span>
              )}
            </button>
            <button
              aria-label="القائمة"
              className="md:hidden p-2 rounded-xl hover:bg-brand-mint transition-colors"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-brand-mint bg-brand-cream py-4 px-4">
            {NAV_LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="block py-3 text-base font-medium text-brand-charcoal border-b border-brand-mint last:border-0"
                onClick={() => setMenuOpen(false)}
              >
                {l.label}
              </Link>
            ))}
          </div>
        )}
      </header>

      <CartDrawer isOpen={isOpen} onClose={closeCart} />
    </>
  );
}
