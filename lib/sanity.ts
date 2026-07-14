import { createClient } from "next-sanity";
import imageUrlBuilder from "@sanity/image-url";

type SanityImageSource = Parameters<ReturnType<typeof imageUrlBuilder>["image"]>[0];

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "eg9nka5c";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";

export const sanityClient = createClient({
  projectId,
  dataset,
  apiVersion: "2024-01-01",
  useCdn: true,
});

const builder = imageUrlBuilder({ projectId, dataset });

export function urlFor(source: SanityImageSource) {
  return builder.image(source);
}

export type SanityHeroImage = {
  _id: string;
  image: SanityImageSource;
  alt: string | null;
};

export type SanityGalleryItem = {
  _key: string;
  image: SanityImageSource;
  label: string;
};

export async function getHeroImage(): Promise<SanityHeroImage | null> {
  return sanityClient.fetch(
    `*[_type == "heroImage"][0]{ _id, image, alt }`,
  );
}

export async function getCtaImage(): Promise<SanityHeroImage | null> {
  return sanityClient.fetch(
    `*[_type == "ctaImage"][0]{ _id, image, alt }`,
  );
}

export async function getGalleryImages(): Promise<SanityGalleryItem[]> {
  const doc = await sanityClient.fetch<{ images: SanityGalleryItem[] } | null>(
    `*[_type == "gallery"][0]{ images[]{ _key, image, label } }`,
  );
  return doc?.images ?? [];
}
