"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { loadPixels, trackPageView } from "@/lib/analytics";
import { captureAttribution } from "@/lib/attribution";

export function PixelManager() {
  const pathname = usePathname();

  useEffect(() => {
    captureAttribution();
    loadPixels();
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    trackPageView(window.location.href);
  }, [pathname]);

  return null;
}
