"use client";

import type { FormEvent } from "react";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowDownRight,
  ArrowUpRight,
  CalendarDays,
  Eye,
  Lock,
  LogOut,
  PackageCheck,
  RefreshCcw,
  Search,
  ShieldCheck,
  ShoppingBag,
  TrendingUp,
  Users,
  X,
} from "lucide-react";

const API_BASE = "/api";
const AUTH_KEY = "mysanad_admin_auth";

type Metrics = {
  page_views: number;
  product_views: number;
  clicks: number;
  checkouts: number;
  visitors: number;
  orders: number;
  revenue: number;
  average_order_value: number;
  conversion_rate: number;
  visitor_conversion_rate: number;
  upsell_take_rate: number;
  daily: Array<{
    day: string;
    visitors: number;
    clicks: number;
    checkouts: number;
    orders: number;
    revenue: number;
  }>;
};

type OrderRow = {
  id: string;
  order_number: string;
  status: string;
  customer_name: string;
  phone_local: string;
  total: number;
  currency: string;
  upsell_status: string;
  landing_page?: string;
  ip_address?: string;
  fraud_check?: Record<string, unknown>;
  created_at: string;
  item_count: number;
};

type OrderDetail = OrderRow & {
  phone_e164: string;
  subtotal: number;
  upsell_total: number;
  referrer?: string;
  user_agent?: string;
  attribution?: Record<string, unknown>;
  items: Array<{
    product_id: string;
    product_name: string;
    quantity: number;
    offer_label?: string;
    source: string;
    unit_price: number;
    line_total: number;
  }>;
  upsells: Array<{
    product_id?: string;
    product_name?: string;
    price: number;
    shown: boolean;
    accepted?: boolean;
    created_at: string;
    responded_at?: string;
  }>;
};

function defaultStartDate() {
  const d = new Date();
  d.setDate(d.getDate() - 6);
  return d.toISOString().slice(0, 10);
}

function money(value: number | undefined) {
  return new Intl.NumberFormat("ar-SA", {
    style: "currency",
    currency: "SAR",
    maximumFractionDigits: 0,
  }).format(value || 0);
}

function number(value: number | undefined) {
  return new Intl.NumberFormat("ar-SA").format(value || 0);
}

function percent(value: number | undefined) {
  return `${(value || 0).toFixed(1)}%`;
}

