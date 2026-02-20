"use client";

import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { cn } from "@/lib/utils/cn";

export function WalletButton({ className }: { className?: string }) {
  return (
    <WalletMultiButton
      className={cn(
        "!rounded-lg !h-10 !px-4 !bg-gradient-to-r !from-gold-500 !to-gold-600 !text-gold-950 hover:!from-gold-400 hover:!to-gold-500 !font-medium !transition-all",
        className
      )}
    />
  );
}
