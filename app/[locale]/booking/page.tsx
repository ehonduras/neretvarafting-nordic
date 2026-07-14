import { getTranslations, setRequestLocale } from "next-intl/server";
import { buildPageMetadata } from "@/lib/seo";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbJsonLd } from "@/lib/schema";
import { siteConfig } from "@/lib/site-config";
import { whatsappHref } from "@/lib/whatsapp";
import { BookingForm, type BookingFormCopy } from "@/components/booking/BookingForm";
import { TrackedLink } from "@/components/TrackedLink";
import type { AppLocale } from "@/i18n/routing";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "booking" });
  return buildPageMetadata({
    locale: locale as AppLocale,
    page: "booking",
    title: t("metaTitle"),
    description: t("metaDescription"),
  });
}

export default async function BookingPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const loc = locale as AppLocale;
  const t = await getTranslations({ locale, namespace: "booking" });
  const nav = await getTranslations({ locale, namespace: "nav" });
  const c = await getTranslations({ locale, namespace: "common" });
  const f = await getTranslations({ locale, namespace: "booking.form" });

  const crumbs = breadcrumbJsonLd(
    [
      { name: nav("home"), path: "" },
      { name: nav("booking"), path: "/booking" },
    ],
    loc,
  );

  const copy: BookingFormCopy = {
    title: f("title"),
    intro: f("intro"),
    name: f("name"),
    namePlaceholder: f("namePlaceholder"),
    partySize: f("partySize"),
    partySizePlaceholder: f("partySizePlaceholder"),
    date: f("date"),
    package: f("package"),
    packageFullInclusive: f("packageFullInclusive"),
    packageFullOnly: f("packageFullOnly"),
    packageHalfFamily: f("packageHalfFamily"),
    whatsapp: f("whatsapp"),
    whatsappPlaceholder: f("whatsappPlaceholder"),
    whatsappHelp: f("whatsappHelp"),
    notes: f("notes"),
    notesPlaceholder: f("notesPlaceholder"),
    submit: f("submit"),
    submitting: f("submitting"),
    successTitle: f("successTitle"),
    successBody: f("successBody"),
    successCta: f("successCta"),
    errorTitle: f("errorTitle"),
    errorBody: f("errorBody"),
    errors: {
      name: f("errors.name"),
      partySize: f("errors.partySize"),
      date: f("errors.date"),
      package: f("errors.package"),
      whatsapp: f("errors.whatsapp"),
      notes: f("errors.notes"),
      generic: f("errors.generic"),
    },
  };

  return (
    <>
      <JsonLd data={crumbs} />
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <p className="text-xs font-bold uppercase tracking-[0.25em] text-emerald">
          {nav("booking")}
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-ink sm:text-4xl">
          {t("h1")}
        </h1>
        <p className="mt-4 text-lg text-ink-secondary">{t("lead")}</p>

        <div className="mt-10">
          <BookingForm locale={loc} sourcePage="/booking" copy={copy} />
        </div>

        <div className="mt-12 rounded-xl border border-border bg-surface-alt p-6">
          <p className="text-sm font-bold text-ink">{f("altTitle")}</p>
          <p className="mt-1 text-sm text-ink-secondary">{f("altBody")}</p>
          <div className="mt-5 flex flex-wrap gap-3">
            <TrackedLink
              kind="external"
              href={whatsappHref()}
              event="whatsapp_click"
              eventParams={{ source: "booking_alt", locale: loc }}
              className="rounded-lg bg-emerald px-5 py-2.5 text-sm font-bold text-white transition hover:bg-emerald-dark"
            >
              {c("whatsapp")}
            </TrackedLink>
            <TrackedLink
              kind="anchor"
              href={`tel:${siteConfig.contact.phone}`}
              event="phone_click"
              eventParams={{ source: "booking_alt", locale: loc }}
              className="rounded-lg border border-border bg-surface px-5 py-2.5 text-sm font-bold text-ink transition hover:bg-surface-alt"
            >
              {c("call")}: {siteConfig.contact.phoneDisplay}
            </TrackedLink>
            <TrackedLink
              kind="anchor"
              href={`mailto:${siteConfig.contact.email}`}
              event="email_click"
              eventParams={{ source: "booking_alt", locale: loc }}
              className="rounded-lg border border-border bg-surface px-5 py-2.5 text-sm font-bold text-ink transition hover:bg-surface-alt"
            >
              {c("email")}
            </TrackedLink>
          </div>
        </div>
      </div>
    </>
  );
}
