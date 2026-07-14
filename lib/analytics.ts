type GtagFn = (...args: unknown[]) => void;

/** GA4 names — mark as conversions in GA4, then import into Google Ads. */
export type AnalyticsEvent =
  | "whatsapp_click"
  | "phone_click"
  | "email_click"
  | "booking_form_submit"
  | "book_cta_click"
  | "outbound_click";

export function trackEvent(
  name: AnalyticsEvent,
  params: Record<string, string | number | undefined> = {},
): void {
  if (typeof window === "undefined") return;
  const w = window as unknown as { gtag?: GtagFn; dataLayer?: unknown[] };
  const cleaned: Record<string, string | number> = {};
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== "") cleaned[k] = v;
  }
  if (typeof w.gtag === "function") {
    w.gtag("event", name, cleaned);
  } else if (Array.isArray(w.dataLayer)) {
    w.dataLayer.push({ event: name, ...cleaned });
  }
}
