import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 180,
          height: 180,
          borderRadius: 40,
          background: "#3C2415",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#F5F2ED",
          fontSize: 110,
          fontWeight: 700,
          fontFamily: "serif",
          letterSpacing: "-2px",
        }}
      >
        L
      </div>
    ),
    { ...size }
  );
}
