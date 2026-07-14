import Link from "next/link";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { buildPageMetadata } from "@/lib/seo";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbJsonLd } from "@/lib/schema";
import { lp } from "@/lib/locale-path";
import type { AppLocale } from "@/i18n/routing";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "about" });
  return buildPageMetadata({
    locale: locale as AppLocale,
    page: "about",
    title: t("metaTitle"),
    description: t("metaDescription"),
  });
}

export default async function AboutPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const loc = locale as AppLocale;
  const t = await getTranslations({ locale, namespace: "about" });
  const nav = await getTranslations({ locale, namespace: "nav" });
  const c = await getTranslations({ locale, namespace: "common" });

  const crumbs = breadcrumbJsonLd(
    [
      { name: nav("home"), path: "" },
      { name: nav("about"), path: "/about" },
    ],
    loc,
  );

  return (
    <>
      <JsonLd data={crumbs} />
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <p className="text-xs font-bold uppercase tracking-[0.25em] text-emerald">
          {nav("about")}
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-ink sm:text-4xl">
          {t("h1")}
        </h1>
        <p className="mt-6 whitespace-pre-wrap text-ink-secondary">{t("body")}</p>
        <div className="mt-12 flex gap-3">
          <Link
            href={lp(loc, "/booking")}
            className="rounded-lg bg-emerald px-5 py-2.5 text-sm font-bold text-white transition hover:bg-emerald-dark"
          >
            {nav("booking")}
          </Link>
          <Link
            href={lp(loc, "/blog")}
            className="rounded-lg border border-border bg-surface px-5 py-2.5 text-sm font-bold text-ink transition hover:bg-surface-alt"
          >
            {c("readBlog")}
          </Link>
        </div>
      </div>
    </>
  );
}
