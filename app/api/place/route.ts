import { NextResponse } from "next/server";

const API_KEY = process.env.GOOGLE_PLACES_API_KEY ?? "";
const PLACE_ID = process.env.GOOGLE_PLACE_ID ?? "";

const FIELD_MASK = [
  "id",
  "displayName",
  "rating",
  "userRatingCount",
  "reviews",
  "formattedAddress",
  "nationalPhoneNumber",
  "internationalPhoneNumber",
  "websiteUri",
  "businessStatus",
  "location",
  "regularOpeningHours",
].join(",");

export const revalidate = 3600;

export async function GET() {
  if (!API_KEY || !PLACE_ID) {
    return NextResponse.json(
      { error: "Missing GOOGLE_PLACES_API_KEY or GOOGLE_PLACE_ID" },
      { status: 500 },
    );
  }

  try {
    const res = await fetch(
      `https://places.googleapis.com/v1/places/${PLACE_ID}`,
      {
        headers: {
          "X-Goog-Api-Key": API_KEY,
          "X-Goog-FieldMask": FIELD_MASK,
        },
        next: { revalidate: 3600 },
      },
    );

    if (!res.ok) {
      const text = await res.text();
      return NextResponse.json(
        { error: "Google API error", status: res.status, body: text },
        { status: 502 },
      );
    }

    const data = await res.json();
    return NextResponse.json(data, {
      headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=7200" },
    });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to fetch place data", detail: String(err) },
      { status: 500 },
    );
  }
}
