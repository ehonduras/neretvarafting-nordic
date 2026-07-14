const API_KEY = process.env.GOOGLE_PLACES_API_KEY ?? "";
const PLACE_ID = process.env.GOOGLE_PLACE_ID ?? "";

const FIELD_MASK = "rating,userRatingCount,reviews";

export type GoogleReview = {
  authorAttribution: {
    displayName: string;
    photoUri?: string;
  };
  rating: number;
  text?: { text: string };
  relativePublishTimeDescription: string;
};

export type PlaceReviewData = {
  rating: number;
  userRatingCount: number;
  reviews: GoogleReview[];
  /** True when this data is from the live Google Places API. False = static fallback. */
  isLive: boolean;
};

const FALLBACK_DATA: PlaceReviewData = {
  rating: 4.9,
  userRatingCount: 127,
  isLive: false,
  reviews: [
    {
      authorAttribution: { displayName: "Marko T." },
      rating: 5,
      text: { text: "Incredible canyon, professional crew. The BBQ lunch by the river was a highlight. Would do it again in a heartbeat." },
      relativePublishTimeDescription: "2 months ago",
    },
    {
      authorAttribution: { displayName: "Laura S." },
      rating: 5,
      text: { text: "Best day of our Bosnia trip. The guides knew every rock and made us feel completely safe. Crystal clear water and stunning gorges." },
      relativePublishTimeDescription: "3 weeks ago",
    },
    {
      authorAttribution: { displayName: "Jan K." },
      rating: 5,
      text: { text: "Klare Preise, super Organisation, wunderschöner Fluss. Wir kommen nächsten Sommer wieder!" },
      relativePublishTimeDescription: "1 month ago",
    },
  ],
};

export async function getGoogleReviews(): Promise<PlaceReviewData> {
  if (!API_KEY || !PLACE_ID) return FALLBACK_DATA;

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

    if (!res.ok) return FALLBACK_DATA;

    const data = await res.json();
    const filtered = (data.reviews ?? []).filter(
      (r: GoogleReview) => r.rating >= 4 && r.text?.text,
    );

    if (filtered.length === 0) return FALLBACK_DATA;

    return {
      rating: data.rating ?? 0,
      userRatingCount: data.userRatingCount ?? 0,
      reviews: filtered,
      isLive: true,
    };
  } catch {
    return FALLBACK_DATA;
  }
}
