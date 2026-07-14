"use server";

import { siteConfig } from "@/lib/site-config";
import { sendBookingNotificationEmail } from "@/lib/send-booking-email";
import { whatsappHref } from "@/lib/whatsapp";
import type {
  BookingFieldError,
  BookingFormState,
} from "@/lib/booking-types";

const MIN_PARTY = 1;
const MAX_PARTY = 20;
const MAX_NOTES = 500;
const MAX_NAME = 80;
const MIN_NAME = 2;
const MAX_AHEAD_DAYS = 365;
const MIN_FILL_MS = 2000;
const PHONE_REGEX = /^\+?[\d\s().-]{7,20}$/;

const PACKAGE_IDS: ReadonlySet<string> = new Set(
  siteConfig.packages.map((p) => p.id),
);

const PACKAGE_LABELS: Record<string, string> = {
  "full-inclusive": "Full day — all-inclusive",
  "full-rafting-only": "Full day — rafting only",
  "half-family": "Half day / family",
};

export async function submitBookingRequest(
  _prev: BookingFormState,
  formData: FormData,
): Promise<BookingFormState> {
  const errors: BookingFieldError[] = [];

  const honeypot = String(formData.get("_company") ?? "").trim();
  if (honeypot.length > 0) {
    return { status: "error", errors: ["generic"] };
  }

  const renderedAtRaw = String(formData.get("_renderedAt") ?? "");
  const renderedAt = Number.parseInt(renderedAtRaw, 10);
  if (
    Number.isFinite(renderedAt) &&
    Date.now() - renderedAt < MIN_FILL_MS
  ) {
    return { status: "error", errors: ["generic"] };
  }

  const locale = String(formData.get("_locale") ?? "");
  const sourcePage = String(formData.get("_sourcePage") ?? "");

  const name = String(formData.get("name") ?? "").trim();
  if (name.length < MIN_NAME || name.length > MAX_NAME) errors.push("name");

  const partySizeRaw = String(formData.get("partySize") ?? "").trim();
  const partySize = Number.parseInt(partySizeRaw, 10);
  if (
    !Number.isFinite(partySize) ||
    partySize < MIN_PARTY ||
    partySize > MAX_PARTY
  ) {
    errors.push("partySize");
  }

  const date = String(formData.get("date") ?? "").trim();
  let dateOk = false;
  if (/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    const parsed = new Date(`${date}T00:00:00`);
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const max = new Date(now.getTime() + MAX_AHEAD_DAYS * 86400_000);
    if (parsed >= now && parsed <= max) dateOk = true;
  }
  if (!dateOk) errors.push("date");

  const pkg = String(formData.get("package") ?? "").trim();
  if (!PACKAGE_IDS.has(pkg)) errors.push("package");

  const whatsapp = String(formData.get("whatsapp") ?? "").trim();
  if (!PHONE_REGEX.test(whatsapp)) errors.push("whatsapp");

  const notes = String(formData.get("notes") ?? "").trim();
  if (notes.length > MAX_NOTES) errors.push("notes");

  if (errors.length > 0) {
    return { status: "error", errors };
  }

  const pkgLabel = PACKAGE_LABELS[pkg] ?? pkg;
  const message = [
    `Booking request — ${name}`,
    `Party: ${partySize}`,
    `Date: ${date}`,
    `Package: ${pkgLabel}`,
    `WhatsApp: ${whatsapp}`,
    notes ? `Notes: ${notes}` : null,
  ]
    .filter(Boolean)
    .join("\n");

  console.info("[booking] new request", {
    locale,
    sourcePage,
    name,
    partySize,
    date,
    package: pkg,
    whatsapp,
    notesLength: notes.length,
    receivedAt: new Date().toISOString(),
    forwardTo: siteConfig.contact.email,
  });

  await sendBookingNotificationEmail({
    name,
    partySize,
    date,
    packageLabel: pkgLabel,
    whatsapp,
    notes,
    locale,
    sourcePage,
  });

  return {
    status: "success",
    whatsappUrl: whatsappHref(message),
    summary: {
      name,
      partySize,
      date,
      package: pkgLabel,
      whatsapp,
      notes,
    },
  };
}
