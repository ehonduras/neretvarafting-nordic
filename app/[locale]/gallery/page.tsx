import Link from "next/link";
import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { buildPageMetadata } from "@/lib/seo";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbJsonLd, imageGalleryJsonLd } from "@/lib/schema";
import { lp } from "@/lib/locale-path";
import { getGalleryImages, urlFor } from "@/lib/sanity";
import { getSiteUrl } from "@/lib/site-config";
import type { AppLocale } from "@/i18n/routing";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "gallery" });
  return buildPageMetadata({
    locale: locale as AppLocale,
    page: "gallery",
    title: t("metaTitle"),
    description: t("metaDescription"),
  });
}

const placeholders = [
  { label: "Canyon", src: "/images/gallery-canyon.jpg" },
  { label: "Action", src: "/images/gallery-action.jpg" },
  { label: "BBQ beach", src: "/images/gallery-bbq.jpg" },
  { label: "Team", src: "/images/gallery-team.jpg" },
  { label: "Equipment", src: "/images/gallery-gear.jpg" },
  { label: "Emerald water", src: "/images/gallery-water.jpg" },
];

export default async function GalleryPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const loc = locale as AppLocale;
  const t = await getTranslations({ locale, namespace: "gallery" });
  const nav = await getTranslations({ locale, namespace: "nav" });

  const sanityImages = await getGalleryImages();
  const useSanity = sanityImages.length > 0;

  const items = useSanity
    ? sanityImages.map((img) => ({
        key: img._key,
        label: img.label,
        src: urlFor(img.image).width(800).quality(80).auto("format").url(),
      }))
    : placeholders.map((p) => ({ key: p.label, ...p }));

  const crumbs = breadcrumbJsonLd(
    [
      { name: nav("home"), path: "" },
      { name: nav("gallery"), path: "/gallery" },
    ],
    loc,
  );

  const site = getSiteUrl();
  const galleryLd = imageGalleryJsonLd({
    locale: loc,
    name: t("h1"),
    description: t("lead"),
    images: items.map((it) => ({
      url: it.src.startsWith("http") ? it.src : `${site}${it.src}`,
      caption: `${it.label} — Neretva rafting`,
    })),
  });

  return (
    <>
      <JsonLd data={crumbs} />
      <JsonLd data={galleryLd} />
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <p className="text-xs font-bold uppercase tracking-[0.25em] text-emerald">
          {nav("gallery")}
        </p>
        <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
          {t("h1")}
        </h1>
        <p className="mt-4 max-w-2xl text-ink-secondary">{t("lead")}</p>
        <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((p) => (
            <li
              key={p.key}
              className="group relative overflow-hidden rounded-xl border border-border"
            >
              <div className="aspect-[4/3] bg-surface-raised">
                <Image
                  src={p.src}
                  alt={`${p.label} — Neretva rafting`}
                  fill
                  className="object-cover transition duration-300 group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
              </div>
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/80 to-transparent px-4 pb-3 pt-10">
                <span className="text-sm font-bold text-white">{p.label}</span>
              </div>
            </li>
          ))}
        </ul>
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
