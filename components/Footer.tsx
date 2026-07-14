import Link from "next/link";
import { getTranslations } from "next-intl/server";
import type { AppLocale } from "@/i18n/routing";
import { siteConfig } from "@/lib/site-config";
import { lp } from "@/lib/locale-path";
import { TrackedLink } from "@/components/TrackedLink";

export async function Footer({ locale }: { locale: AppLocale }) {
  const t = await getTranslations("footer");
  const nav = await getTranslations("nav");

  return (
    <footer className="mt-auto border-t border-border bg-ink text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:grid-cols-2 sm:px-6 lg:grid-cols-3 lg:px-8">
        <div>
          <p className="text-lg font-bold tracking-tight">
            Neretva<span className="text-emerald-bright"> Rafting</span>
          </p>
          <p className="mt-2 text-sm text-white/60">{t("tagline")}</p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-emerald-bright">
            {nav("booking")}
          </p>
          <ul className="mt-3 space-y-2 text-sm text-white/70">
            <li>
              <TrackedLink
                kind="anchor"
                href={`tel:${siteConfig.contact.phone}`}
                event="phone_click"
                eventParams={{ source: "footer", locale }}
                className="hover:text-white"
              >
                {siteConfig.contact.phoneDisplay}
              </TrackedLink>
            </li>
            <li>
              <TrackedLink
                kind="anchor"
                href={`mailto:${siteConfig.contact.email}`}
                event="email_click"
                eventParams={{ source: "footer", locale }}
                className="hover:text-white"
              >
                {siteConfig.contact.email}
              </TrackedLink>
            </li>
          </ul>
        </div>
        <div className="flex flex-col gap-2 text-sm text-white/70">
          <Link href={lp(locale, "/blog")} className="hover:text-white">
            {nav("blog")}
          </Link>
          <Link href={lp(locale, "/about")} className="hover:text-white">
            {nav("about")}
          </Link>
          <Link href={lp(locale, "/gallery")} className="hover:text-white">
            {nav("gallery")}
          </Link>
          <a
            href="https://neretvarafting.co"
            className="hover:text-white"
            rel="noopener noreferrer"
            target="_blank"
          >
            {t("internationalSite")}
          </a>
        </div>
      </div>
      <div className="border-t border-white/10 py-4 text-center text-xs text-white/40">
        © {new Date().getFullYear()} {siteConfig.legalName}. {t("rights")}
      </div>
    </footer>
  );
}
