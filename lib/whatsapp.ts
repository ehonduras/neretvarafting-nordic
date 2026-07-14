import { siteConfig, getSiteUrl } from "@/lib/site-config";

/**
 * Short label prepended to every WhatsApp deep link so you can tell which
 * site the chat came from when one number is used on multiple properties.
 *
 * Override with NEXT_PUBLIC_WHATSAPP_LEAD_TAG (plain text, e.g. `[MyBrand]`).
 */
export function whatsappLeadTag(): string {
  const manual = process.env.NEXT_PUBLIC_WHATSAPP_LEAD_TAG?.trim();
  if (manual) return manual;
  try {
    const host = new URL(getSiteUrl()).hostname.replace(/^www\./, "");
    if (host === "localhost" || host.startsWith("127.")) {
      return "[neretvarafting.co]";
    }
    return `[${host}]`;
  } catch {
    return "[neretvarafting.co]";
  }
}

export function whatsappHref(message?: string): string {
  const n = siteConfig.contact.whatsapp.replace(/\D/g, "");
  const base = `https://wa.me/${n}`;
  const tag = whatsappLeadTag();

  if (!message?.trim()) {
    const text = `${tag} `;
    return `${base}?text=${encodeURIComponent(text)}`;
  }

  const full = `${tag}\n\n${message.trim()}`;
  return `${base}?text=${encodeURIComponent(full)}`;
}
