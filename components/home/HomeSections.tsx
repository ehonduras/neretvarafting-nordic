import type { ReactNode } from "react";
import Image from "next/image";
import { getTranslations, getMessages } from "next-intl/server";
import type { AppLocale } from "@/i18n/routing";
import { siteConfig } from "@/lib/site-config";
import { whatsappHref } from "@/lib/whatsapp";
import { lp } from "@/lib/locale-path";
import type { HomeSectionId } from "@/lib/home-sections";
import { getHeroImage, getCtaImage, getGalleryImages, urlFor } from "@/lib/sanity";
import { getGoogleReviews } from "@/lib/google-reviews";
import { formatPrice, featuredPriceEur } from "@/lib/locale-pricing";
import { TrackedLink } from "@/components/TrackedLink";

/* ─── Hero ─── */
async function HeroSection({ locale }: { locale: AppLocale }) {
  const t = await getTranslations("home.hero");
  const hero = await getHeroImage();
  const fromPrice = formatPrice(locale, featuredPriceEur());
  const heroSrc = hero?.image
    ? urlFor(hero.image).width(1920).quality(80).auto("format").url()
    : "/images/hero-canyon.jpg";
  const heroAlt =
    hero?.alt && hero.alt.trim().length > 0
      ? hero.alt
      : "Neretva river canyon near Konjic, Bosnia & Herzegovina";
  return (
    <section className="relative min-h-[85vh] overflow-hidden bg-ink text-white">
      <Image
        src={heroSrc}
        alt={heroAlt}
        fill
        priority
        className="object-cover"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/40 to-ink/10" />
      <div className="relative mx-auto flex max-w-7xl flex-col justify-end px-4 pb-16 pt-40 sm:px-6 sm:pb-20 lg:px-8">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-bright">
          Konjic · Bosnia &amp; Herzegovina
        </p>
        <h1 className="mt-4 max-w-4xl text-4xl font-bold leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl">
          {t("h1")}
        </h1>
        <p className="hero-hook mt-5 max-w-2xl text-lg font-medium text-white/80">
          {t("hook")}
        </p>
        <div className="mt-8 grid w-full max-w-md grid-cols-2 gap-3">
          <TrackedLink
            kind="internal"
            href={lp(locale, "/booking")}
            event="book_cta_click"
            eventParams={{ source: "hero", locale }}
            className="flex items-center justify-center rounded-lg bg-emerald px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-dark"
          >
            {t("cta")}
          </TrackedLink>
          <TrackedLink
            kind="anchor"
            href={`tel:${siteConfig.contact.phone}`}
            event="phone_click"
            eventParams={{ source: "hero", locale }}
            className="flex items-center justify-center rounded-lg border border-white/30 bg-white/5 px-4 py-3 text-sm font-semibold transition hover:border-white/50 hover:bg-white/10"
          >
            {siteConfig.contact.phoneDisplay}
          </TrackedLink>
        </div>
        <dl className="mt-14 grid max-w-4xl grid-cols-2 gap-px overflow-hidden rounded-lg border border-white/15 sm:grid-cols-5">
          {[
            { cap: t("statDistanceCaption"), val: t("statsDistance") },
            { cap: t("statDurationCaption"), val: t("statsDuration") },
            { cap: t("statClassCaption"), val: t("statsClass") },
            { cap: t("statSeasonCaption"), val: t("statsSeason") },
            {
              cap: t("statPriceCaption"),
              val: fromPrice.primary,
              sub: fromPrice.secondary,
            },
          ].map((row) => (
            <div key={row.cap} className="bg-ink/50 px-5 py-4">
              <dt className="text-[10px] font-semibold uppercase tracking-widest text-emerald-bright">
                {row.cap}
              </dt>
              <dd className="mt-1 text-xl font-bold text-white">
                {row.val}
                {"sub" in row && row.sub ? (
                  <span className="mt-0.5 block text-xs font-medium text-white/50">
                    {row.sub}
                  </span>
                ) : null}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

/* ─── Offers ─── */
async function OffersSection() {
  const t = await getTranslations("home.offers");
  const items = [
    { title: t("fullInclusive"), body: t("fullInclusiveDesc") },
    { title: t("fullOnly"), body: t("fullOnlyDesc") },
    { title: t("half"), body: t("halfDesc") },
  ];
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <h2 className="text-2xl font-bold tracking-tight text-ink sm:text-3xl">
        {t("title")}
      </h2>
      <p className="mt-4 max-w-3xl text-ink-secondary">{t("intro")}</p>
      <ul className="mt-10 grid gap-5 md:grid-cols-3">
        {items.map((item) => (
          <li
            key={item.title}
            className="rounded-xl border border-border bg-surface p-6 transition hover:border-emerald/30"
          >
            <h3 className="text-lg font-semibold text-ink">{item.title}</h3>
            <p className="mt-2 text-sm text-ink-secondary">{item.body}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}

/* ─── A Typical Day — 3-step timeline with gallery background ─── */
async function DaySection() {
  const t = await getTranslations("home.day");
  const gallery = await getGalleryImages();
  const bgImage = gallery.length > 0
    ? urlFor(gallery[0].image).width(1920).quality(75).auto("format").url()
    : "/images/gallery-canyon.jpg";

  const steps = [
    { num: "01", text: t("p1") },
    { num: "02", text: t("p2") },
    { num: "03", text: t("p3") },
  ];
  return (
    <section className="relative overflow-hidden text-white">
      <Image
        src={bgImage}
        alt=""
        fill
        className="object-cover"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-ink/75" />
      <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <p className="text-xs font-bold uppercase tracking-[0.25em] text-emerald-bright">
          {t("subtitle")}
        </p>
        <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
          {t("title")}
        </h2>
        <div className="relative mt-12 grid gap-6 md:grid-cols-3">
          <div className="pointer-events-none absolute top-10 right-0 left-0 hidden h-px bg-gradient-to-r from-emerald/0 via-emerald/40 to-emerald/0 md:block" />
          {steps.map((step) => (
            <div key={step.num} className="relative">
              <div className="mb-4 flex items-center gap-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald text-sm font-bold text-white">
                  {step.num}
                </span>
                <div className="h-px flex-1 bg-white/10 md:hidden" />
              </div>
              <p className="text-sm leading-relaxed text-white/70">{step.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Operator — trust grid + body ─── */
async function OperatorSection() {
  const t = await getTranslations("home.operator");
  const reviews = await getGoogleReviews();
  const stats = [
    { value: `${reviews.rating.toFixed(1)} ★`, label: t("statRating") },
    { value: String(reviews.userRatingCount), label: t("statReviews") },
    { value: "IRF", label: t("statCertified") },
    { value: "✓", label: t("statInsured") },
  ];
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald">
            {t("subtitle")}
          </p>
          <h2 className="mt-2 text-2xl font-bold tracking-tight text-ink sm:text-3xl">
            {t("title")}
          </h2>
          <p className="operator-body mt-5 leading-relaxed text-ink-secondary">
            {t("body")}
          </p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {stats.map((s) => (
            <div
              key={s.label}
              className="rounded-xl border border-border bg-surface-alt p-5 text-center"
            >
              <p className="text-3xl font-bold text-emerald-dark">{s.value}</p>
              <p className="mt-1 text-xs font-medium text-ink-muted">
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Safety — badge-style card with checklist ─── */
async function SafetySection({ locale: _locale }: { locale: AppLocale }) {
  const t = await getTranslations("home.safety");
  const messages = await getMessages();
  const home = messages.home as { safetyExtra?: string };
  const extraText = home.safetyExtra?.trim() ?? "";

  const checks = [t("check1"), t("check2"), t("check3"), t("check4")];

  return (
    <section className="bg-emerald-wash">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-2xl border border-border bg-surface">
          <div className="grid lg:grid-cols-5">
            <div className="flex flex-col justify-center bg-emerald-dark p-8 text-white lg:col-span-2">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="h-10 w-10 text-emerald-bright">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
              </svg>
              <h2 className="mt-4 text-2xl font-bold tracking-tight sm:text-3xl">
                {t("title")}
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-emerald-tint/80">
                {t("body")}
              </p>
              {extraText && (
                <p className="mt-3 text-sm leading-relaxed text-emerald-tint/80">
                  {extraText}
                </p>
              )}
            </div>
            <div className="p-8 lg:col-span-3">
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-emerald">
                {t("checklistTitle")}
              </p>
              <ul className="mt-6 space-y-4">
                {checks.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <svg viewBox="0 0 20 20" fill="currentColor" className="mt-0.5 h-5 w-5 shrink-0 text-emerald">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm font-medium text-ink">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Pricing — bold card grid ─── */
const packageLabels: Record<string, { includesKey: "fullInclusiveDesc" | "fullOnlyDesc" | "halfDesc" }> = {
  "full-inclusive": { includesKey: "fullInclusiveDesc" },
  "full-rafting-only": { includesKey: "fullOnlyDesc" },
  "half-family": { includesKey: "halfDesc" },
};

async function PricingSection({ locale }: { locale: AppLocale }) {
  const tp = await getTranslations("home.pricing");
  const to = await getTranslations("home.offers");
  const c = await getTranslations("common");

  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <h2 className="text-2xl font-bold tracking-tight text-ink sm:text-3xl">
        {tp("title")}
      </h2>
      <p className="mt-4 max-w-3xl text-ink-secondary">{tp("intro")}</p>
      <div className="mt-10 grid gap-5 md:grid-cols-3">
        {siteConfig.packages.map((pkg) => {
          const labelKey = packageLabels[pkg.id]?.includesKey;
          const includes = labelKey ? to(labelKey) : "";
          const name =
            pkg.id === "full-inclusive"
              ? to("fullInclusive")
              : pkg.id === "full-rafting-only"
                ? to("fullOnly")
                : to("half");
          const isFeatured = pkg.id === "full-inclusive";
          const price = formatPrice(locale, pkg.priceEur);
          return (
            <div
              key={pkg.id}
              className={`flex flex-col rounded-2xl border p-7 ${
                isFeatured
                  ? "border-emerald bg-emerald-wash"
                  : "border-border bg-surface"
              }`}
            >
              {isFeatured && (
                <span className="mb-3 w-fit rounded-full bg-emerald/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-emerald">
                  {tp("popular")}
                </span>
              )}
              <p className="text-xs font-semibold uppercase tracking-widest text-emerald">
                {name}
              </p>
              <p className="mt-4 text-4xl font-bold tracking-tight text-ink">
                {price.primary}
              </p>
              <p className="mt-1 text-sm text-ink-muted">
                {price.secondary} · {tp("perPerson")}
              </p>
              <div className="mt-5 flex-1 space-y-3 border-t border-border pt-5 text-sm text-ink-secondary">
                <div className="flex items-center gap-2">
                  <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 shrink-0 text-emerald">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-13a.75.75 0 00-1.5 0v5c0 .414.336.75.75.75h4a.75.75 0 000-1.5h-3.25V5z" clipRule="evenodd" />
                  </svg>
                  {pkg.durationHours} {tp("unitHours")}
                </div>
                <div className="flex items-center gap-2">
                  <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 shrink-0 text-emerald">
                    <path fillRule="evenodd" d="M9.69 18.933l.003.001C9.89 19.02 10 19 10 19s.11.02.308-.066l.002-.001.006-.003.018-.008a5.741 5.741 0 00.281-.14c.186-.096.446-.24.757-.433.62-.384 1.445-.966 2.274-1.765C15.302 14.988 17 12.493 17 9A7 7 0 103 9c0 3.492 1.698 5.988 3.355 7.584a13.731 13.731 0 002.274 1.765 11.842 11.842 0 00.976.544l.062.029.018.008.006.003zM10 11.25a2.25 2.25 0 100-4.5 2.25 2.25 0 000 4.5z" clipRule="evenodd" />
                  </svg>
                  {pkg.distanceKm} km · {pkg.priceKm} KM
                </div>
                <p className="pt-1">{includes}</p>
              </div>
              <TrackedLink
                kind="internal"
                href={lp(locale, "/booking")}
                event="book_cta_click"
                eventParams={{ source: "pricing", locale }}
                className={`mt-6 block w-full rounded-lg py-3 text-center text-sm font-semibold transition ${
                  isFeatured
                    ? "bg-emerald text-white hover:bg-emerald-dark"
                    : "border border-emerald text-emerald hover:bg-emerald-wash"
                }`}
              >
                {c("bookNow")}
              </TrackedLink>
            </div>
          );
        })}
      </div>
      <p className="mt-6 text-xs text-ink-muted">
        {tp("notIncluded")}: {tp("notIncludedBody")} {tp("payment")}: {tp("paymentBody")}
      </p>
    </section>
  );
}

/* ─── Getting Here — map card with info grid ─── */
async function GettingHereSection() {
  const t = await getTranslations("home.gettingHere");
  const messages = await getMessages();
  const routes =
    (
      messages.home as {
        gettingHere: { routes: { city: string; time: string }[] };
      }
    ).gettingHere.routes ?? [];
  return (
    <section className="border-t border-border">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-2xl border border-border">
          <div className="grid lg:grid-cols-2">
            <div className="bg-surface-alt p-8 lg:p-10">
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-emerald">
                {t("subtitle")}
              </p>
              <h2 className="mt-2 text-2xl font-bold tracking-tight text-ink sm:text-3xl">
                {t("title")}
              </h2>
              <p className="mt-4 leading-relaxed text-ink-secondary">{t("body")}</p>
              <a
                href={siteConfig.meetingPointMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex rounded-lg bg-emerald px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-dark"
              >
                {t("openMap")} ↗
              </a>
            </div>
            <div className="grid grid-cols-2 gap-px bg-border">
              {routes.map((r) => (
                <div key={r.city} className="flex flex-col items-center justify-center bg-surface p-6 text-center">
                  <p className="text-2xl font-bold text-ink">{r.time}</p>
                  <p className="mt-1 text-xs font-medium text-ink-muted">
                    {t("fromLabel")} {r.city}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── FAQ ─── */
async function FaqSection() {
  const t = await getTranslations("home.faq");
  const messages = await getMessages();
  const items = (messages.home as { faqItems: { q: string; a: string }[] }).faqItems;
  return (
    <section className="border-t border-border">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-emerald">
            FAQ
          </p>
          <h2 className="mt-2 text-2xl font-bold tracking-tight text-ink sm:text-3xl">
            {t("title")}
          </h2>
        </div>
        <div className="mx-auto mt-10 max-w-3xl divide-y divide-border rounded-xl border border-border bg-surface">
          {items.map((item) => (
            <details key={item.q} className="group px-6 py-5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-bold text-ink transition group-open:text-emerald-dark">
                {item.q}
                <svg
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="h-5 w-5 shrink-0 text-ink-muted transition group-open:rotate-180 group-open:text-emerald"
                >
                  <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                </svg>
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-ink-secondary">{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Reviews ─── */
async function ReviewsSection() {
  const data = await getGoogleReviews();

  const stars = (rating: number) =>
    Array.from({ length: 5 }, (_, i) => (
      <svg
        key={i}
        viewBox="0 0 20 20"
        fill={i < rating ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth={i < rating ? 0 : 1.5}
        className={`h-4 w-4 ${i < rating ? "text-amber-400" : "text-border-strong"}`}
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ));

  const topReviews = data.reviews.slice(0, 3);

  return (
    <section className="bg-emerald-deep text-white">
      <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center">
          <div className="flex items-center gap-3">
            <span className="text-5xl font-bold">{data.rating}</span>
            <div>
              <div className="flex">{stars(Math.round(data.rating))}</div>
              <p className="mt-0.5 text-xs font-bold text-emerald-tint/70">
                {data.userRatingCount} Google reviews
              </p>
            </div>
          </div>
        </div>
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {topReviews.map((review, i) => (
            <div
              key={i}
              className="rounded-2xl border border-white/15 bg-white/5 p-6 transition hover:bg-white/10"
            >
              <div className="flex">{stars(review.rating)}</div>
              <p className="mt-4 text-sm leading-relaxed text-white/80 line-clamp-5">
                &ldquo;{review.text?.text}&rdquo;
              </p>
              <div className="mt-5 flex items-center gap-3">
                {review.authorAttribution.photoUri && (
                  <img
                    src={review.authorAttribution.photoUri}
                    alt=""
                    className="h-8 w-8 rounded-full object-cover"
                  />
                )}
                <div>
                  <p className="text-sm font-bold text-white">
                    {review.authorAttribution.displayName}
                  </p>
                  <p className="text-xs text-emerald-tint/60">
                    {review.relativePublishTimeDescription}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── CTA ─── */
async function CtaSection({ locale }: { locale: AppLocale }) {
  const t = await getTranslations("home.cta");
  const c = await getTranslations("common");
  const cta = await getCtaImage();
  const bgSrc = cta?.image
    ? urlFor(cta.image).width(1920).quality(75).auto("format").url()
    : null;
  const price = formatPrice(locale, featuredPriceEur());

  return (
    <section className="relative overflow-hidden text-white">
      {bgSrc ? (
        <>
          <Image
            src={bgSrc}
            alt={cta?.alt ?? ""}
            fill
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-emerald-deep/75" />
        </>
      ) : (
        <div className="absolute inset-0 bg-emerald-deep" />
      )}
      <div className="relative mx-auto flex max-w-7xl flex-col gap-8 px-4 py-32 sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-40 lg:px-8 lg:py-50">
        <div>
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
            {t("title", { pricePrimary: price.primary })}
          </h2>
          <p className="mt-3 max-w-xl text-emerald-tint/80">
            {t("subtitle", { priceSecondary: price.secondary })}
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <TrackedLink
            kind="internal"
            href={lp(locale, "/booking")}
            event="book_cta_click"
            eventParams={{ source: "footer_cta", locale }}
            className="rounded-lg bg-white px-6 py-3 text-sm font-semibold text-emerald-deep transition hover:bg-emerald-tint"
          >
            {c("book")}
          </TrackedLink>
          <TrackedLink
            kind="external"
            href={whatsappHref()}
            event="whatsapp_click"
            eventParams={{ source: "footer_cta", locale }}
            className="rounded-lg border border-white/30 px-6 py-3 text-sm font-semibold transition hover:border-white/60 hover:bg-white/10"
          >
            {c("whatsapp")}
          </TrackedLink>
        </div>
      </div>
    </section>
  );
}

/* ─── Section map ─── */
const sectionRenderers: Record<HomeSectionId, (locale: AppLocale) => Promise<ReactNode>> = {
  hero: async (locale) => <HeroSection locale={locale} />,
  offers: async () => <OffersSection />,
  day: async () => <DaySection />,
  operator: async () => <OperatorSection />,
  safety: async (locale) => <SafetySection locale={locale} />,
  pricing: async (locale) => <PricingSection locale={locale} />,
  gettingHere: async () => <GettingHereSection />,
  reviews: async () => <ReviewsSection />,
  faq: async () => <FaqSection />,
  cta: async (locale) => <CtaSection locale={locale} />,
};

export async function HomeSections({
  locale,
  order,
}: {
  locale: AppLocale;
  order: HomeSectionId[];
}) {
  const nodes = await Promise.all(
    order.map(async (id) => (
      <div key={id}>{await sectionRenderers[id](locale)}</div>
    )),
  );
  return <>{nodes}</>;
}
