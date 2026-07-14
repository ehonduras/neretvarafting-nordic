import type { ReactNode } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { FloatingWhatsapp } from "@/components/FloatingWhatsapp";
import { RootShell } from "@/components/RootShell";
import { getSiteUrl } from "@/lib/site-config";
import type { AppLocale } from "@/i18n/routing";
import "../globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const loc = locale as AppLocale;
  setRequestLocale(loc);

  return (
    <RootShell lang={loc}>
      <div dir="ltr" className="flex min-h-screen flex-col">
        <Header locale={loc} />
        <main className="flex-1">{children}</main>
        <Footer locale={loc} />
        <FloatingWhatsapp locale={loc} />
      </div>
    </RootShell>
  );
}
