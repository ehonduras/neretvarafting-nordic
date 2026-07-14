import type { MetadataRoute } from "next";
import { locales, routing } from "@/i18n/routing";
import { getPost, getPostSlugs } from "@/lib/blog";
import { getSiteUrl } from "@/lib/site-config";
import type { AppLocale } from "@/i18n/routing";

const staticPages = ["", "booking", "about", "gallery", "blog"] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const site = getSiteUrl();
  const buildLastModified = new Date();
  const entries: MetadataRoute.Sitemap = [];

  for (const page of staticPages) {
    const languages: Record<string, string> = {};
    for (const locale of locales) {
      const path = page ? `/${locale}/${page}` : `/${locale}`;
      languages[locale] = `${site}${path}`;
    }
    languages["x-default"] = `${site}/${routing.defaultLocale}${page ? `/${page}` : ""}`;

    for (const locale of locales) {
      const path = page ? `/${locale}/${page}` : `/${locale}`;
      entries.push({
        url: `${site}${path}`,
        lastModified: buildLastModified,
        alternates: { languages },
      });
    }
  }

  const slugLocales = new Map<string, AppLocale[]>();
  for (const locale of locales) {
    for (const slug of getPostSlugs(locale as AppLocale)) {
      const arr = slugLocales.get(slug) ?? [];
      arr.push(locale as AppLocale);
      slugLocales.set(slug, arr);
    }
  }

  for (const [slug, slugLocs] of slugLocales) {
    const languages: Record<string, string> = {};
    for (const loc of slugLocs) {
      languages[loc] = `${site}/${loc}/blog/${slug}`;
    }
    languages["x-default"] =
      languages[routing.defaultLocale] ?? Object.values(languages)[0]!;

    for (const loc of slugLocs) {
      const post = getPost(loc, slug);
      const lastModified = post?.date ? new Date(post.date) : buildLastModified;
      entries.push({
        url: `${site}/${loc}/blog/${slug}`,
        lastModified,
        alternates: { languages },
      });
    }
  }

  return entries;
}
