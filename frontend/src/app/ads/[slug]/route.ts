import { NextRequest, NextResponse } from "next/server";
import { SITE } from "@/content/site";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function backendBaseUrl(): string {
  return (
    process.env.BACKEND_API_URL ||
    process.env.API_BASE_URL ||
    "http://localhost:8000"
  ).replace(/\/$/, "");
}

function publicSiteOrigin(): string {
  return (process.env.NEXT_PUBLIC_SITE_URL || SITE.url).replace(/\/$/, "");
}

function redirectToPath(targetPath: string, searchParams: URLSearchParams): NextResponse {
  const path = targetPath.startsWith("/") ? targetPath : `/${targetPath}`;
  const destination = new URL(path, publicSiteOrigin());
  searchParams.forEach((value, key) => destination.searchParams.set(key, value));
  return NextResponse.redirect(destination, 302);
}

function notFoundResponse(slug: string): NextResponse {
  const html = `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>رابط غير موجود</title>
  <style>
    body { font-family: system-ui, sans-serif; background: #071615; color: #fff; margin: 0; min-height: 100vh; display: grid; place-items: center; padding: 24px; }
    .card { max-width: 520px; background: rgba(255,255,255,.08); border: 1px solid rgba(255,255,255,.12); border-radius: 24px; padding: 32px; }
    h1 { margin: 0 0 12px; font-size: 1.5rem; }
    p { margin: 0 0 10px; color: rgba(255,255,255,.75); line-height: 1.6; }
    code { background: rgba(0,0,0,.25); padding: 2px 8px; border-radius: 8px; }
    a { color: #7dd3c0; }
  </style>
</head>
<body>
  <div class="card">
    <h1>رابط الإعلان غير موجود</h1>
    <p>الـ slug <code>${slug}</code> غير مسجّل في Redirect Manager.</p>
    <p>أنشئه من <a href="/redirecmysanad">/redirecmysanad</a> ثم اختبر نفس الـ slug.</p>
  </div>
</body>
</html>`;

  return new NextResponse(html, {
    status: 404,
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } },
) {
  const slug = params.slug.trim().toLowerCase();
  const lookup = await fetch(`${backendBaseUrl()}/redirects/public/${encodeURIComponent(slug)}`, {
    cache: "no-store",
  });

  if (!lookup.ok) {
    return notFoundResponse(slug);
  }

  const data = (await lookup.json()) as { target_path: string };
  return redirectToPath(data.target_path, request.nextUrl.searchParams);
}
