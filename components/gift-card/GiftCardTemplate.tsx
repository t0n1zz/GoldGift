"use client";

import { cn } from "@/lib/utils/cn";
import type { Gift } from "@/types/gift";
import { formatUsd, formatGold, getOccasionEmoji } from "@/lib/utils/formatting";

interface GiftCardTemplateProps {
  gift: Pick<Gift, "amount_usd" | "amount_gold" | "occasion" | "message" | "claimed">;
  className?: string;
  children?: React.ReactNode;
  gradientClass?: string;
  decoration?: React.ReactNode;
}

export function GiftCardTemplate({
  gift,
  className,
  children,
  gradientClass = "from-gold-400 to-gold-600",
  decoration,
}: GiftCardTemplateProps) {
  const emoji = getOccasionEmoji(gift.occasion);
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl shadow-xl aspect-[1.6/1] min-h-[200px] p-6 flex flex-col justify-between bg-gradient-to-br transition hover:shadow-2xl hover:-translate-y-0.5",
        gradientClass,
        className
      )}
    >
      {decoration}
      {gift.claimed && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-2xl z-10">
          <span className="text-5xl">✓</span>
        </div>
      )}
      <div className="relative z-0">
        <span className="text-2xl" aria-hidden>{emoji}</span>
        <p className="text-2xl font-bold text-white drop-shadow mt-2">
          {formatUsd(Number(gift.amount_usd))}
        </p>
        <p className="text-sm text-white/90">{formatGold(Number(gift.amount_gold))}</p>
      </div>
      {gift.message && (
        <p className="relative z-0 text-sm text-white/95 mt-2 line-clamp-2">{gift.message}</p>
      )}
      <p className="relative z-0 text-xs text-white/80 mt-auto pt-2">
        Powered by GoldGift × Oro
      </p>
      {children}
    </div>
  );
}
