"use client";

import { useActionState, useEffect, useMemo, useState } from "react";
import { submitBookingRequest } from "@/app/[locale]/booking/actions";
import type {
  BookingFieldError,
  BookingFormState,
} from "@/lib/booking-types";
import { trackEvent } from "@/lib/analytics";
import { siteConfig } from "@/lib/site-config";
import { formatPrice } from "@/lib/locale-pricing";
import type { AppLocale } from "@/i18n/routing";

export type BookingFormCopy = {
  title: string;
  intro: string;
  name: string;
  namePlaceholder: string;
  partySize: string;
  partySizePlaceholder: string;
  date: string;
  package: string;
  packageFullInclusive: string;
  packageFullOnly: string;
  packageHalfFamily: string;
  whatsapp: string;
  whatsappPlaceholder: string;
  whatsappHelp: string;
  notes: string;
  notesPlaceholder: string;
  submit: string;
  submitting: string;
  successTitle: string;
  successBody: string;
  successCta: string;
  errorTitle: string;
  errorBody: string;
  errors: {
    name: string;
    partySize: string;
    date: string;
    package: string;
    whatsapp: string;
    notes: string;
    generic: string;
  };
};

type Props = {
  locale: string;
  sourcePage: string;
  copy: BookingFormCopy;
};

const PACKAGE_LABEL_KEY: Record<string, keyof BookingFormCopy> = {
  "full-inclusive": "packageFullInclusive",
  "full-rafting-only": "packageFullOnly",
  "half-family": "packageHalfFamily",
};

const initialState: BookingFormState = { status: "idle" };

