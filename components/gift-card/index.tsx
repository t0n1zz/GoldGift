"use client";

import type { Gift } from "@/types/gift";
import { BirthdayCard } from "./templates/BirthdayCard";
import { WeddingCard } from "./templates/WeddingCard";
import { GraduationCard } from "./templates/GraduationCard";
import { ThankYouCard } from "./templates/ThankYouCard";

const cardProps = {
  amount_usd: 0,
  amount_gold: 0,
  occasion: "birthday" as const,
  message: null as string | null,
  claimed: false,
  image_url: null as string | null,
  card_variant: null as string | null,
};

export function GiftCard({
  gift,
  className,
}: {
  gift: Pick<Gift, "amount_usd" | "amount_gold" | "occasion" | "message" | "claimed" | "image_url" | "card_variant">;
  className?: string;
}) {
  const props = { gift: { ...cardProps, ...gift }, className };
  switch (gift.occasion) {
    case "birthday":
      return <BirthdayCard {...props} />;
    case "wedding":
      return <WeddingCard {...props} />;
    case "graduation":
      return <GraduationCard {...props} />;
    case "thankyou":
      return <ThankYouCard {...props} />;
    default:
      return <BirthdayCard {...props} />;
  }
}
