import { Resend } from "resend";
import { siteConfig, getSiteUrl } from "@/lib/site-config";

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/**
 * `RESEND_FROM` — full From header, e.g. `Neretva Rafting <bookings@neretvarafting.co>`.
 * Must use an address on a domain verified in Resend. If unset, falls back to
 * the booking inbox address (same as `to` when you only verify the apex domain).
 */
export function getResendFromAddress(): string {
  const custom = process.env.RESEND_FROM?.trim();
  if (custom) return custom;
  return `Neretva Rafting <${siteConfig.contact.email}>`;
}

export type BookingEmailPayload = {
  name: string;
  partySize: number;
  date: string;
  packageLabel: string;
  whatsapp: string;
  notes: string;
  locale: string;
  sourcePage: string;
};

export async function sendBookingNotificationEmail(
  payload: BookingEmailPayload,
): Promise<{ ok: boolean }> {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (!apiKey) {
    console.warn("[booking-email] RESEND_API_KEY not set — skipping Resend");
    return { ok: false };
  }

  const to = siteConfig.contact.email;
  const from = getResendFromAddress();
  const subject = `Booking request — ${payload.name} (${payload.date})`;

  const siteUrl = getSiteUrl();
  const textLines = [
    `New booking request (${siteUrl})`,
    "",
    `Name: ${payload.name}`,
    `Party: ${payload.partySize}`,
    `Date: ${payload.date}`,
    `Package: ${payload.packageLabel}`,
    `WhatsApp: ${payload.whatsapp}`,
    payload.notes ? `Notes: ${payload.notes}` : null,
    "",
    `Locale: ${payload.locale}`,
    `Source page: ${payload.sourcePage}`,
    `Site: ${siteUrl}`,
  ].filter(Boolean) as string[];

  const text = textLines.join("\n");

  const html = `
<table cellpadding="6" style="font-family:system-ui,sans-serif;font-size:14px;">
  <tr><td><strong>Name</strong></td><td>${escapeHtml(payload.name)}</td></tr>
  <tr><td><strong>Party</strong></td><td>${payload.partySize}</td></tr>
  <tr><td><strong>Date</strong></td><td>${escapeHtml(payload.date)}</td></tr>
  <tr><td><strong>Package</strong></td><td>${escapeHtml(payload.packageLabel)}</td></tr>
  <tr><td><strong>WhatsApp</strong></td><td>${escapeHtml(payload.whatsapp)}</td></tr>
  ${
    payload.notes
      ? `<tr><td><strong>Notes</strong></td><td>${escapeHtml(payload.notes)}</td></tr>`
      : ""
  }
  <tr><td><strong>Locale</strong></td><td>${escapeHtml(payload.locale)}</td></tr>
  <tr><td><strong>Source</strong></td><td>${escapeHtml(payload.sourcePage)}</td></tr>
</table>
<p style="font-family:system-ui,sans-serif;font-size:12px;color:#666;">Sent from booking form · ${escapeHtml(siteUrl)}</p>
`.trim();

  try {
    const resend = new Resend(apiKey);
    const result = await resend.emails.send({
      from,
      to: [to],
      subject,
      text,
      html,
      tags: [
        { name: "source", value: "booking_form" },
        { name: "site", value: "neretvarafting" },
      ],
    });

    if (result.error) {
      console.error("[booking-email] Resend API error:", result.error);
      return { ok: false };
    }

    console.info("[booking-email] sent", { id: result.data?.id, to });
    return { ok: true };
  } catch (e) {
    console.error("[booking-email] exception:", e);
    return { ok: false };
  }
}
