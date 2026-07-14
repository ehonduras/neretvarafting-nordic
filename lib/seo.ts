import type { Metadata } from "next";
import type { AppLocale } from "@/i18n/routing";
import { locales } from "@/i18n/routing";
import { getSiteUrl } from "@/lib/site-config";

export type LocalizedPath =
  | ""
  | "booking"
  | "about"
  | "gallery"
  | "blog"
  | `blog/${string}`;

const OG_LOCALE_MAP: Record<AppLocale, string> = {
  sv: "sv_SE",
  da: "da_DK",
  nb: "nb_NO",
};

export function ogLocale(locale: AppLocale): string {
  return OG_LOCALE_MAP[locale] ?? locale;
}

export function pathForLocale(locale: AppLocale, page: LocalizedPath): string {
  if (!page) return `/${locale}`;
  return `/${locale}/${page}`;
}

export function alternateLanguages(
  page: LocalizedPath,
): Record<string, string> {
  const site = getSiteUrl();
  const map: Record<string, string> = {};
  for (const locale of locales) {
    map[locale] = `${site}${pathForLocale(locale, page)}`;
  }
  map["x-default"] = `${site}/sv${page ? `/${page}` : ""}`;
  return map;
}

export function buildPageMetadata(input: {
  locale: AppLocale;
  page: LocalizedPath;
  title: string;
  description: string;
}): Metadata {
  const { locale, page, title, description } = input;
  const site = getSiteUrl();
  const path = pathForLocale(locale, page);
  const url = `${site}${path}`;
  const languages = alternateLanguages(page);

  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages,
    },
    openGraph: {
      type:
        page === "blog" || page.startsWith("blog/") ? "article" : "website",
      locale: ogLocale(locale),
      url,
      siteName: "Neretva Rafting Konjic",
      title,
      description,
      images: [{ url: `${site}/opengraph-image`, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`${site}/opengraph-image`],
    },
  };
}
