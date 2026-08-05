"use client";

import type { FormEvent } from "react";
import { useCallback, useEffect, useState } from "react";
import {
  Copy,
  ExternalLink,
  Link2,
  Lock,
  LogOut,
  Pencil,
  Plus,
  RefreshCcw,
  Trash2,
} from "lucide-react";
import {
  REDIRECT_TARGET_OPTIONS,
  buildAdRedirectUrl,
} from "@/lib/redirect-targets";

const API_BASE = "/api/redirect-admin";
const AUTH_KEY = "mysanad_redirect_admin_auth";

type RedirectRow = {
  slug: string;
  target_path: string;
  label: string;
  is_active: boolean;
  click_count: number;
  created_at: string;
  updated_at: string;
};

function basicAuth(username: string, password: string) {
  return `Basic ${btoa(`${username}:${password}`)}`;
}

function dateTime(value?: string) {
  if (!value) return "-";
  return new Intl.DateTimeFormat("ar-SA", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export function RedirectAdminClient() {
  const [auth, setAuth] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rows, setRows] = useState<RedirectRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const [newSlug, setNewSlug] = useState("");
  const [newTarget, setNewTarget] = useState<string>(REDIRECT_TARGET_OPTIONS[0].path);
  const [newLabel, setNewLabel] = useState("");
  
  const [editingSlug, setEditingSlug] = useState<string | null>(null);
  const [editTarget, setEditTarget] = useState("");
  const [editLabel, setEditLabel] = useState("");
  const [editActive, setEditActive] = useState(true);

  useEffect(() => {
    const saved = sessionStorage.getItem(AUTH_KEY);
    if (saved) setAuth(saved);
  }, []);

  const loadRows = useCallback(async () => {
    if (!auth) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API_BASE}/redirects`, {
        headers: { Authorization: auth },
      });
      if (res.status === 401) {
        sessionStorage.removeItem(AUTH_KEY);
        setAuth("");
        throw new Error("Invalid login.");
      }
      if (!res.ok) throw new Error("Could not load redirects.");
      setRows((await res.json()) as RedirectRow[]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load redirects.");
    } finally {
      setLoading(false);
    }
  }, [auth]);

  useEffect(() => {
    void loadRows();
  }, [loadRows]);

  function login(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const token = basicAuth(username, password);
    sessionStorage.setItem(AUTH_KEY, token);
    setAuth(token);
  }

  function logout() {
    sessionStorage.removeItem(AUTH_KEY);
    setAuth("");
    setRows([]);
  }

  async function createRedirect(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setNotice("");
    try {
      const res = await fetch(`${API_BASE}/redirects`, {
        method: "POST",
        headers: {
          Authorization: auth,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          slug: newSlug.trim().toLowerCase(),
          target_path: newTarget,
          label: newLabel.trim(),
        }),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        const detail = body?.detail;
        const message = Array.isArray(detail)
          ? detail.map((item: { msg?: string }) => item.msg).filter(Boolean).join(" ")
          : detail;
        throw new Error(message || "Could not create redirect.");
      }
      const created = body as RedirectRow;
      setNewSlug("");
      setNewLabel("");
      setNotice(
        `Redirect created. Test: ${buildAdRedirectUrl(created.slug)}?utm_source=test`,
      );
      await loadRows();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not create redirect.");
    }
  }

  function startEdit(row: RedirectRow) {
    setEditingSlug(row.slug);
    setEditTarget(row.target_path);
    setEditLabel(row.label);
    setEditActive(row.is_active);
  }

  async function saveEdit(slug: string) {
    setError("");
    setNotice("");
    try {
      const res = await fetch(`${API_BASE}/redirects/${encodeURIComponent(slug)}`, {
        method: "PUT",
        headers: {
          Authorization: auth,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          target_path: editTarget,
          label: editLabel,
          is_active: editActive,
        }),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(body?.detail || "Could not update redirect.");
      }
      setEditingSlug(null);
      setNotice("Redirect updated.");
      await loadRows();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not update redirect.");
    }
  }

  async function removeRedirect(slug: string) {
    if (!confirm(`Delete redirect "${slug}"?`)) return;
    setError("");
    setNotice("");
    try {
      const res = await fetch(`${API_BASE}/redirects/${encodeURIComponent(slug)}`, {
        method: "DELETE",
        headers: { Authorization: auth },
      });
      if (!res.ok) throw new Error("Could not delete redirect.");
      setNotice("Redirect deleted.");
      await loadRows();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not delete redirect.");
    }
  }

  async function copyText(text: string) {
    try {
      await navigator.clipboard.writeText(text);
      setNotice("Copied to clipboard.");
    } catch {
      setError("Could not copy.");
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
            <p className="text-sm uppercase tracking-[0.3em] text-brand-mint">Redirect Manager</p>
            <h1 className="mt-3 text-3xl font-bold">/redirecmysanad</h1>
            <p className="mt-3 text-sm text-white/70">
              Separate login from the main admin dashboard.
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
                Sign in
              </button>
            </form>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#071615] text-white">
      <div className="border-b border-white/10 bg-white/5">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-brand-mint">Redirect Manager</p>
            <h1 className="mt-1 text-2xl font-bold">Ad links → on-site pages</h1>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => void loadRows()}
              className="inline-flex items-center gap-2 rounded-2xl border border-white/15 px-4 py-2 text-sm hover:bg-white/10"
            >
              <RefreshCcw className="h-4 w-4" />
              Refresh
            </button>
            <button
              onClick={logout}
              className="inline-flex items-center gap-2 rounded-2xl bg-white/10 px-4 py-2 text-sm hover:bg-white/15"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl space-y-8 px-6 py-8">
        {error ? (
          <div className="rounded-2xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-100">
            {error}
          </div>
        ) : null}
        {notice ? (
          <div className="rounded-2xl border border-emerald-400/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-100">
            {notice}
          </div>
        ) : null}

        <section className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
          <div className="mb-5 flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-gold text-brand-dark">
              <Plus className="h-5 w-5" />
            </span>
            <div>
              <h2 className="text-xl font-bold">Create redirect</h2>
              <p className="text-sm text-white/60">
                Ad URL format: <code className="text-brand-mint">/ads/your-slug?utm_source=...</code>
              </p>
            </div>
          </div>

          <form onSubmit={createRedirect} className="grid gap-4 md:grid-cols-4">
            <input
              value={newSlug}
              onChange={(e) => setNewSlug(e.target.value)}
              placeholder="slug (e.g. mysanad)"
              className="rounded-2xl border border-white/10 bg-white px-4 py-3 text-brand-charcoal outline-none focus:ring-2 focus:ring-brand-gold"
              required
            />
            <select
              value={newTarget}
              onChange={(e) => setNewTarget(e.target.value)}
              className="rounded-2xl border border-white/10 bg-white px-4 py-3 text-brand-charcoal outline-none focus:ring-2 focus:ring-brand-gold md:col-span-2"
            >
              {REDIRECT_TARGET_OPTIONS.map((option) => (
                <option key={option.path} value={option.path}>
                  {option.label} — {option.path}
                </option>
              ))}
            </select>
            <input
              value={newLabel}
              onChange={(e) => setNewLabel(e.target.value)}
              placeholder="Label (optional)"
              className="rounded-2xl border border-white/10 bg-white px-4 py-3 text-brand-charcoal outline-none focus:ring-2 focus:ring-brand-gold"
            />
            <button className="md:col-span-4 rounded-2xl bg-brand-gold px-5 py-3 font-bold text-brand-dark transition hover:bg-white">
              Create redirect
            </button>
          </form>
        </section>

        <section className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
          <div className="mb-5 flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-teal text-white">
              <Link2 className="h-5 w-5" />
            </span>
            <div>
              <h2 className="text-xl font-bold">Active redirects</h2>
              <p className="text-sm text-white/60">
                Query params from the ad URL are preserved on redirect.
              </p>
            </div>
          </div>

          {loading ? (
            <p className="text-sm text-white/60">Loading...</p>
          ) : rows.length === 0 ? (
            <p className="text-sm text-white/60">No redirects yet.</p>
          ) : (
            <div className="space-y-4">
              {rows.map((row) => {
                const adUrl = buildAdRedirectUrl(row.slug);
                const isEditing = editingSlug === row.slug;

                return (
                  <div
                    key={row.slug}
                    className="rounded-3xl border border-white/10 bg-black/20 p-5"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-lg font-bold">{row.slug}</h3>
                          <span
                            className={`rounded-full px-2 py-0.5 text-xs ${
                              row.is_active
                                ? "bg-emerald-500/20 text-emerald-200"
                                : "bg-white/10 text-white/50"
                            }`}
                          >
                            {row.is_active ? "active" : "paused"}
                          </span>
                        </div>
                        {row.label ? (
                          <p className="mt-1 text-sm text-white/60">{row.label}</p>
                        ) : null}
                        <p className="mt-2 text-sm text-brand-mint">
                          → {row.target_path}
                        </p>
                        <p className="mt-1 text-xs text-white/40">
                          {row.click_count} clicks · updated {dateTime(row.updated_at)}
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => void copyText(adUrl)}
                          className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-3 py-2 text-sm hover:bg-white/10"
                        >
                          <Copy className="h-4 w-4" />
                          Copy ad URL
                        </button>
                        <a
                          href={`${adUrl}?utm_source=test`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-3 py-2 text-sm hover:bg-white/10"
                        >
                          <ExternalLink className="h-4 w-4" />
                          Test
                        </a>
                        <button
                          onClick={() => startEdit(row)}
                          className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-3 py-2 text-sm hover:bg-white/10"
                        >
                          <Pencil className="h-4 w-4" />
                          Edit
                        </button>
                        <button
                          onClick={() => void removeRedirect(row.slug)}
                          className="inline-flex items-center gap-2 rounded-xl border border-red-400/20 px-3 py-2 text-sm text-red-200 hover:bg-red-500/10"
                        >
                          <Trash2 className="h-4 w-4" />
                          Delete
                        </button>
                      </div>
                    </div>

                    <div className="mt-4 rounded-2xl bg-black/30 px-4 py-3 text-sm text-white/70">
                      <span className="text-white/40">Ad URL:</span> {adUrl}
                    </div>

                    {isEditing ? (
                      <div className="mt-4 grid gap-3 md:grid-cols-4">
                        <select
                          value={editTarget}
                          onChange={(e) => setEditTarget(e.target.value)}
                          className="rounded-2xl border border-white/10 bg-white px-4 py-3 text-brand-charcoal md:col-span-2"
                        >
                          {REDIRECT_TARGET_OPTIONS.map((option) => (
                            <option key={option.path} value={option.path}>
                              {option.label} — {option.path}
                            </option>
                          ))}
                        </select>
                        <input
                          value={editLabel}
                          onChange={(e) => setEditLabel(e.target.value)}
                          placeholder="Label"
                          className="rounded-2xl border border-white/10 bg-white px-4 py-3 text-brand-charcoal"
                        />
                        <label className="flex items-center gap-2 rounded-2xl border border-white/10 px-4 py-3 text-sm">
                          <input
                            type="checkbox"
                            checked={editActive}
                            onChange={(e) => setEditActive(e.target.checked)}
                          />
                          Active
                        </label>
                        <button
                          onClick={() => void saveEdit(row.slug)}
                          className="md:col-span-4 rounded-2xl bg-brand-gold px-5 py-3 font-bold text-brand-dark"
                        >
                          Save changes
                        </button>
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
