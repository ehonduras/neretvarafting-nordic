# Neretva Rafting — Nordic site

Swedish, Danish, and Norwegian (Bokmål) marketing site for Neretva river rafting in Konjic, Bosnia. Separate from [neretvarafting.co](https://neretvarafting.co) (9-language international site).

## Locales

- `/sv` — Svenska (default)
- `/da` — Dansk
- `/nb` — Norsk (bokmål)
- `/` — Video + language picker (`noindex`)

## Environment variables

Set in Vercel (and `.env.local` for dev):

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_SITE_URL` | Yes | Production URL, e.g. `https://neretvarafting.se` |
| `NEXT_PUBLIC_VIDEO_URL` | No | R2/public MP4 for root page video |
| `RESEND_API_KEY` | Yes (prod) | Booking notification emails |
| `RESEND_FROM` | No | From header for Resend |
| `GOOGLE_PLACES_API_KEY` | No | Live Google reviews |
| `GOOGLE_PLACE_ID` | No | Google Business place ID |
| `NEXT_PUBLIC_GA_ID` | No | GA4 measurement ID (Nordic property) |
| `NEXT_PUBLIC_GOOGLE_ADS_ID` | No | Google Ads conversion tag |
| `NEXT_PUBLIC_OPERATOR_GBP_URL` | No | Google Business Profile URL for schema |

Sanity (optional gallery): `NEXT_PUBLIC_SANITY_*` if using CMS.

## Develop

```bash
npm install
npm run dev
```

Open `http://localhost:3000` (picker) or `http://localhost:3000/sv`.

## Deploy (Vercel)

1. Import this repo as a **new** Vercel project (not the main neretvarafting.co project).
2. Set env vars above for Production.
3. Connect domain (e.g. `neretvarafting.se`); point DNS to Vercel.
4. Redeploy after env changes.

## Stack

Next.js 16, next-intl, Tailwind, Resend (booking email), optional Sanity gallery.
