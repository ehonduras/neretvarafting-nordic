import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#064e3b",
          borderRadius: 6,
          fontSize: 20,
          fontWeight: 900,
          color: "#10b981",
          fontFamily: "sans-serif",
        }}
      >
        N
      </div>
    ),
    { ...size },
  );
}