export function BookingForm({ locale, sourcePage, copy }: Props) {
  const [state, formAction, pending] = useActionState(
    submitBookingRequest,
    initialState,
  );
  const [renderedAt] = useState(() => Date.now());

  const errors = state.status === "error" ? state.errors : [];
  const hasError = (k: BookingFieldError) => errors.includes(k);

  const todayIso = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().slice(0, 10);
  }, []);
  const maxIso = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + 365);
    return d.toISOString().slice(0, 10);
  }, []);

  useEffect(() => {
    if (state.status !== "success") return;
    trackEvent("booking_form_submit", {
      locale,
      source_page: sourcePage,
      package: state.summary.package,
      party_size: state.summary.partySize,
    });
  }, [state, locale, sourcePage]);

  if (state.status === "success") {
    return (
      <div className="rounded-xl border border-emerald/30 bg-emerald-wash p-6 sm:p-8">
        <h2 className="text-lg font-bold tracking-tight text-emerald-deep">
          {copy.successTitle}
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-ink-secondary">
          {copy.successBody}
        </p>
        <dl className="mt-5 grid gap-2 text-sm text-ink-secondary sm:grid-cols-2">
          <div>
            <dt className="text-xs font-medium text-ink-muted">
              {copy.name}
            </dt>
            <dd className="text-ink">{state.summary.name}</dd>
          </div>
          <div>
            <dt className="text-xs font-medium text-ink-muted">
              {copy.partySize}
            </dt>
            <dd className="text-ink">{state.summary.partySize}</dd>
          </div>
          <div>
            <dt className="text-xs font-medium text-ink-muted">
              {copy.date}
            </dt>
            <dd className="text-ink">{state.summary.date}</dd>
          </div>
          <div>
            <dt className="text-xs font-medium text-ink-muted">
              {copy.package}
            </dt>
            <dd className="text-ink">{state.summary.package}</dd>
          </div>
        </dl>
        <a
          href={state.whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-flex items-center justify-center rounded-lg bg-emerald px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-dark"
        >
          {copy.successCta}
        </a>
      </div>
    );
  }

  return (
    <form
      action={formAction}
      className="space-y-5 rounded-xl border border-border bg-surface p-6 sm:p-8"
      noValidate
    >
      <div>
        <h2 className="text-lg font-bold tracking-tight text-ink">
          {copy.title}
        </h2>
        <p className="mt-1 text-sm text-ink-secondary">{copy.intro}</p>
      </div>

      <input type="hidden" name="_locale" value={locale} />
      <input type="hidden" name="_sourcePage" value={sourcePage} />
      <input type="hidden" name="_renderedAt" value={renderedAt} />
      <input
        type="text"
        name="_company"
        tabIndex={-1}
        autoComplete="off"
        className="absolute -left-[9999px] h-0 w-0 opacity-0"
        aria-hidden="true"
      />

      <Field
        label={copy.name}
        error={hasError("name") ? copy.errors.name : null}
      >
        <input
          type="text"
          name="name"
          required
          minLength={2}
          maxLength={80}
          placeholder={copy.namePlaceholder}
          autoComplete="name"
          className={inputClass(hasError("name"))}
        />
      </Field>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field
          label={copy.partySize}
          error={hasError("partySize") ? copy.errors.partySize : null}
        >
          <input
            type="number"
            name="partySize"
            required
            min={1}
            max={20}
            placeholder={copy.partySizePlaceholder}
            inputMode="numeric"
            className={inputClass(hasError("partySize"))}
          />
        </Field>

        <Field
          label={copy.date}
          error={hasError("date") ? copy.errors.date : null}
        >
          <input
            type="date"
            name="date"
            required
            min={todayIso}
            max={maxIso}
            className={inputClass(hasError("date"))}
          />
        </Field>
      </div>

      <Field
        label={copy.package}
        error={hasError("package") ? copy.errors.package : null}
      >
        <div
          className={`grid gap-2 rounded-lg border bg-surface-alt p-2 sm:grid-cols-3 ${
            hasError("package") ? "border-red-500" : "border-border"
          }`}
        >
          {siteConfig.packages.map((pkg) => {
            const labelKey = PACKAGE_LABEL_KEY[pkg.id];
            const labelText = labelKey
              ? (copy[labelKey] as string)
              : pkg.id;
            return (
              <label
                key={pkg.id}
                className="cursor-pointer rounded-md border border-transparent bg-surface p-3 text-center text-sm transition hover:border-emerald/30 has-[:checked]:border-emerald has-[:checked]:bg-emerald-wash has-[:checked]:font-semibold has-[:checked]:text-emerald-deep"
              >
                <input
                  type="radio"
                  name="package"
                  value={pkg.id}
                  required
                  className="sr-only"
                />
                <span className="block">{labelText}</span>
                <span className="mt-1 block text-xs text-ink-muted">
                  {formatPrice(locale as AppLocale, pkg.priceEur).primary} ·{" "}
                  {formatPrice(locale as AppLocale, pkg.priceEur).secondary}
                </span>
              </label>
            );
          })}
        </div>
      </Field>

      <Field
        label={copy.whatsapp}
        error={hasError("whatsapp") ? copy.errors.whatsapp : null}
        hint={copy.whatsappHelp}
      >
        <input
          type="tel"
          name="whatsapp"
          required
          placeholder={copy.whatsappPlaceholder}
          autoComplete="tel"
          className={inputClass(hasError("whatsapp"))}
        />
      </Field>

      <Field
        label={copy.notes}
        error={hasError("notes") ? copy.errors.notes : null}
      >
        <textarea
          name="notes"
          rows={3}
          maxLength={500}
          placeholder={copy.notesPlaceholder}
          className={`${inputClass(hasError("notes"))} resize-y`}
        />
      </Field>

      {state.status === "error" && errors.includes("generic") && (
        <p className="text-sm font-semibold text-red-600">
          {copy.errors.generic}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-lg bg-emerald px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-dark disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? copy.submitting : copy.submit}
      </button>
    </form>
  );
}

function Field({
  label,
  error,
  hint,
  children,
}: {
  label: string;
  error?: string | null;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-ink">
        {label}
      </span>
      <div className="mt-1.5">{children}</div>
      {hint && !error ? (
        <p className="mt-1.5 text-xs text-ink-muted">{hint}</p>
      ) : null}
      {error ? (
        <p className="mt-1.5 text-xs font-semibold text-red-600">{error}</p>
      ) : null}
    </label>
  );
}

function inputClass(error: boolean): string {
  return [
    "block w-full rounded-lg border bg-surface px-3 py-2.5 text-sm text-ink",
    "placeholder:text-ink-muted",
    "focus:outline-none focus:ring-2 focus:ring-emerald/40 focus:border-emerald",
    error ? "border-red-500" : "border-border",
  ].join(" ");
}
