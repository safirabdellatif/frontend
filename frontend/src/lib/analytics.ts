"use client";

import { META_PIXEL_ID, PIXELS_ENABLED, SNAP_PIXEL_ID, TIKTOK_PIXEL_ID } from "@/config/pixels";
import { getStoredAttribution } from "@/lib/attribution";
import { generateEventId, generateSessionId } from "@/lib/events";

type FbqFunction = {
  (...args: unknown[]): void;
  queue?: unknown[][];
};

declare global {
  interface Window {
    fbq?: FbqFunction;
    ttq?: {
      track: (event: string, data?: object, opts?: object) => void;
      page: () => void;
      load: (pixelId: string) => void;
    };
    snaptr?: (action: string, event?: string, data?: object) => void;
    _pixelsLoaded?: boolean;
    _pixelQueue?: Array<() => void>;
  }
}

const ENABLED = PIXELS_ENABLED;
const DEBUG = process.env.NEXT_PUBLIC_ENABLE_DEBUG_ANALYTICS === "true";
const API_BASE = "/api";
const ADMIN_EVENTS_ENABLED = process.env.NEXT_PUBLIC_ENABLE_ADMIN_EVENTS !== "false";

function log(msg: string, ...args: unknown[]) {
  if (DEBUG) console.log("[analytics]", msg, ...args);
}

function flushQueue() {
  if (window._pixelQueue) {
    window._pixelQueue.forEach((fn) => fn());
    window._pixelQueue = [];
  }
  window._pixelsLoaded = true;
}

function recordBrowserEvent(
  eventName: string,
  eventId: string,
  data: { productId?: string; value?: number } = {}
) {
  if (!ADMIN_EVENTS_ENABLED || typeof window === "undefined") return;
  if (window.location.pathname.startsWith("/admin")) return;
  if (window.location.pathname.startsWith("/redirecmysanad")) return;

  const attribution = getStoredAttribution();
  void fetch(`${API_BASE}/events`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      event_name: eventName,
      event_id: eventId,
      session_id: generateSessionId(),
      page_url: window.location.href,
      referrer: document.referrer || attribution.referrer,
      product_id: data.productId,
      value: data.value,
      currency: "SAR",
      user_agent: navigator.userAgent,
      fbp: attribution.fbp,
      fbc: attribution.fbc,
      ttp: attribution.ttp,
    }),
    keepalive: true,
  }).catch(() => {
    // Browser analytics must never interrupt the shopping flow.
  });
}

export function loadPixels() {
  if (!ENABLED || typeof window === "undefined") return;
  if (window._pixelsLoaded) return;
  window._pixelQueue = window._pixelQueue ?? [];

  const metaId = META_PIXEL_ID;
  const tiktokId = TIKTOK_PIXEL_ID;
  const snapId = SNAP_PIXEL_ID;

  if (metaId) loadMetaPixel(metaId);
  if (tiktokId) loadTikTokPixel(tiktokId);
  if (snapId) loadSnapPixel(snapId);

  flushQueue();
}

function loadMetaPixel(pixelId: string) {
  if (!pixelId) return;
  if (window.fbq) {
    log("Meta pixel already initialized", pixelId);
    return;
  }
  log("Meta pixel pending layout script", pixelId);
}

function loadTikTokPixel(pixelId: string) {
  if (!pixelId) return;
  if (window.ttq) {
    log("TikTok pixel already initialized", pixelId);
    return;
  }
  log("TikTok pixel pending layout script", pixelId);
}

function loadSnapPixel(pixelId: string) {
  if (window.snaptr) {
    window.snaptr("init", pixelId);
    return;
  }

  const win = window as Window & {
    snaptr?: ((...args: unknown[]) => void) & { queue?: unknown[][]; handleRequest?: (...args: unknown[]) => void };
  };

  const snaptr = function (...args: unknown[]) {
    if (snaptr.handleRequest) {
      snaptr.handleRequest.apply(snaptr, args);
    } else {
      snaptr.queue = snaptr.queue ?? [];
      snaptr.queue.push(args);
    }
  } as ((...args: unknown[]) => void) & { queue?: unknown[][]; handleRequest?: (...args: unknown[]) => void };
  snaptr.queue = [];
  win.snaptr = snaptr;

  const script = document.createElement("script");
  script.async = true;
  script.src = "https://sc-static.net/scevent.min.js";
  script.onload = () => log("Snap pixel loaded", pixelId);
  document.head.appendChild(script);

  snaptr("init", pixelId);
  snaptr("track", "PAGE_VIEW");
}

export function trackPageView(url: string) {
  const eventId = generateEventId("PageView");
  recordBrowserEvent("PageView", eventId);
  if (!ENABLED) return;
  log("PageView", url);
  window.fbq?.("track", "PageView");
  window.ttq?.page?.();
  window.snaptr?.("track", "PAGE_VIEW");
}

export function trackViewContent(productId: string, value?: number) {
  const eventId = generateEventId("ViewContent");
  recordBrowserEvent("ViewContent", eventId, { productId, value });
  if (!ENABLED) return eventId;
  log("ViewContent", productId, eventId);
  window.fbq?.("track", "ViewContent", { content_ids: [productId], value, currency: "SAR" }, { eventID: eventId });
  window.ttq?.track("ViewContent", { content_id: productId, value, currency: "SAR" }, { event_id: eventId });
  window.snaptr?.("track", "VIEW_CONTENT", { item_ids: [productId], client_dedup_id: eventId });
  return eventId;
}

export function trackAddToCart(productId: string, value: number, eventId: string) {
  recordBrowserEvent("AddToCart", eventId, { productId, value });
  if (!ENABLED) return;
  log("AddToCart", productId, value, eventId);
  window.fbq?.("track", "AddToCart", { content_ids: [productId], value, currency: "SAR" }, { eventID: eventId });
  window.ttq?.track("AddToCart", { content_id: productId, value, currency: "SAR" }, { event_id: eventId });
  window.snaptr?.("track", "ADD_CART", { item_ids: [productId], price: value, client_dedup_id: eventId });
}

export function trackInitiateCheckout(value: number) {
  const eventId = generateEventId("InitiateCheckout");
  recordBrowserEvent("InitiateCheckout", eventId, { value });
  if (!ENABLED) return eventId;
  log("InitiateCheckout", value, eventId);
  window.fbq?.("track", "InitiateCheckout", { value, currency: "SAR" }, { eventID: eventId });
  window.ttq?.track("InitiateCheckout", { value, currency: "SAR" }, { event_id: eventId });
  window.snaptr?.("track", "START_CHECKOUT", { price: value, client_dedup_id: eventId });
  return eventId;
}

export function trackPurchase(
  orderId: string,
  purchaseEventId: string,
  value: number,
  contentIds: string[]
) {
  if (!ENABLED) return;
  log("Purchase", orderId, purchaseEventId, value);
  window.fbq?.("track", "Purchase", { value, currency: "SAR", content_ids: contentIds, order_id: orderId }, { eventID: purchaseEventId });
  window.ttq?.track("CompletePayment", { value, currency: "SAR" }, { event_id: purchaseEventId });
  window.snaptr?.("track", "PURCHASE", { price: value, order_id: orderId, client_dedup_id: purchaseEventId });
}
