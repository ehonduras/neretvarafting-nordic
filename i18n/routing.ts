import { defineRouting } from "next-intl/routing";

export const locales = ["sv", "da", "nb"] as const;

export type AppLocale = (typeof locales)[number];

export const routing = defineRouting({
  locales: [...locales],
  defaultLocale: "sv",
  localePrefix: "always",
});
