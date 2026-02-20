import { ImageResponse } from "next/og";

export const runtime = "edge";

export async function GET() {
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
          background: "linear-gradient(135deg, #fef3c7 0%, #f59e0b 50%, #b45309 100%)",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div style={{ fontSize: 72, fontWeight: 800, color: "#451a03", marginBottom: 16 }}>
          GoldGift
        </div>
        <div style={{ fontSize: 36, color: "#78350f", marginBottom: 8 }}>
          Create a Gold Gift Card
        </div>
        <div style={{ fontSize: 24, color: "#92400e" }}>Send value that appreciates</div>
        <div style={{ position: "absolute", bottom: 24, fontSize: 18, color: "#78350f" }}>
          Powered by Oro × Solana Blinks
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
