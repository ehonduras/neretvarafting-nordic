import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { buildBlogArticleMetadata } from "@/lib/seo-blog";
import { JsonLd } from "@/components/JsonLd";
import { articleJsonLd, breadcrumbJsonLd, faqPageJsonLd } from "@/lib/schema";
import { MarkdownBody } from "@/components/MarkdownBody";
import { getPost, getPostSlugs } from "@/lib/blog";
import { locales } from "@/i18n/routing";
import { lp } from "@/lib/locale-path";
import type { AppLocale } from "@/i18n/routing";
import { getCtaImage, urlFor } from "@/lib/sanity";

type Props = { params: Promise<{ locale: string; slug: string }> };

export function generateStaticParams() {
  const out: { locale: string; slug: string }[] = [];
  for (const locale of locales) {
    for (const slug of getPostSlugs(locale)) {
      out.push({ locale, slug });
    }
  }
  return out;
}

export async function generateMetadata({ params }: Props) {
  const { locale, slug } = await params;
  const loc = locale as AppLocale;
  const post = getPost(loc, slug);
  if (!post) return {};
  return buildBlogArticleMetadata({
    locale: loc,
    slug,
    title: post.title,
    description: post.description,
    publishedTime: post.date,
  });
}

export default async function BlogPostPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const loc = locale as AppLocale;
  const post = getPost(loc, slug);
  if (!post) notFound();

  const nav = await getTranslations({ locale, namespace: "nav" });
  const blog = await getTranslations({ locale, namespace: "blog" });

  const crumbs = breadcrumbJsonLd(
    [
      { name: nav("home"), path: "" },
      { name: nav("blog"), path: "/blog" },
      { name: post.title, path: `/blog/${slug}` },
    ],
    loc,
  );

  const articleLd = articleJsonLd({
    locale: loc,
    slug,
    title: post.title,
    description: post.description,
    datePublished: post.date,
  });

  const faqLd =
    post.faqItems.length > 0
      ? faqPageJsonLd(
          post.faqItems.map((item) => ({
            question: item.q,
            answer: item.a,
          })),
        )
      : null;

  const other = getPostSlugs(loc)
    .filter((s) => s !== slug)
    .slice(0, 2);

  const ctaImg = await getCtaImage();
  const ctaBgSrc = ctaImg?.image
    ? urlFor(ctaImg.image).width(1920).quality(75).auto("format").url()
    : null;

  return (
    <>
      <JsonLd data={crumbs} />
      <JsonLd data={articleLd} />
      {faqLd ? <JsonLd data={faqLd} /> : null}

      {/* ── Hero banner ── */}
      <div className="border-b border-border bg-surface-alt">
        <div className="mx-auto max-w-5xl px-4 pb-12 pt-16 sm:px-6 lg:px-8">
          <Link
            href={lp(loc, "/blog")}
            className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-widest text-emerald transition hover:text-emerald-dark"
          >
            <svg viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5">
              <path fillRule="evenodd" d="M17 10a.75.75 0 01-.75.75H5.612l4.158 3.96a.75.75 0 11-1.04 1.08l-5.5-5.25a.75.75 0 010-1.08l5.5-5.25a.75.75 0 111.04 1.08L5.612 9.25H16.25A.75.75 0 0117 10z" clipRule="evenodd" />
            </svg>
            {blog("h1")}
          </Link>
          <h1 className="mt-6 text-3xl font-bold leading-tight tracking-tight text-ink sm:text-4xl lg:text-[2.75rem]">
            {post.title}
          </h1>
          <p className="mt-4 text-base leading-relaxed text-ink-secondary sm:text-lg">
            {post.description}
          </p>
          <time className="mt-6 block text-xs font-semibold text-ink-muted">
            {new Date(post.date).toLocaleDateString("en-GB", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </time>
        </div>
      </div>

      {/* ── Article body ── */}
      <article className="mx-auto max-w-5xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="prose prose-base max-w-none prose-headings:mt-10 prose-headings:mb-4 prose-headings:text-lg prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-ink prose-h2:border-b prose-h2:border-border prose-h2:pb-3 prose-p:leading-[1.8] prose-p:text-ink-secondary prose-a:font-semibold prose-a:text-emerald-dark prose-a:underline prose-a:decoration-emerald/30 prose-a:underline-offset-2 hover:prose-a:decoration-emerald prose-strong:text-ink prose-blockquote:border-l-2 prose-blockquote:border-emerald prose-blockquote:pl-5 prose-blockquote:italic prose-blockquote:text-ink-secondary prose-li:text-ink-secondary prose-li:leading-[1.8] prose-table:overflow-hidden prose-table:rounded-xl prose-table:border prose-table:border-border prose-th:bg-surface-alt prose-th:px-4 prose-th:py-3 prose-th:text-left prose-th:text-xs prose-th:font-bold prose-th:uppercase prose-th:tracking-wide prose-th:text-ink prose-td:border-t prose-td:border-border prose-td:px-4 prose-td:py-3 prose-td:text-sm prose-td:text-ink-secondary prose-hr:border-border prose-img:rounded-xl">
          <MarkdownBody content={post.body} campaign={`blog_${slug.replace(/-/g, "_")}`} />
        </div>

        {/* ── FAQ ── */}
        {post.faqItems.length > 0 && (
          <section className="mt-14 border-t border-border pt-10">
            <h2 className="text-lg font-bold tracking-tight text-ink">FAQ</h2>
            <dl className="mt-6 divide-y divide-border">
              {post.faqItems.map((item) => (
                <div key={item.q} className="py-5">
                  <dt className="text-sm font-bold text-ink">{item.q}</dt>
                  <dd className="mt-2 text-sm leading-relaxed text-ink-secondary">
                    {item.a}
                  </dd>
                </div>
              ))}
            </dl>
          </section>
        )}

        {/* ── Related ── */}
        {other.length > 0 && (
          <section className="mt-14 border-t border-border pt-10">
            <p className="text-xs font-bold uppercase tracking-widest text-ink-muted">
              {blog("readMore")}
            </p>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {other.map((s) => {
                const p = getPost(loc, s);
                if (!p) return null;
                return (
                  <Link
                    key={s}
                    href={lp(loc, `/blog/${s}`)}
                    className="group rounded-xl border border-border p-5 transition hover:border-emerald/40 hover:shadow-lg hover:shadow-emerald/5"
                  >
                    <p className="text-sm font-bold text-ink group-hover:text-emerald-dark">
                      {p.title}
                    </p>
                    <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-ink-muted">
                      {p.description}
                    </p>
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        {/* ── CTA ── */}
        <div className="relative mt-14 overflow-hidden rounded-2xl text-center text-white">
          {ctaBgSrc ? (
            <>
              <Image
                src={ctaBgSrc}
                alt={ctaImg?.alt ?? ""}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 1024px"
              />
              <div className="absolute inset-0 bg-emerald-deep/80" />
            </>
          ) : (
            <div className="absolute inset-0 bg-emerald-deep" />
          )}
          <div className="relative p-8 sm:p-10">
            <p className="text-lg font-bold">
              {nav("booking")}
            </p>
            <div className="mt-5 flex flex-wrap justify-center gap-3">
              <Link
                href={lp(loc, "/booking")}
                className="rounded-lg bg-white px-5 py-2.5 text-sm font-bold text-emerald-deep transition hover:bg-emerald-tint"
              >
                {nav("booking")}
              </Link>
              <Link
                href={lp(loc, "/")}
                className="rounded-lg border border-white/30 px-5 py-2.5 text-sm font-bold transition hover:bg-white/10"
              >
                {nav("home")}
              </Link>
            </div>
          </div>
        </div>
      </article>
    </>
  );
}
