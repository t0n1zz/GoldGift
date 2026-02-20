import { ImageResponse } from "next/og";

export const runtime = "edge";

const OCCASIONS: Record<string, { emoji: string; gradient: string; title: string }> = {
  birthday: {
    emoji: "🎂",
    gradient: "linear-gradient(135deg, #7c3aed 0%, #2563eb 100%)",
    title: "You received a gold gift!",
  },
  wedding: {
    emoji: "💒",
    gradient: "linear-gradient(135deg, #f472b6 0%, #e11d48 100%)",
    title: "You received a gold gift!",
  },
  graduation: {
    emoji: "🎓",
    gradient: "linear-gradient(135deg, #3b82f6 0%, #4f46e5 100%)",
    title: "You received a gold gift!",
  },
  thankyou: {
    emoji: "🙏",
    gradient: "linear-gradient(135deg, #fbbf24 0%, #ea580c 100%)",
    title: "You received a gold gift!",
  },
};

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ occasion: string }> }
) {
  const { occasion } = await params;
  const config = OCCASIONS[occasion] ?? OCCASIONS.thankyou;
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
          background: config.gradient,
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div style={{ fontSize: 100, marginBottom: 24 }}>{config.emoji}</div>
        <div style={{ fontSize: 48, fontWeight: 700, color: "white", marginBottom: 12 }}>
          GoldGift
        </div>
        <div style={{ fontSize: 32, color: "rgba(255,255,255,0.95)" }}>{config.title}</div>
        <div style={{ position: "absolute", bottom: 24, fontSize: 18, color: "rgba(255,255,255,0.9)" }}>
          Powered by Oro × Solana Blinks
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
