"use client";

export interface Attribution {
  landingPage: string;
  referrer: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmContent?: string;
  utmTerm?: string;
  fbclid?: string;
  fbc?: string;
  fbp?: string;
  ttclid?: string;
  ttp?: string;
  scclid?: string;
  snaptrCookie?: string;
}

const STORAGE_KEY = "msnd_attribution";

function paramsFromUrl(url: string): URLSearchParams {
  try {
    return new URL(url).searchParams;
  } catch {
    return new URLSearchParams();
  }
}

function attributionFromPage(href: string, referrer: string): Attribution {
  const params = paramsFromUrl(href);

  const attribution: Attribution = {
    landingPage: href,
    referrer,
    utmSource: params.get("utm_source") ?? undefined,
    utmMedium: params.get("utm_medium") ?? undefined,
    utmCampaign: params.get("utm_campaign") ?? undefined,
    utmContent: params.get("utm_content") ?? undefined,
    utmTerm: params.get("utm_term") ?? undefined,
    fbclid: params.get("fbclid") ?? undefined,
    ttclid: params.get("ttclid") ?? undefined,
    scclid: params.get("scclid") ?? params.get("ScCid") ?? undefined,
  };

  attribution.fbp = getCookie("_fbp") ?? undefined;
  attribution.fbc =
    getCookie("_fbc") ??
    (attribution.fbclid ? `fb.1.${Date.now()}.${attribution.fbclid}` : undefined);
  attribution.ttp = getCookie("_ttp") ?? undefined;
  attribution.snaptrCookie = getCookie("_scid") ?? undefined;

  return attribution;
}

function enrichAttribution(prev: Attribution, current: Attribution): Attribution {
  const landingParams = paramsFromUrl(prev.landingPage);
  const next: Attribution = { ...prev };

  const fill = <K extends keyof Attribution>(key: K, value: Attribution[K]) => {
    if (!next[key] && value) next[key] = value;
  };

  fill("utmSource", prev.utmSource ?? current.utmSource ?? landingParams.get("utm_source") ?? undefined);
  fill("utmMedium", prev.utmMedium ?? current.utmMedium ?? landingParams.get("utm_medium") ?? undefined);
  fill("utmCampaign", prev.utmCampaign ?? current.utmCampaign ?? landingParams.get("utm_campaign") ?? undefined);
  fill("utmContent", prev.utmContent ?? current.utmContent ?? landingParams.get("utm_content") ?? undefined);
  fill("utmTerm", prev.utmTerm ?? current.utmTerm ?? landingParams.get("utm_term") ?? undefined);
  fill("fbclid", prev.fbclid ?? current.fbclid ?? landingParams.get("fbclid") ?? undefined);
  fill("ttclid", prev.ttclid ?? current.ttclid ?? landingParams.get("ttclid") ?? undefined);
  fill(
    "scclid",
    prev.scclid ?? current.scclid ?? landingParams.get("scclid") ?? landingParams.get("ScCid") ?? undefined,
  );
  fill("fbc", prev.fbc ?? current.fbc);
  fill("fbp", prev.fbp ?? current.fbp);
  fill("ttp", prev.ttp ?? current.ttp);
  fill("snaptrCookie", prev.snaptrCookie ?? current.snaptrCookie);

  return next;
}

/** First-touch landing URL (with query params) for the session — never overwritten. */
export function captureAttribution(): Attribution {
  if (typeof window === "undefined") {
    return { landingPage: "", referrer: "" };
  }

  const current = attributionFromPage(window.location.href, document.referrer);

  try {
    const existing = sessionStorage.getItem(STORAGE_KEY);
    if (!existing) {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(current));
      return current;
    }

    const prev = JSON.parse(existing) as Attribution;
    const merged = enrichAttribution(prev, current);
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
    return merged;
  } catch {}

  return current;
}

export function getStoredAttribution(): Attribution {
  if (typeof window === "undefined") return { landingPage: "", referrer: "" };
  try {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored) as Attribution;
  } catch {}
  return captureAttribution();
}

function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return parts.pop()!.split(";").shift() ?? null;
  }
  return null;
}
