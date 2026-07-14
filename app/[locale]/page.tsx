import { getTranslations } from "next-intl/server";
import { setRequestLocale } from "next-intl/server";
import { HomeSections } from "@/components/home/HomeSections";
import { getHomeSectionOrder } from "@/lib/home-sections";
import { JsonLd } from "@/components/JsonLd";
import {
  localBusinessJsonLd,
  faqPageJsonLd,
  breadcrumbJsonLd,
  tourPackageJsonLd,
  homepageSpeakableJsonLd,
  type AggregateRatingInput,
} from "@/lib/schema";
import { buildPageMetadata } from "@/lib/seo";
import { getMessages } from "next-intl/server";
import { siteConfig } from "@/lib/site-config";
import { getGoogleReviews } from "@/lib/google-reviews";
import type { AppLocale } from "@/i18n/routing";

const PACKAGE_NAME_KEY: Record<string, "fullInclusive" | "fullOnly" | "half"> = {
  "full-inclusive": "fullInclusive",
  "full-rafting-only": "fullOnly",
  "half-family": "half",
};

const PACKAGE_DESC_KEY: Record<
  string,
  "fullInclusiveDesc" | "fullOnlyDesc" | "halfDesc"
> = {
  "full-inclusive": "fullInclusiveDesc",
  "full-rafting-only": "fullOnlyDesc",
  "half-family": "halfDesc",
};

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  return buildPageMetadata({
    locale: locale as AppLocale,
    page: "",
    title: t("homeTitle"),
    description: t("homeDescription"),
  });
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const loc = locale as AppLocale;
  const order = getHomeSectionOrder(loc);
  const messages = await getMessages();
  const home = messages.home as { faqItems: { q: string; a: string }[] };
  const nav = await getTranslations({ locale, namespace: "nav" });
  const offers = await getTranslations({ locale, namespace: "home.offers" });

  const faqLd = faqPageJsonLd(
    home.faqItems.map((item) => ({
      question: item.q,
      answer: item.a,
    })),
  );

  const reviews = await getGoogleReviews();
  // Only emit aggregateRating when sourced from the live Google Places API.
  // Synthetic / fallback numbers in structured data are flagged by Google
  // and cannot be cross-verified against the Business Profile.
  const rating: AggregateRatingInput | undefined =
    reviews.isLive && reviews.userRatingCount > 0
      ? {
          ratingValue: reviews.rating.toFixed(1),
          reviewCount: reviews.userRatingCount,
        }
      : undefined;

  const bizLd = localBusinessJsonLd(loc, rating);
  const speakableLd = homepageSpeakableJsonLd(loc);
  const crumbs = breadcrumbJsonLd([{ name: nav("home"), path: "" }], loc);

  const tourPackages = siteConfig.packages.map((pkg) =>
    tourPackageJsonLd({
      locale: loc,
      pkg,
      name: offers(PACKAGE_NAME_KEY[pkg.id]),
      description: offers(PACKAGE_DESC_KEY[pkg.id]),
      rating,
    }),
  );

  return (
    <>
      <JsonLd data={bizLd} />
      <JsonLd data={speakableLd} />
      <JsonLd data={faqLd} />
      <JsonLd data={crumbs} />
      {tourPackages.map((tour) => (
        <JsonLd
          key={(tour as Record<string, string>)["@id"]}
          data={tour}
        />
      ))}
      <HomeSections locale={loc} order={order} />
    </>
  );
}
