export const siteConfig = {
  businessName: "Neretva Rafting",
  legalName: "Neretva Rafting",
  contact: {
    phone: "+38762370649",
    phoneDisplay: "+387 62 370 649",
    email: "booking@neretvarafting.co",
    whatsapp: "+38762370649",
  },
  address: {
    streetAddress: "Zuke Dzumhura",
    addressLocality: "Konjic",
    addressRegion: "Herzegovina-Neretva Canton",
    postalCode: "88400",
    addressCountry: "BA",
  },
  geo: {
    latitude: 43.6553,
    longitude: 17.9619,
  },
  season: {
    validFrom: "2026-04-01",
    validThrough: "2026-10-31",
    label: "April–October",
  },
  packages: [
    {
      id: "full-inclusive",
      durationHours: "5–6",
      distanceKm: "18–25",
      priceKm: 100,
      priceEur: 50,
    },
    {
      id: "full-rafting-only",
      durationHours: "5–6",
      distanceKm: "18–25",
      priceKm: 90,
      priceEur: 45,
    },
    {
      id: "half-family",
      durationHours: "~2",
      distanceKm: "~7",
      priceKm: 70,
      priceEur: 35,
    },
  ],
  payment: {
    methods: ["Cash (BAM or EUR)"],
    online: false as boolean,
  },
  differentiators: {
    en: [
      "We own the gear and employ IRF-certified skippers.",
      "Konjic base with transport to Glavatičevo put-in.",
      "All-inclusive option with BBQ lunch on the river.",
    ],
  },
  meetingPointMapsUrl:
    "https://www.google.com/maps/search/?api=1&query=Konjic+Bosnia+and+Herzegovina",
} as const;

export function getSiteUrl(): string {
  if (typeof process.env.NEXT_PUBLIC_SITE_URL === "string") {
    return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
  }
  return "https://neretvarafting.se";
}
