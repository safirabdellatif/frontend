"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SafeSiteFooter } from "@/components/layout/SafeSiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { MinimalSiteHeader } from "@/components/layout/MinimalSiteHeader";

export function SiteChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isBare =
    pathname?.startsWith("/admin") || pathname?.startsWith("/redirecmysanad");
  const isLp = pathname?.startsWith("/lp");

  if (isBare) {
    return <>{children}</>;
  }

  if (isLp) {
    return (
      <>
        <MinimalSiteHeader />
        <main>{children}</main>
        <SafeSiteFooter />
      </>
    );
  }

  return (
    <>
      <SiteHeader />
      <main>{children}</main>
      <SiteFooter />
    </>
  );
}
