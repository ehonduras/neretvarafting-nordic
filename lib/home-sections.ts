import type { AppLocale } from "@/i18n/routing";

export type HomeSectionId =
  | "hero"
  | "offers"
  | "day"
  | "operator"
  | "safety"
  | "pricing"
  | "gettingHere"
  | "reviews"
  | "faq"
  | "cta";

/** Nordic markets: safety and trust before price. */
const nordicOrder: HomeSectionId[] = [
  "hero",
  "safety",
  "operator",
  "day",
  "offers",
  "pricing",
  "reviews",
  "gettingHere",
  "faq",
  "cta",
];

export function getHomeSectionOrder(_locale: AppLocale): HomeSectionId[] {
  return nordicOrder;
}
