import { ImageResponse } from "next/og";

export const runtime = "edge";

export function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 512,
          height: 512,
          background: "#3C2415",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#F5F2ED",
          fontSize: 320,
          fontWeight: 700,
          fontFamily: "serif",
          letterSpacing: "-8px",
        }}
      >
        L
      </div>
    ),
    { width: 512, height: 512 }
  );
}
