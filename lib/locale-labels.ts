import type { AppLocale } from "@/i18n/routing";

/** Shared labels for language selection UI (root picker, headers, etc.). */
export const localePickerLabels: Record<
  AppLocale,
  { flag: string; code: string; name: string }
> = {
  sv: { flag: "🇸🇪", code: "SV", name: "Svenska" },
  da: { flag: "🇩🇰", code: "DA", name: "Dansk" },
  nb: { flag: "🇳🇴", code: "NB", name: "Norsk (bokmål)" },
};
