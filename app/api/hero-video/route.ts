import { NextResponse } from "next/server";

/** Runtime env — works after adding NEXT_PUBLIC_VIDEO_URL without relying on rebuild-inlined bundle only. */
export const dynamic = "force-dynamic";

export function GET() {
  const raw = process.env.NEXT_PUBLIC_VIDEO_URL;
  const url =
    typeof raw === "string" && raw.trim().length > 0 ? raw.trim() : null;
  return NextResponse.json({ url }, { headers: { "Cache-Control": "no-store" } });
}
