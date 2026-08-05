import type { Metadata, Viewport } from "next";
import Script from "next/script";
import "@/styles/globals.css";
import { PixelManager } from "@/components/analytics/PixelManager";
import { MetaPixelScript } from "@/components/analytics/MetaPixelScript";
import { SnapPixelScript } from "@/components/analytics/SnapPixelScript";
import { TikTokPixelScript } from "@/components/analytics/TikTokPixelScript";
import { SiteChrome } from "@/components/layout/SiteChrome";

export const metadata: Metadata = {
  title: {
    default: "سَنَدي | عناية تمنحك ثقة إطلالتك",
    template: "%s | سَنَدي",
  },
  description:
    "سَنَدي بيت عناية سعودي بمعايير صيدلية: قطرات البيوتين والكولاجين للشعر، طقم تبييض الأسنان الاحترافي بضوء LED، وبودرة حليب الفراولة لنضارة وتفتيح البشرة. مرخّص SFDA، حلال، والدفع عند الاستلام.",
  keywords: ["سَنَدي", "صيدلية العناية", "قطرات البيوتين والكولاجين", "طقم تبييض الأسنان", "بودرة حليب الفراولة", "مرخّص SFDA", "حلال", "الدفع عند الاستلام", "ضمان صيدلية"],
  metadataBase: new URL("https://mysanad.shop"),
  openGraph: {
    siteName: "سَنَدي",
    locale: "ar_SA",
    type: "website",
  },
  manifest: "/site.webmanifest",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-48x48.png", sizes: "48x48", type: "image/png" },
      { url: "/favicon-96x96.png", sizes: "96x96", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
    other: [
      { rel: "icon", url: "/android-chrome-192x192.png", sizes: "192x192", type: "image/png" },
      { rel: "icon", url: "/android-chrome-512x512.png", sizes: "512x512", type: "image/png" },
    ],
  },
};

export const viewport: Viewport = {
  themeColor: "#0A4D4A",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl">
      <body>
        <Script id="msnd-first-touch-url" strategy="beforeInteractive">
          {`(function(){try{var k="msnd_attribution";if(sessionStorage.getItem(k))return;sessionStorage.setItem(k,JSON.stringify({landingPage:location.href,referrer:document.referrer||""}))}catch(e){}})();`}
        </Script>
        <MetaPixelScript />
        <SnapPixelScript />
        <TikTokPixelScript />
        <PixelManager />
        <SiteChrome>{children}</SiteChrome>
      </body>
    </html>
  );
}
