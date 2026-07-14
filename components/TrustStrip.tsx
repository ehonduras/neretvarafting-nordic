import { getTranslations } from "next-intl/server";
import type { AppLocale } from "@/i18n/routing";

export async function TrustStrip({ locale: _locale }: { locale: AppLocale }) {
  const t = await getTranslations("trust");
  const items = [t("item1"), t("item2"), t("item3"), t("item4")];

  return (
    <div className="border-b border-border bg-surface-alt">
      <ul className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-4 gap-y-1.5 px-4 py-2.5 text-xs text-ink-secondary sm:gap-x-6 sm:px-6 lg:px-8">
        {items.map((item, i) => (
          <li key={item} className="flex items-center gap-x-4 sm:gap-x-6">
            {i > 0 && (
              <span className="hidden text-border-strong sm:inline" aria-hidden>
                ·
              </span>
            )}
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
