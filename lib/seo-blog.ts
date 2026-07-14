import type { Metadata } from "next";
import type { AppLocale } from "@/i18n/routing";
import { locales, routing } from "@/i18n/routing";
import { getPostSlugs } from "@/lib/blog";
import { getSiteUrl } from "@/lib/site-config";
import { ogLocale } from "@/lib/seo";

export function buildBlogArticleMetadata(input: {
  locale: AppLocale;
  slug: string;
  title: string;
  description: string;
  publishedTime: string;
}): Metadata {
  const site = getSiteUrl();
  const path = `/${input.locale}/blog/${input.slug}`;
  const url = `${site}${path}`;

  const languages: Record<string, string> = {};
  for (const loc of locales) {
    if (getPostSlugs(loc).includes(input.slug)) {
      languages[loc] = `${site}/${loc}/blog/${input.slug}`;
    }
  }
  const defaultLang = languages[routing.defaultLocale];
  if (defaultLang) {
    languages["x-default"] = defaultLang;
  } else {
    const first = Object.values(languages)[0];
    if (first) languages["x-default"] = first;
  }

  return {
    title: input.title,
    description: input.description,
    alternates: {
      canonical: url,
      languages,
    },
    openGraph: {
      type: "article",
      locale: ogLocale(input.locale),
      url,
      siteName: "Neretva Rafting Konjic",
      title: input.title,
      description: input.description,
      publishedTime: input.publishedTime,
      images: [{ url: `${site}/opengraph-image`, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: input.title,
      description: input.description,
      images: [`${site}/opengraph-image`],
    },
  };
}
