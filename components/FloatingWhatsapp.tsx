import type { AppLocale } from "@/i18n/routing";
import { getTranslations } from "next-intl/server";
import { whatsappHref } from "@/lib/whatsapp";
import { TrackedLink } from "@/components/TrackedLink";

export async function FloatingWhatsapp({ locale }: { locale: AppLocale }) {
  const t = await getTranslations("common");
  const href = whatsappHref();

  return (
    <TrackedLink
      kind="external"
      href={href}
      event="whatsapp_click"
      eventParams={{ source: "floating", locale }}
      ariaLabel={t("whatsapp")}
      className="fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-full bg-emerald px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-emerald-dark md:bottom-8 md:right-8"
    >
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
        <path d="M12 0C5.373 0 0 5.373 0 12c0 2.124.553 4.117 1.519 5.854L.053 23.52a.5.5 0 00.607.608l5.728-1.492A11.944 11.944 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.75c-1.875 0-3.654-.503-5.197-1.45l-.363-.215-3.762.98.998-3.716-.236-.375A9.72 9.72 0 012.25 12 9.75 9.75 0 0112 2.25 9.75 9.75 0 0121.75 12 9.75 9.75 0 0112 21.75z"/>
      </svg>
      {t("whatsapp")}
    </TrackedLink>
  );
}
