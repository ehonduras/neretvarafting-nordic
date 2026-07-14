import type { Metadata } from "next";
import Link from "next/link";
import { locales } from "@/i18n/routing";
import type { AppLocale } from "@/i18n/routing";
import { VideoBackdrop } from "@/components/VideoBackdrop";
import { localePickerLabels } from "@/lib/locale-labels";

export const metadata: Metadata = {
  title: "Neretva Rafting Konjic — Välj språk",
  description: "Forsränning på floden Neretva i Konjic, Bosnien. Välj språk för att fortsätta.",
  robots: { index: false, follow: true },
};

const POSTER = "/images/hero-canyon.jpg";
const POSTER_ALT = "Neretvas floddal nära Konjic, Bosnien och Hercegovina";

export default function RootLanguagePage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-ink text-white">
      <div className="absolute inset-0 z-0">
        <VideoBackdrop posterSrc={POSTER} posterAlt={POSTER_ALT} />
      </div>
      <div className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-b from-ink/75 via-ink/40 to-ink/90" />
      <div className="relative z-[2] flex min-h-screen flex-col items-center justify-center px-4 py-8 max-md:justify-start max-md:py-10 max-md:pt-12 sm:px-6 sm:py-16">
        <div className="w-full max-w-lg">
          <div className="rounded-2xl border border-white/15 bg-ink/55 p-5 shadow-2xl shadow-ink/40 backdrop-blur-md sm:p-10">
            <p className="text-center text-xs font-bold uppercase tracking-[0.3em] text-emerald-bright">
              Neretva Rafting · Konjic
            </p>
            <h1 className="mt-3 text-center text-2xl font-extrabold tracking-tight sm:mt-4 sm:text-4xl">
              Välj språk
            </h1>
            <p className="mt-2 text-center text-sm leading-relaxed text-white/75 sm:mt-3">
              Forsränning på Neretva — välj svenska, danska eller norska.
            </p>
            <ul className="mt-5 flex max-h-[min(28vh,188px)] flex-col gap-2 overflow-y-auto overscroll-y-contain pr-1 [-webkit-overflow-scrolling:touch] sm:mt-10 sm:max-h-none sm:overflow-visible">
              {locales.map((locale) => {
                const row = localePickerLabels[locale as AppLocale];
                return (
                  <li key={locale}>
                    <Link
                      href={`/${locale}`}
                      className="group flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 transition hover:border-emerald-bright/50 hover:bg-emerald/15 sm:gap-4 sm:px-4 sm:py-3.5"
                    >
                      <span className="text-2xl leading-none" aria-hidden>
                        {row.flag}
                      </span>
                      <span className="min-w-0 flex-1 text-left text-sm font-semibold leading-snug">
                        {row.name}
                      </span>
                      <span className="shrink-0 text-xs font-bold uppercase tracking-wider text-emerald-bright/90">
                        {row.code}
                      </span>
                      <span
                        className="text-white/40 transition group-hover:text-emerald-bright"
                        aria-hidden
                      >
                        →
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
          <p className="mt-5 text-center text-xs text-white/45 sm:mt-8">
            Bosnien och Hercegovina · IRF-certifierade guider
          </p>
        </div>
      </div>
    </div>
  );
}