function dateTime(value?: string) {
  if (!value) return "-";
  return new Intl.DateTimeFormat("ar-SA", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function basicAuth(username: string, password: string) {
  return `Basic ${btoa(`${username}:${password}`)}`;
}

export function AdminDashboardClient() {
  const [auth, setAuth] = useState<string>("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [start, setStart] = useState(defaultStartDate);
  const [end, setEnd] = useState(() => new Date().toISOString().slice(0, 10));
  const [query, setQuery] = useState("");
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [totalOrders, setTotalOrders] = useState(0);
  const [selected, setSelected] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [error, setError] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const saved = sessionStorage.getItem(AUTH_KEY);
    if (saved) setAuth(saved);
  }, []);

  useEffect(() => {
    if (!auth) return;

    const params = new URLSearchParams();
    if (start) params.set("start", start);
    if (end) params.set("end", end);
    if (query.trim()) params.set("q", query.trim());

    setLoading(true);
    setError("");
    Promise.all([
      fetch(`${API_BASE}/admin/metrics?${params.toString()}`, {
        headers: { Authorization: auth },
      }),
      fetch(`${API_BASE}/admin/orders?${params.toString()}&limit=50`, {
        headers: { Authorization: auth },
      }),
    ])
      .then(async ([metricsRes, ordersRes]) => {
        if (metricsRes.status === 401 || ordersRes.status === 401) {
          throw new Error("Invalid admin login.");
        }
        if (!metricsRes.ok || !ordersRes.ok) {
          throw new Error("Could not load admin dashboard.");
        }
        const metricsJson = (await metricsRes.json()) as Metrics;
        const ordersJson = (await ordersRes.json()) as { total: number; orders: OrderRow[] };
        setMetrics(metricsJson);
        setOrders(ordersJson.orders);
        setTotalOrders(ordersJson.total);
      })
      .catch((err: Error) => {
        setError(err.message);
        if (err.message.includes("Invalid")) {
          sessionStorage.removeItem(AUTH_KEY);
          setAuth("");
        }
      })
      .finally(() => setLoading(false));
  }, [auth, start, end, query, refreshKey]);

  const peak = useMemo(() => {
    return Math.max(...(metrics?.daily.map((d) => Math.max(d.clicks, d.orders)) ?? [1]), 1);
  }, [metrics]);

  const cards = [
    {
      label: "Valid KSA visitors",
      value: number(metrics?.visitors),
      sub: `${number(metrics?.page_views)} page views`,
      icon: Users,
    },
    {
      label: "Clicks",
      value: number(metrics?.clicks),
      sub: `${number(metrics?.product_views)} product views`,
      icon: ArrowUpRight,
    },
    {
      label: "Orders",
      value: number(metrics?.orders),
      sub: `${percent(metrics?.conversion_rate)} click conversion`,
      icon: ShoppingBag,
    },
    {
      label: "Revenue",
      value: money(metrics?.revenue),
      sub: `${money(metrics?.average_order_value)} AOV`,
      icon: TrendingUp,
    },
    {
      label: "Checkouts",
      value: number(metrics?.checkouts),
      sub: `${percent(metrics?.visitor_conversion_rate)} visitor conversion`,
      icon: PackageCheck,
    },
    {
      label: "Upsell take rate",
      value: percent(metrics?.upsell_take_rate),
      sub: "Accepted post-purchase offers",
      icon: ArrowDownRight,
    },
  ];

  function login(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const token = basicAuth(username, password);
    sessionStorage.setItem(AUTH_KEY, token);
    setAuth(token);
  }

  function logout() {
    sessionStorage.removeItem(AUTH_KEY);
    setAuth("");
    setMetrics(null);
    setOrders([]);
    setSelected(null);
  }

  async function openOrder(orderId: string) {
    setPreviewLoading(true);
    setSelected(null);
    try {
      const res = await fetch(`${API_BASE}/admin/orders/${orderId}`, {
        headers: { Authorization: auth },
      });
      if (!res.ok) throw new Error("Could not load order preview.");
      setSelected((await res.json()) as OrderDetail);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load order preview.");
    } finally {
      setPreviewLoading(false);
    }
  }

  if (!auth) {
    return (
      <main className="min-h-screen bg-brand-dark text-white">
        <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6">
          <div className="rounded-[2rem] border border-white/10 bg-white/10 p-8 shadow-modal backdrop-blur">
            <div className="mb-8 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-gold text-brand-dark">
              <Lock className="h-7 w-7" />
            </div>
            <p className="text-sm uppercase tracking-[0.3em] text-brand-mint">MySanad Admin</p>
            <h1 className="mt-3 text-3xl font-bold">Dashboard login</h1>
            <p className="mt-3 text-sm text-white/70">
              Use the username and password configured in the backend environment.
            </p>
            <form onSubmit={login} className="mt-8 space-y-4">
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
                className="w-full rounded-2xl border border-white/15 bg-white px-4 py-3 text-brand-charcoal outline-none focus:ring-2 focus:ring-brand-gold"
                required
              />
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                type="password"
                className="w-full rounded-2xl border border-white/15 bg-white px-4 py-3 text-brand-charcoal outline-none focus:ring-2 focus:ring-brand-gold"
                required
              />
              {error ? <p className="text-sm text-red-200">{error}</p> : null}
              <button className="w-full rounded-2xl bg-brand-gold px-5 py-3 font-bold text-brand-dark transition hover:bg-white">
                Open dashboard
              </button>
            </form>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F4F7F6] text-brand-charcoal" dir="ltr">
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-5 py-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex items-center gap-2 text-sm font-semibold text-brand-teal">
              <ShieldCheck className="h-4 w-4" />
              Valid KSA traffic only
            </div>
            <h1 className="mt-2 text-3xl font-bold tracking-tight">Admin Dashboard</h1>
            <p className="mt-1 text-sm text-brand-gray">
              Clicks, orders, conversion, revenue, and order previews filtered by MaxMind Saudi non-VPN checks.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <label className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm">
              <CalendarDays className="h-4 w-4 text-brand-teal" />
              <input type="date" value={start} onChange={(e) => setStart(e.target.value)} className="bg-transparent outline-none" />
            </label>
            <label className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm">
              <CalendarDays className="h-4 w-4 text-brand-teal" />
              <input type="date" value={end} onChange={(e) => setEnd(e.target.value)} className="bg-transparent outline-none" />
            </label>
            <button
              onClick={() => setRefreshKey((key) => key + 1)}
              className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold hover:bg-slate-50"
            >
              <RefreshCcw className="mr-2 inline h-4 w-4" />
              Refresh
            </button>
            <button onClick={logout} className="rounded-2xl bg-brand-dark px-4 py-2 text-sm font-semibold text-white hover:bg-brand-teal">
              <LogOut className="mr-2 inline h-4 w-4" />
              Logout
            </button>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl space-y-6 px-5 py-6">
        {error ? <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div> : null}

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {cards.map((card) => (
            <div key={card.label} className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-soft">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-brand-gray">{card.label}</p>
                  <p className="mt-2 text-3xl font-bold">{loading ? "..." : card.value}</p>
                </div>
                <div className="rounded-2xl bg-brand-mint p-3 text-brand-teal">
                  <card.icon className="h-5 w-5" />
                </div>
              </div>
              <p className="mt-4 text-sm text-brand-gray">{card.sub}</p>
            </div>
          ))}
        </div>

        <div className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-soft">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold">Daily trend</h2>
              <p className="text-sm text-brand-gray">Clicks in teal, orders in gold.</p>
            </div>
          </div>
          <div className="mt-6 grid min-h-48 grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
            {(metrics?.daily ?? []).map((day) => (
              <div key={day.day} className="flex flex-col justify-end rounded-2xl bg-slate-50 p-3">
                <div className="flex h-28 items-end gap-2">
                  <div
                    className="w-1/2 rounded-t-xl bg-brand-teal"
                    style={{ height: `${Math.max(8, (day.clicks / peak) * 100)}%` }}
                    title={`${day.clicks} clicks`}
                  />
                  <div
                    className="w-1/2 rounded-t-xl bg-brand-gold"
                    style={{ height: `${Math.max(8, (day.orders / peak) * 100)}%` }}
                    title={`${day.orders} orders`}
                  />
                </div>
                <p className="mt-3 text-xs font-semibold">{new Date(day.day).toLocaleDateString("en", { month: "short", day: "numeric" })}</p>
                <p className="text-xs text-brand-gray">{money(day.revenue)}</p>
              </div>
            ))}
            {!metrics?.daily?.length ? <p className="col-span-full text-sm text-brand-gray">No valid traffic in this date range yet.</p> : null}
          </div>
        </div>

        <div className="rounded-[1.5rem] border border-slate-200 bg-white shadow-soft">
          <div className="flex flex-col gap-4 border-b border-slate-100 p-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-lg font-bold">Orders</h2>
              <p className="text-sm text-brand-gray">{number(totalOrders)} valid orders in the selected range</p>
            </div>
            <label className="flex w-full max-w-sm items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm">
              <Search className="h-4 w-4 text-brand-gray" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search order, customer, phone"
                className="w-full bg-transparent outline-none"
              />
            </label>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-brand-gray">
                <tr>
                  <th className="px-5 py-3">Order</th>
                  <th className="px-5 py-3">Customer</th>
                  <th className="px-5 py-3">Items</th>
                  <th className="px-5 py-3">Upsell</th>
                  <th className="px-5 py-3">Risk</th>
                  <th className="px-5 py-3">Total</th>
                  <th className="px-5 py-3">Created</th>
                  <th className="px-5 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50">
                    <td className="px-5 py-4 font-semibold">{order.order_number}</td>
                    <td className="px-5 py-4">
                      <p className="font-medium">{order.customer_name}</p>
                      <p className="text-brand-gray">{order.phone_local}</p>
                    </td>
                    <td className="px-5 py-4">{number(order.item_count)}</td>
                    <td className="px-5 py-4">
                      <span className="rounded-full bg-brand-mint px-3 py-1 text-xs font-semibold text-brand-teal">{order.upsell_status}</span>
                    </td>
                    <td className="px-5 py-4 text-brand-gray">
                      {String(order.fraud_check?.risk_score ?? "-")} / {String(order.fraud_check?.ip_risk ?? "-")}
                    </td>
                    <td className="px-5 py-4 font-bold">{money(order.total)}</td>
                    <td className="px-5 py-4 text-brand-gray">{dateTime(order.created_at)}</td>
                    <td className="px-5 py-4 text-right">
                      <button
                        onClick={() => openOrder(order.id)}
                        className="rounded-xl border border-slate-200 px-3 py-2 font-semibold text-brand-teal hover:bg-brand-mint"
                      >
                        <Eye className="mr-2 inline h-4 w-4" />
                        Preview
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {!orders.length ? <p className="p-8 text-center text-brand-gray">No valid orders found for this range.</p> : null}
          </div>
        </div>
      </section>

      {(selected || previewLoading) && (
        <div className="fixed inset-0 z-50 flex justify-end bg-brand-dark/40 backdrop-blur-sm">
          <aside className="h-full w-full max-w-2xl overflow-y-auto bg-white shadow-modal">
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-100 bg-white/95 p-5 backdrop-blur">
              <div>
                <p className="text-sm text-brand-gray">Order preview</p>
                <h3 className="text-2xl font-bold">{selected?.order_number ?? "Loading..."}</h3>
              </div>
              <button onClick={() => setSelected(null)} className="rounded-full bg-slate-100 p-2 hover:bg-slate-200">
                <X className="h-5 w-5" />
              </button>
            </div>

            {selected ? (
              <div className="space-y-5 p-5">
                <div className="rounded-[1.5rem] bg-brand-dark p-5 text-white">
                  <p className="text-sm text-white/70">{dateTime(selected.created_at)}</p>
                  <div className="mt-4 grid gap-4 sm:grid-cols-3">
                    <div>
                      <p className="text-xs text-white/60">Customer</p>
                      <p className="font-bold">{selected.customer_name}</p>
                      <p className="text-sm text-white/70">{selected.phone_e164}</p>
                    </div>
                    <div>
                      <p className="text-xs text-white/60">Total</p>
                      <p className="text-xl font-bold">{money(selected.total)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-white/60">Traffic</p>
                      <p className="font-bold">SA, valid IP</p>
                      <p className="text-sm text-white/70">{selected.ip_address}</p>
                    </div>
                  </div>
                </div>

                <section className="rounded-[1.5rem] border border-slate-200 p-5">
                  <h4 className="font-bold">Items</h4>
                  <div className="mt-4 space-y-3">
                    {selected.items.map((item) => (
                      <div key={`${item.product_id}-${item.source}`} className="flex items-center justify-between rounded-2xl bg-slate-50 p-4">
                        <div>
                          <p className="font-semibold">{item.product_name}</p>
                          <p className="text-sm text-brand-gray">
                            {item.quantity} x {item.offer_label || item.source}
                          </p>
                        </div>
                        <p className="font-bold">{money(item.line_total)}</p>
                      </div>
                    ))}
                  </div>
                  <div className="mt-5 space-y-2 border-t border-slate-100 pt-4 text-sm">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <strong>{money(selected.subtotal)}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Upsell</span>
                      <strong>{money(selected.upsell_total)}</strong>
                    </div>
                    <div className="flex justify-between text-lg">
                      <span>Total</span>
                      <strong>{money(selected.total)}</strong>
                    </div>
                  </div>
                </section>

                <section className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-[1.5rem] border border-slate-200 p-5">
                    <h4 className="font-bold">Fraud check</h4>
                    <dl className="mt-4 space-y-2 text-sm">
                      <Info label="Reason" value={String(selected.fraud_check?.reason ?? "-")} />
                      <Info label="Risk score" value={String(selected.fraud_check?.risk_score ?? "-")} />
                      <Info label="IP risk" value={String(selected.fraud_check?.ip_risk ?? "-")} />
                      <Info label="Country" value={String(selected.fraud_check?.country_iso ?? "-")} />
                    </dl>
                  </div>
                  <div className="rounded-[1.5rem] border border-slate-200 p-5">
                    <h4 className="font-bold">Attribution</h4>
                    <dl className="mt-4 space-y-2 text-sm">
                      <Info label="UTM source" value={String(selected.attribution?.utm_source ?? "-")} />
                      <Info label="Campaign" value={String(selected.attribution?.utm_campaign ?? "-")} />
                      <Info label="Landing" value={selected.landing_page || "-"} />
                      <Info label="Referrer" value={selected.referrer || "-"} />
                    </dl>
                  </div>
                </section>

                <section className="rounded-[1.5rem] border border-slate-200 p-5">
                  <h4 className="font-bold">Upsell events</h4>
                  {selected.upsells.length ? (
                    <div className="mt-4 space-y-3">
                      {selected.upsells.map((upsell, index) => (
                        <div key={`${upsell.created_at}-${index}`} className="rounded-2xl bg-slate-50 p-4">
                          <div className="flex items-center justify-between">
                            <p className="font-semibold">{upsell.product_name || "Upsell offer"}</p>
                            <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold">
                              {upsell.accepted === true ? "Accepted" : upsell.accepted === false ? "Declined" : "Pending"}
                            </span>
                          </div>
                          <p className="mt-1 text-sm text-brand-gray">{money(upsell.price)} · {dateTime(upsell.responded_at || upsell.created_at)}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="mt-3 text-sm text-brand-gray">No upsell was shown for this order.</p>
                  )}
                </section>
              </div>
            ) : (
              <p className="p-8 text-brand-gray">Loading order...</p>
            )}
          </aside>
        </div>
      )}
    </main>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-[110px_1fr] gap-3">
      <dt className="text-brand-gray">{label}</dt>
      <dd className="break-words font-medium">{value}</dd>
    </div>
  );
}
