import Link from "next/link";
import { getTranslations } from "next-intl/server";
import type { AppLocale } from "@/i18n/routing";
import { locales } from "@/i18n/routing";
import { lp } from "@/lib/locale-path";
import { localePickerLabels } from "@/lib/locale-labels";

export async function Header({ locale }: { locale: AppLocale }) {
  const t = await getTranslations("nav");

  const links = [
    { href: lp(locale, "/"), label: t("home") },
    { href: lp(locale, "/booking"), label: t("booking") },
    { href: lp(locale, "/about"), label: t("about") },
    { href: lp(locale, "/gallery"), label: t("gallery") },
    { href: lp(locale, "/blog"), label: t("blog") },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-surface/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link
          href={lp(locale, "/")}
          className="text-lg font-extrabold uppercase tracking-tight text-ink"
        >
          Neretva<span className="text-emerald">Rafting</span>
        </Link>
        <nav className="hidden items-center gap-0.5 md:flex">
          {links.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="px-3 py-2 text-sm font-semibold text-ink-secondary transition hover:text-emerald"
            >
              {label}
            </Link>
          ))}
          <LocaleSwitcher locale={locale} />
          <Link
            href={lp(locale, "/booking")}
            className="ml-3 rounded-lg bg-emerald px-4 py-2 text-sm font-bold text-white transition hover:bg-emerald-dark"
          >
            {t("booking")}
          </Link>
        </nav>
        <div className="flex items-center gap-2 md:hidden">
          <LocaleSwitcher locale={locale} />
          <details className="relative">
            <summary className="cursor-pointer list-none rounded-lg border border-border px-3 py-2 text-sm font-bold text-ink">
              Menu
            </summary>
            <div className="absolute right-0 mt-2 w-52 rounded-xl border border-border bg-surface py-1 shadow-xl shadow-ink/5">
              {links.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className="block px-4 py-2.5 text-sm font-semibold text-ink-secondary hover:bg-emerald-wash hover:text-emerald-dark"
                >
                  {label}
                </Link>
              ))}
            </div>
          </details>
        </div>
      </div>
    </header>
  );
}

function LocaleSwitcher({ locale }: { locale: AppLocale }) {
  return (
    <details className="relative">
      <summary className="flex cursor-pointer list-none items-center gap-1.5 rounded-lg border border-border px-2.5 py-1.5 text-xs font-bold uppercase tracking-wide text-ink-secondary transition hover:border-emerald hover:text-emerald">
        <span>{localePickerLabels[locale].flag}</span>
        {localePickerLabels[locale].code}
        <svg viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5">
          <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
        </svg>
      </summary>
      <div className="absolute right-0 z-50 mt-2 grid w-44 grid-cols-2 gap-px overflow-hidden rounded-xl border border-border bg-border shadow-xl shadow-ink/5">
        {locales.map((loc) => (
          <Link
            key={loc}
            href={`/${loc}`}
            className={`flex items-center justify-center gap-1.5 bg-surface px-3 py-2.5 text-xs font-bold uppercase tracking-wide transition hover:bg-emerald-wash hover:text-emerald-dark ${
              loc === locale ? "text-emerald" : "text-ink-secondary"
            }`}
          >
            <span>{localePickerLabels[loc].flag}</span>
            {localePickerLabels[loc].code}
          </Link>
        ))}
      </div>
    </details>
  );
}
