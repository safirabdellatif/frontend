import { PRODUCTS, PRODUCT_LIST, type ProductId } from "@/content/products";

export const UPSELL_PRICE = 99;
export const UPSELL_EXPIRES_SECONDS = 15;

export interface SheetItem {
  product_id: string;
  product_name: string;
  sku?: string;
  quantity: number;
  offer_price: number;
  offer_label: string;
  source: string;
}

export interface StoredOrder {
  orderId: string;
  orderNumber: string;
  name: string;
  phone: string;
  items: SheetItem[];
  total: number;
  upsellProductId: ProductId | null;
  upsellAccepted: boolean;
  createdAt: string;
}

// In-memory correlation store. Sufficient for dev / single-instance.
// In serverless production, treat the Google Sheet as the source of truth.
const orders = new Map<string, StoredOrder>();

export function saveOrder(order: StoredOrder): void {
  orders.set(order.orderId, order);
}

export function getOrder(id: string): StoredOrder | undefined {
  return orders.get(id);
}

function randomAlnum(length: number): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let out = "";
  for (let i = 0; i < length; i++) {
    out += chars[Math.floor(Math.random() * chars.length)];
  }
  return out;
}

export function generateOrderId(): string {
  const d = new Date();
  const yy = String(d.getFullYear()).slice(-2);
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `sanad${yy}${mm}${dd}${randomAlnum(5)}`;
}

export function generateOrderNumber(): string {
  return generateOrderId();
}

export function formatSheetDate(iso: string): string {
  const d = new Date(iso);
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
}

export interface UpsellOffer {
  productId: ProductId;
  productNameAr: string;
  price: number;
  expiresInSeconds: number;
}

/**
 * Picks the single most likely add-on the customer doesn't already have.
 * Priority: the configured upsell of the first item in the cart, else any other product.
 */
export function selectUpsell(cartItemIds: string[]): UpsellOffer | null {
  const inCart = new Set(cartItemIds);
  const candidates = PRODUCT_LIST.filter((p) => !inCart.has(p.id));
  if (candidates.length === 0) return null;

  let chosen: ProductId | null = null;
  const firstId = cartItemIds[0] as ProductId | undefined;
  if (firstId && PRODUCTS[firstId]) {
    const preferred = PRODUCTS[firstId].upsellProductId;
    if (!inCart.has(preferred)) chosen = preferred;
  }
  if (!chosen) chosen = candidates[0].id;

  const product = PRODUCTS[chosen];
  return {
    productId: chosen,
    productNameAr: product.shortNameAr,
    price: UPSELL_PRICE,
    expiresInSeconds: UPSELL_EXPIRES_SECONDS,
  };
}

function phoneForSheet(raw: string): string {
  const digits = raw.replace(/\D/g, "");
  if (digits.startsWith("966")) return digits;
  if (digits.startsWith("0")) return `966${digits.slice(1)}`;
  return digits;
}

interface ApiCartItem {
  product_id?: string;
  product_name?: string;
  quantity?: number;
}

export function buildSheetPayloadFromApi(
  requestBody: Record<string, unknown>,
  orderResult: Record<string, unknown>,
): Record<string, unknown> {
  const customer = (requestBody.customer ?? {}) as { name?: string; phone?: string };
  const cart = (requestBody.cart ?? {}) as {
    items?: ApiCartItem[];
    total?: number;
    currency?: string;
  };
  const items = cart.items ?? [];

  const productNames = items
    .map((item) => item.product_name ?? "")
    .filter(Boolean)
    .join("/");
  const skus = items
    .map((item) => {
      const id = item.product_id as ProductId | undefined;
      return id && PRODUCTS[id] ? PRODUCTS[id].sku : "";
    })
    .filter(Boolean)
    .join("/");
  const quantities = items.map((item) => String(item.quantity ?? 1)).join("/");

  return {
    date: formatSheetDate(new Date().toISOString()),
    orderid: orderResult.orderNumber ?? orderResult.order_number ?? "",
    country: "KSA",
    name: customer.name ?? "",
    phone: phoneForSheet(customer.phone ?? ""),
    product: productNames,
    sku: skus,
    quantity: quantities,
    totalprice: orderResult.total ?? cart.total ?? 0,
    currency: orderResult.currency ?? cart.currency ?? "SAR",
    status: orderResult.status ?? "pending_confirmation",
  };
}

/**
 * Forwards a row to the Google Sheet webhook (Apps Script Web App URL).
 * No-ops gracefully when SHEET_WEBHOOK_URL is not configured so dev still works.
 */
export async function postToSheet(payload: Record<string, unknown>): Promise<boolean> {
  const url = process.env.SHEET_WEBHOOK_URL || process.env.GOOGLE_SHEET_WEBHOOK_URL;
  if (!url) {
    console.log("[orders] SHEET_WEBHOOK_URL not set — skipping sheet post");
    return false;
  }
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      redirect: "follow",
    });
    const text = await res.text();
    if (!res.ok) {
      console.error("[orders] sheet webhook HTTP error:", res.status, text);
      return false;
    }
    console.log("[orders] sheet webhook ok:", payload.orderid, text.slice(0, 120));
    return true;
  } catch (err) {
    console.error("[orders] sheet webhook post failed:", err);
    return false;
  }
}
