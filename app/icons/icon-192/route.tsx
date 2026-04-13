import { ImageResponse } from "next/og";

export const runtime = "edge";

export function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 192,
          height: 192,
          background: "#3C2415",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#F5F2ED",
          fontSize: 120,
          fontWeight: 700,
          fontFamily: "serif",
          letterSpacing: "-3px",
        }}
      >
        L
      </div>
    ),
    { width: 192, height: 192 }
  );
}
