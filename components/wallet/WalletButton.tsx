"use client";

import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { cn } from "@/lib/utils/cn";

export function WalletButton({ className }: { className?: string }) {
  return (
    <WalletMultiButton
      className={cn(
        "!rounded-xl !h-10 !px-4 !bg-amber-700 !text-white hover:!bg-amber-800 !font-medium !text-sm !transition-colors",
        className
      )}
    />
  );
}
