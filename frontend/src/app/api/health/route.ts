import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const url = process.env.SHEET_WEBHOOK_URL || process.env.GOOGLE_SHEET_WEBHOOK_URL || "";
  return NextResponse.json({
    ok: true,
    service: "mysanad-frontend",
    google_sheet: {
      configured: Boolean(url),
      webhook_url_suffix: url ? url.replace(/\/$/, "").split("/").pop()?.slice(0, 12) : null,
    },
    backend_api: process.env.BACKEND_API_URL || process.env.API_BASE_URL || "http://localhost:8000",
  });
}
