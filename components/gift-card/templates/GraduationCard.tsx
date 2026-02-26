"use client";

import { GiftCardTemplate } from "../GiftCardTemplate";
import type { Gift } from "@/types/gift";

export function GraduationCard({
  gift,
  className,
}: {
  gift: Pick<Gift, "amount_usd" | "amount_gold" | "occasion" | "message" | "claimed" | "image_url" | "card_variant">;
  className?: string;
}) {
  const variant = gift.card_variant ?? "graduation-1";

  const variants: Record<string, { gradient: string; decoration: React.ReactNode }> = {
    "graduation-1": {
      gradient: "from-blue-500 to-indigo-600",
      decoration: (
        <div className="absolute top-2 right-2 text-3xl opacity-90" aria-hidden>
          🎓
        </div>
      ),
    },
    "graduation-2": {
      gradient: "from-slate-900 to-slate-700",
      decoration: (
        <div className="absolute inset-x-4 bottom-4 flex justify-between text-2xl opacity-80" aria-hidden>
          <span>📜</span>
          <span>🎓</span>
        </div>
      ),
    },
    "graduation-3": {
      gradient: "from-amber-500 to-emerald-500",
      decoration: (
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.35),_transparent_70%)]" aria-hidden />
      ),
    },
    "graduation-4": {
      gradient: "from-indigo-500 to-purple-600",
      decoration: (
        <div className="absolute -left-3 -top-3 h-20 w-20 rounded-full bg-white/15 blur-xl" aria-hidden />
      ),
    },
    "graduation-5": {
      gradient: "from-stone-800 to-stone-900",
      decoration: (
        <div className="absolute inset-3 border border-white/20 rounded-2xl" aria-hidden />
      ),
    },
  };

  const style = variants[variant] ?? variants["graduation-1"];

  return (
    <GiftCardTemplate
      gift={gift}
      gradientClass={style.gradient}
      className={className}
      decoration={style.decoration}
    />
  );
}
