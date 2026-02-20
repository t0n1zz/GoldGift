"use client";

import { GiftCardTemplate } from "../GiftCardTemplate";
import type { Gift } from "@/types/gift";

export function BirthdayCard({
  gift,
  className,
}: {
  gift: Pick<Gift, "amount_usd" | "amount_gold" | "occasion" | "message" | "claimed">;
  className?: string;
}) {
  return (
    <GiftCardTemplate
      gift={gift}
      gradientClass="from-purple-500 to-blue-600"
      className={className}
      decoration={
        <div className="absolute top-2 right-2 text-3xl opacity-80" aria-hidden>
          🎈🎂
        </div>
      }
    />
  );
}
