"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

type Props = {
  posterSrc: string;
  posterAlt: string;
};

/** Full-bleed poster + optional MP4 from NEXT_PUBLIC_VIDEO_URL (via /api/hero-video). */
export function VideoBackdrop({ posterSrc, posterAlt }: Props) {
  const [videoUrl, setVideoUrl] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/hero-video")
      .then((r) => r.json())
      .then((data: { url: string | null }) => {
        if (!cancelled && data?.url) setVideoUrl(data.url);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="relative h-full min-h-full w-full">
      <Image
        src={posterSrc}
        alt={posterAlt}
        fill
        priority
        className="object-cover"
        sizes="100vw"
      />
      {videoUrl ? (
        <video
          className="pointer-events-none absolute inset-0 z-[1] h-full w-full object-cover motion-reduce:hidden"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster={posterSrc}
          aria-hidden
        >
          <source src={videoUrl} type="video/mp4" />
        </video>
      ) : null}
    </div>
  );
}
