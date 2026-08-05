import type { CartItem } from "@/stores/cart-store";
import type { Attribution } from "@/lib/attribution";

// Always same-origin: Next.js proxies /api/* to the Python backend (avoids CORS).
const API_BASE = "/api";

export interface CreateOrderPayload {
  customer: {
    name: string;
    phone: string;
  };
  cart: {
    items: CartItem[];
    total: number;
    currency: "SAR";
  };
  attribution: Attribution;
  analytics: {
    eventId: string;
    sessionId: string;
    userAgent: string;
  };
}

export interface CreateOrderResult {
  orderId: string;
  orderNumber: string;
  status: string;
  total: number;
  currency: string;
  upsell?: {
    productId: string;
    productNameAr: string;
    price: number;
    expiresInSeconds: number;
  };
}

export async function createOrder(payload: CreateOrderPayload): Promise<CreateOrderResult> {
  const res = await fetch(`${API_BASE}/orders`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      customer: payload.customer,
      cart: {
        items: payload.cart.items.map((item) => ({
          product_id: item.productId,
          product_name: item.productName,
          quantity: item.quantity,
          unit_bundle_price: item.unitBundlePrice,
          offer_price: item.offerPrice,
          offer_label: item.offerLabel,
          source: item.source,
        })),
        total: payload.cart.total,
        currency: payload.cart.currency,
      },
      attribution: {
        landing_page: payload.attribution.landingPage,
        referrer: payload.attribution.referrer,
        utm_source: payload.attribution.utmSource,
        utm_medium: payload.attribution.utmMedium,
        utm_campaign: payload.attribution.utmCampaign,
        utm_content: payload.attribution.utmContent,
        utm_term: payload.attribution.utmTerm,
        fbclid: payload.attribution.fbclid,
        fbc: payload.attribution.fbc,
        fbp: payload.attribution.fbp,
        ttclid: payload.attribution.ttclid,
        ttp: payload.attribution.ttp,
        scclid: payload.attribution.scclid,
        snaptr_cookie: payload.attribution.snaptrCookie,
      },
      analytics: {
        event_id: payload.analytics.eventId,
        session_id: payload.analytics.sessionId,
        user_agent: payload.analytics.userAgent,
      },
    }),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    const msg =
      (body?.detail as { message?: string })?.message ||
      (typeof body?.detail === "string" ? body.detail : null) ||
      "صار خطأ مؤقت. حاولي مرة ثانية بعد لحظات.";
    throw new Error(msg);
  }

  return res.json();
}

export async function submitUpsell(
  orderId: string,
  payload: { accepted: boolean; productId?: string; eventId?: string }
): Promise<{ ok: boolean; total?: number }> {
  const res = await fetch(`${API_BASE}/orders/${orderId}/upsell`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      accepted: payload.accepted,
      product_id: payload.productId,
      event_id: payload.eventId,
    }),
  });
  if (!res.ok) return { ok: false };
  return res.json();
}
