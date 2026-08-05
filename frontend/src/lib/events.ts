export function generateEventId(eventName: string): string {
  const rand = typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2);
  return `${eventName}_${Date.now()}_${rand}`;
}

export function generateSessionId(): string {
  if (typeof window === "undefined") return "ssr";
  const key = "msnd_session";
  let id = sessionStorage.getItem(key);
  if (!id) {
    id = `sess_${Date.now()}_${crypto.randomUUID?.() ?? Math.random().toString(36).slice(2)}`;
    sessionStorage.setItem(key, id);
  }
  return id;
}
