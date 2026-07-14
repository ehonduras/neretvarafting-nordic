import type { AppLocale } from "@/i18n/routing";
import { siteConfig } from "@/lib/site-config";

type LocaleCurrency = {
  primary: (priceEur: number) => string;
  secondary: (priceEur: number) => string;
};

const CURRENCY: Record<AppLocale, LocaleCurrency> = {
  en: {
    primary: (priceEur) => `${priceEur} €`,
    secondary: (priceEur) => `${priceEur * 2} KM`,
  },
  sv: {
    primary: (priceEur) => `${Math.round(priceEur * 11)} kr`,
    secondary: (priceEur) => `${priceEur} €`,
  },
  da: {
    primary: (priceEur) => `${Math.round(priceEur * 7.4)} kr`,
    secondary: (priceEur) => `${priceEur} €`,
  },
  nb: {
    primary: (priceEur) => `${Math.round(priceEur * 10)} kr`,
    secondary: (priceEur) => `${priceEur} €`,
  },
};

export type FormattedPrice = {
  primary: string;
  secondary: string;
};

/** All-inclusive full-day price — used for hero/CTA "from" messaging. */
export function featuredPriceEur(): number {
  const pkg = siteConfig.packages.find((p) => p.id === "full-inclusive");
  return pkg?.priceEur ?? 50;
}

export function formatPrice(
  locale: AppLocale,
  priceEur: number,
): FormattedPrice {
  const { primary, secondary } = CURRENCY[locale];
  return {
    primary: primary(priceEur),
    secondary: secondary(priceEur),
  };
}
