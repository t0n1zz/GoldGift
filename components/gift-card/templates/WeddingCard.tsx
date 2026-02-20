"use client";

import { GiftCardTemplate } from "../GiftCardTemplate";
import type { Gift } from "@/types/gift";

export function WeddingCard({
  gift,
  className,
}: {
  gift: Pick<Gift, "amount_usd" | "amount_gold" | "occasion" | "message" | "claimed">;
  className?: string;
}) {
  return (
    <GiftCardTemplate
      gift={gift}
      gradientClass="from-pink-400 to-rose-600"
      className={className}
      decoration={
        <div className="absolute top-2 right-2 text-3xl opacity-90" aria-hidden>
          💒💍
        </div>
      }
    />
  );
}
