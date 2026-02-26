"use client";

import { cn } from "@/lib/utils/cn";
import type { Gift } from "@/types/gift";
import { formatUsd, formatGold, getOccasionEmoji } from "@/lib/utils/formatting";

interface GiftCardTemplateProps {
  gift: Pick<Gift, "amount_usd" | "amount_gold" | "occasion" | "message" | "claimed" | "image_url">;
  className?: string;
  children?: React.ReactNode;
  gradientClass?: string;
  decoration?: React.ReactNode;
}

export function GiftCardTemplate({
  gift,
  className,
  children,
  gradientClass = "from-amber-400 to-amber-600",
  decoration,
}: GiftCardTemplateProps) {
  const emoji = getOccasionEmoji(gift.occasion);
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl shadow-md aspect-[1.6/1] min-h-[200px] p-6 flex flex-col justify-between bg-gradient-to-br transition hover:shadow-lg",
        gradientClass,
        className
      )}
    >
      {gift.image_url && (
        <div className="absolute inset-0 z-0">
          <img
            src={gift.image_url}
            alt=""
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-black/20" />
        </div>
      )}
      {decoration}
      {gift.claimed && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/25 rounded-2xl z-20">
          <span className="text-5xl text-white drop-shadow">✓</span>
        </div>
      )}
      <div className="relative z-10">
        <span className="text-2xl drop-shadow-sm" aria-hidden>{emoji}</span>
        <p className="text-2xl font-semibold text-white drop-shadow mt-2">
          {formatUsd(Number(gift.amount_usd))}
        </p>
        <p className="text-sm text-white/95">{formatGold(Number(gift.amount_gold))}</p>
      </div>
      {gift.message && (
        <p className="relative z-10 text-sm text-white/95 mt-2 line-clamp-2">{gift.message}</p>
      )}
      <p className="relative z-10 text-xs text-white/90 mt-auto pt-2">
        GoldGift × Oro
      </p>
      {children}
    </div>
  );
}
