import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: 8,
          background: "#3C2415",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#F5F2ED",
          fontSize: 20,
          fontWeight: 700,
          fontFamily: "serif",
          letterSpacing: "-0.5px",
        }}
      >
        L
      </div>
    ),
    { ...size }
  );
}
