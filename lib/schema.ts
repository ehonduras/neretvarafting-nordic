import { siteConfig, getSiteUrl } from "@/lib/site-config";
import { locales, type AppLocale } from "@/i18n/routing";

export type AggregateRatingInput = {
  ratingValue: number | string;
  reviewCount: number | string;
};

function aggregateRating(input?: AggregateRatingInput) {
  if (!input) return null;
  return {
    "@type": "AggregateRating",
    ratingValue: String(input.ratingValue),
    reviewCount: String(input.reviewCount),
    bestRating: "5",
  };
}

export function localBusinessJsonLd(
  locale: AppLocale,
  rating?: AggregateRatingInput,
) {
  const url = getSiteUrl();
  const operatorGbpUrl = process.env.NEXT_PUBLIC_OPERATOR_GBP_URL?.trim();

  const sameAs: string[] = [];
  if (operatorGbpUrl) sameAs.push(operatorGbpUrl);

  const descriptions: Record<AppLocale, string> = {
    sv: "Neretva-rafting i Konjic, Bosnien och Hercegovina — IRF-certifierade guider, heldags- och halvdagsturer.",
    da: "Neretva-rafting i Konjic, Bosnien-Hercegovina — IRF-certificerede guider, heldags- og halvdagsture.",
    nb: "Neretva-rafting i Konjic, Bosnia-Hercegovina — IRF-sertifiserte guider, heldags- og halvdagsturer.",
  };

  const base: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": ["LocalBusiness", "SportsActivityLocation"],
    "@id": `${url}/#business`,
    name: siteConfig.businessName,
    description: descriptions[locale],
    url: `${url}/${locale}`,
    image: `${url}/opengraph-image`,
    telephone: siteConfig.contact.phone,
    email: siteConfig.contact.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: siteConfig.address.streetAddress,
      addressLocality: siteConfig.address.addressLocality,
      addressRegion: siteConfig.address.addressRegion,
      postalCode: siteConfig.address.postalCode,
      addressCountry: siteConfig.address.addressCountry,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: siteConfig.geo.latitude,
      longitude: siteConfig.geo.longitude,
    },
    areaServed: [
      "Konjic",
      "Sarajevo",
      "Mostar",
      "Dubrovnik",
      "Bosnia and Herzegovina",
    ],
    knowsLanguage: [...locales],
    priceRange: "€€",
    currenciesAccepted: "BAM, EUR",
    paymentAccepted: siteConfig.payment.methods.join(", "),
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
      opens: "08:00",
      closes: "18:00",
      validFrom: siteConfig.season.validFrom,
      validThrough: siteConfig.season.validThrough,
    },
  };

  if (sameAs.length > 0) {
    base.sameAs = sameAs;
  }

  const rated = aggregateRating(rating);
  if (rated) base.aggregateRating = rated;

  return base;
}

/** Speakable spec for the homepage only — selectors target homepage sections. */
export function homepageSpeakableJsonLd(locale: AppLocale) {
  const url = getSiteUrl();
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${url}/${locale}#webpage`,
    url: `${url}/${locale}`,
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: ["h1", ".hero-hook", ".operator-body"],
    },
  };
}

type Package = (typeof siteConfig.packages)[number];

export function tourPackageJsonLd(input: {
  locale: AppLocale;
  pkg: Package;
  name: string;
  description: string;
  rating?: AggregateRatingInput;
}) {
  const site = getSiteUrl();

  const base: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "TouristTrip",
    "@id": `${site}/#package-${input.pkg.id}`,
    name: input.name,
    description: input.description,
    url: `${site}/${input.locale}/booking`,
    image: `${site}/opengraph-image`,
    touristType: ["Adventure travelers", "Families"],
    itinerary: {
      "@type": "TouristAttraction",
      name: "Neretva canyon — Glavatičevo to Džajići",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Konjic",
        addressRegion: "Herzegovina-Neretva Canton",
        addressCountry: "BA",
      },
    },
    provider: { "@id": `${site}/#business` },
    offers: {
      "@type": "Offer",
      price: String(input.pkg.priceEur),
      priceCurrency: "EUR",
      availability: "https://schema.org/InStock",
      validFrom: siteConfig.season.validFrom,
      validThrough: siteConfig.season.validThrough,
      areaServed: ["Konjic", "Sarajevo", "Mostar"],
      url: `${site}/${input.locale}/booking`,
    },
  };

  const rated = aggregateRating(input.rating);
  if (rated) base.aggregateRating = rated;

  return base;
}

export function imageGalleryJsonLd(input: {
  locale: AppLocale;
  name: string;
  description: string;
  images: { url: string; caption: string }[];
}) {
  const site = getSiteUrl();
  return {
    "@context": "https://schema.org",
    "@type": "ImageGallery",
    "@id": `${site}/${input.locale}/gallery#gallery`,
    name: input.name,
    description: input.description,
    url: `${site}/${input.locale}/gallery`,
    associatedMedia: input.images.map((img) => ({
      "@type": "ImageObject",
      contentUrl: img.url,
      caption: img.caption,
      name: img.caption,
    })),
  };
}

export function faqPageJsonLd(
  items: readonly { question: string; answer: string }[],
) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

export function breadcrumbJsonLd(
  items: { name: string; path: string }[],
  locale: AppLocale,
) {
  const site = getSiteUrl();
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${site}/${locale}${item.path}`,
    })),
  };
}

export function articleJsonLd(input: {
  locale: AppLocale;
  slug: string;
  title: string;
  description: string;
  datePublished: string;
  dateModified?: string;
}) {
  const site = getSiteUrl();
  const url = `${site}/${input.locale}/blog/${input.slug}`;
  const ogImage = `${site}/opengraph-image`;
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: input.title,
    description: input.description,
    image: [ogImage],
    url,
    datePublished: input.datePublished,
    dateModified: input.dateModified ?? input.datePublished,
    author: {
      "@type": "Organization",
      name: siteConfig.businessName,
      url: site,
    },
    publisher: {
      "@type": "Organization",
      name: siteConfig.businessName,
      url: site,
      logo: {
        "@type": "ImageObject",
        url: ogImage,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
  };
}
