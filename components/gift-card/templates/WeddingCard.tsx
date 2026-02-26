"use client";

import { GiftCardTemplate } from "../GiftCardTemplate";
import type { Gift } from "@/types/gift";

export function WeddingCard({
  gift,
  className,
}: {
  gift: Pick<Gift, "amount_usd" | "amount_gold" | "occasion" | "message" | "claimed" | "image_url" | "card_variant">;
  className?: string;
}) {
  const variant = gift.card_variant ?? "wedding-1";

  const variants: Record<string, { gradient: string; decoration: React.ReactNode }> = {
    "wedding-1": {
      gradient: "from-pink-400 to-rose-600",
      decoration: (
        <div className="absolute top-2 right-2 text-3xl opacity-90" aria-hidden>
          💒💍
        </div>
      ),
    },
    "wedding-2": {
      gradient: "from-rose-300 to-amber-300",
      decoration: (
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.4),_transparent_60%)]" aria-hidden />
      ),
    },
    "wedding-3": {
      gradient: "from-slate-800 to-slate-900",
      decoration: (
        <div className="absolute bottom-3 right-4 text-3xl opacity-90" aria-hidden>
          🕯️
        </div>
      ),
    },
    "wedding-4": {
      gradient: "from-emerald-400 to-teal-500",
      decoration: (
        <div className="absolute inset-x-4 top-3 flex justify-between text-2xl opacity-80" aria-hidden>
          <span>💐</span>
          <span>💐</span>
        </div>
      ),
    },
    "wedding-5": {
      gradient: "from-stone-200 to-stone-400",
      decoration: (
        <div className="absolute inset-3 border border-white/40 rounded-2xl" aria-hidden />
      ),
    },
  };

  const style = variants[variant] ?? variants["wedding-1"];

  return (
    <GiftCardTemplate
      gift={gift}
      gradientClass={style.gradient}
      className={className}
      decoration={style.decoration}
    />
  );
}
