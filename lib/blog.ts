import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import type { AppLocale } from "@/i18n/routing";

export type BlogPost = {
  slug: string;
  locale: AppLocale;
  title: string;
  description: string;
  date: string;
  body: string;
  faqItems: { q: string; a: string }[];
};

function contentDir(locale: string) {
  return path.join(process.cwd(), "content", "blog", locale);
}

export function getPostSlugs(locale: AppLocale): string[] {
  const dir = contentDir(locale);
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".md"))
    .map((f) => f.replace(/\.md$/, ""));
}

export function getPost(locale: AppLocale, slug: string): BlogPost | null {
  const file = path.join(contentDir(locale), `${slug}.md`);
  if (!fs.existsSync(file)) return null;
  const raw = fs.readFileSync(file, "utf8");
  const { data, content } = matter(raw);
  const faqRaw = data.faqItems;
  const faqItems = Array.isArray(faqRaw)
    ? faqRaw.map((item: { q?: string; a?: string }) => ({
        q: String(item.q ?? ""),
        a: String(item.a ?? ""),
      }))
    : [];
  return {
    slug,
    locale,
    title: String(data.title ?? slug),
    description: String(data.description ?? ""),
    date: String(data.date ?? new Date().toISOString().slice(0, 10)),
    body: content.trim(),
    faqItems,
  };
}

export function getAllPosts(locale: AppLocale): BlogPost[] {
  return getPostSlugs(locale)
    .map((slug) => getPost(locale, slug))
    .filter((p): p is BlogPost => p !== null)
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}
