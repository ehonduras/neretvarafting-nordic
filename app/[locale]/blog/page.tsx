import Link from "next/link";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { buildPageMetadata } from "@/lib/seo";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbJsonLd } from "@/lib/schema";
import { getAllPosts } from "@/lib/blog";
import { lp } from "@/lib/locale-path";
import type { AppLocale } from "@/i18n/routing";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "blog" });
  return buildPageMetadata({
    locale: locale as AppLocale,
    page: "blog",
    title: t("metaTitle"),
    description: t("metaDescription"),
  });
}

export default async function BlogIndexPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const loc = locale as AppLocale;
  const t = await getTranslations({ locale, namespace: "blog" });
  const nav = await getTranslations({ locale, namespace: "nav" });
  const posts = getAllPosts(loc);

  const crumbs = breadcrumbJsonLd(
    [
      { name: nav("home"), path: "" },
      { name: nav("blog"), path: "/blog" },
    ],
    loc,
  );

  return (
    <>
      <JsonLd data={crumbs} />
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <p className="text-xs font-bold uppercase tracking-[0.25em] text-emerald">
          {nav("blog")}
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-ink sm:text-4xl">
          {t("h1")}
        </h1>
        <p className="mt-4 text-ink-secondary">{t("lead")}</p>
        <ul className="mt-12 space-y-5">
          {posts.map((post) => (
            <li
              key={post.slug}
              className="rounded-xl border border-border bg-surface p-6 transition hover:border-emerald/40 hover:shadow-lg hover:shadow-emerald/5"
            >
              <p className="text-[10px] font-bold uppercase tracking-widest text-ink-muted">
                {post.date}
              </p>
              <h2 className="mt-2 text-xl font-bold tracking-tight text-ink">
                <Link href={lp(loc, `/blog/${post.slug}`)} className="hover:text-emerald-dark">
                  {post.title}
                </Link>
              </h2>
              <p className="mt-2 text-sm text-ink-secondary">{post.description}</p>
              <p className="mt-4">
                <Link
                  href={lp(loc, `/blog/${post.slug}`)}
                  className="text-sm font-bold text-emerald-dark hover:text-emerald"
                >
                  {t("readMore")} →
                </Link>
              </p>
            </li>
          ))}
        </ul>
        {posts.length === 0 ? (
          <p className="mt-8 text-sm text-ink-muted">No posts in this language yet.</p>
        ) : null}
        <p className="mt-12">
          <Link
            href={lp(loc, "/booking")}
            className="rounded-lg bg-emerald px-5 py-2.5 text-sm font-bold text-white transition hover:bg-emerald-dark"
          >
            {nav("booking")}
          </Link>
        </p>
      </div>
    </>
  );
}
