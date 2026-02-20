import type { Occasion } from "@/types/gift";

export function formatUsd(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatGold(amount: number): string {
  return `${amount.toFixed(4)} GOLD`;
}

export function truncateWallet(address: string, chars = 4): string {
  if (address.length <= chars * 2) return address;
  return `${address.slice(0, chars)}...${address.slice(-chars)}`;
}

const OCCASION_EMOJI: Record<Occasion, string> = {
  birthday: "🎂",
  wedding: "💒",
  graduation: "🎓",
  thankyou: "🙏",
};

export function getOccasionEmoji(occasion: Occasion): string {
  return OCCASION_EMOJI[occasion] ?? "🎁";
}

const OCCASION_GRADIENT: Record<Occasion, string> = {
  birthday: "from-purple-500 to-blue-600",
  wedding: "from-pink-400 to-rose-600",
  graduation: "from-blue-500 to-indigo-600",
  thankyou: "from-amber-400 to-orange-500",
};

export function getOccasionGradient(occasion: Occasion): string {
  return OCCASION_GRADIENT[occasion] ?? "from-gold-400 to-gold-600";
}

export function formatRelativeTime(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffSec < 60) return "just now";
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHour < 24) return `${diffHour}h ago`;
  if (diffDay < 7) return `${diffDay}d ago`;
  return date.toLocaleDateString();
}
