"use client";

import { GiftCardTemplate } from "../GiftCardTemplate";
import type { Gift } from "@/types/gift";

export function ThankYouCard({
  gift,
  className,
}: {
  gift: Pick<Gift, "amount_usd" | "amount_gold" | "occasion" | "message" | "claimed" | "image_url" | "card_variant">;
  className?: string;
}) {
  const variant = gift.card_variant ?? "thankyou-1";

  const variants: Record<string, { gradient: string; decoration: React.ReactNode }> = {
    "thankyou-1": {
      gradient: "from-amber-400 to-orange-500",
      decoration: (
        <div className="absolute top-2 right-2 text-3xl opacity-90" aria-hidden>
          🙏
        </div>
      ),
    },
    "thankyou-2": {
      gradient: "from-emerald-400 to-lime-400",
      decoration: (
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.35),_transparent_70%)]" aria-hidden />
      ),
    },
    "thankyou-3": {
      gradient: "from-sky-400 to-cyan-500",
      decoration: (
        <div className="absolute inset-x-4 top-3 flex justify-between text-2xl opacity-80" aria-hidden>
          <span>⭐</span>
          <span>⭐</span>
        </div>
      ),
    },
    "thankyou-4": {
      gradient: "from-stone-800 to-stone-900",
      decoration: (
        <div className="absolute inset-3 border border-white/20 rounded-2xl" aria-hidden />
      ),
    },
    "thankyou-5": {
      gradient: "from-rose-400 to-fuchsia-500",
      decoration: (
        <div className="absolute bottom-3 right-4 text-3xl opacity-90" aria-hidden>
          💝
        </div>
      ),
    },
  };

  const style = variants[variant] ?? variants["thankyou-1"];

  return (
    <GiftCardTemplate
      gift={gift}
      gradientClass={style.gradient}
      className={className}
      decoration={style.decoration}
    />
  );
}
