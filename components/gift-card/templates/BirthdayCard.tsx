"use client";

import { GiftCardTemplate } from "../GiftCardTemplate";
import type { Gift } from "@/types/gift";

export function BirthdayCard({
  gift,
  className,
}: {
  gift: Pick<Gift, "amount_usd" | "amount_gold" | "occasion" | "message" | "claimed" | "image_url" | "card_variant">;
  className?: string;
}) {
  const variant = gift.card_variant ?? "birthday-1";

  const variants: Record<string, { gradient: string; decoration: React.ReactNode }> = {
    "birthday-1": {
      gradient: "from-purple-500 to-blue-600",
      decoration: (
        <div className="absolute top-2 right-2 text-3xl opacity-80" aria-hidden>
          🎈🎂
        </div>
      ),
    },
    "birthday-2": {
      gradient: "from-fuchsia-500 to-rose-500",
      decoration: (
        <div className="absolute inset-x-4 top-3 flex justify-between text-2xl opacity-90" aria-hidden>
          <span>🎉</span>
          <span>🎉</span>
        </div>
      ),
    },
    "birthday-3": {
      gradient: "from-sky-500 to-cyan-500",
      decoration: (
        <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-white/15 blur-xl" aria-hidden />
      ),
    },
    "birthday-4": {
      gradient: "from-amber-400 to-pink-500",
      decoration: (
        <div className="absolute bottom-4 right-4 text-4xl opacity-90" aria-hidden>
          🎁
        </div>
      ),
    },
    "birthday-5": {
      gradient: "from-emerald-500 to-teal-500",
      decoration: (
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.18),_transparent_60%)]" aria-hidden />
      ),
    },
  };

  const style = variants[variant] ?? variants["birthday-1"];

  return (
    <GiftCardTemplate
      gift={gift}
      gradientClass={style.gradient}
      className={className}
      decoration={style.decoration}
    />
  );
}
