import { NextRequest, NextResponse } from "next/server";

function backendBaseUrl(): string {
  return (
    process.env.BACKEND_API_URL ||
    process.env.API_BASE_URL ||
    "http://localhost:8000"
  ).replace(/\/$/, "");
}

export async function proxyToBackend(
  path: string,
  req: NextRequest,
  method = "POST",
  bodyOverride?: string,
): Promise<NextResponse> {
  const url = `${backendBaseUrl()}${path}`;
  const headers = new Headers();

  const contentType = req.headers.get("content-type");
  if (contentType) headers.set("Content-Type", contentType);

  const auth = req.headers.get("authorization");
  if (auth) headers.set("Authorization", auth);

  for (const name of ["cf-connecting-ip", "x-forwarded-for", "x-real-ip", "user-agent"]) {
    const value = req.headers.get(name);
    if (value) headers.set(name, value);
  }

  const body =
    bodyOverride ??
    (method === "GET" || method === "HEAD" ? undefined : await req.text());

  const res = await fetch(url, { method, headers, body });
  const text = await res.text();

  return new NextResponse(text, {
    status: res.status,
    headers: {
      "Content-Type": res.headers.get("content-type") || "application/json",
    },
  });
}
