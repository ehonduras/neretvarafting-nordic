import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Neretva Rafting Konjic";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#064e3b",
          color: "#ffffff",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ fontSize: 72, fontWeight: 800, letterSpacing: -2 }}>
          Neretva Rafting
        </div>
        <div
          style={{
            fontSize: 28,
            color: "#10b981",
            marginTop: 16,
            fontWeight: 600,
          }}
        >
          Konjic · Bosnia & Herzegovina
        </div>
        <div
          style={{
            fontSize: 20,
            color: "rgba(255,255,255,0.6)",
            marginTop: 32,
          }}
        >
          neretvarafting.co
        </div>
      </div>
    ),
    { ...size },
  );
}
