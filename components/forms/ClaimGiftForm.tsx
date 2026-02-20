"use client";

import { useState } from "react";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { Transaction } from "@/lib/solana/legacy-boundary";
import type { Gift } from "@/types/gift";

type Status = "idle" | "loading" | "success" | "error";

export function ClaimGiftForm({
  gift,
  onClaimed,
}: {
  gift: Gift;
  onClaimed?: () => void;
}) {
  const { publicKey, connected, sendTransaction } = useWallet();
  const { connection } = useConnection();
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  const handleClaim = async () => {
    if (!connected || !publicKey || gift.claimed) return;
    setStatus("loading");
    setError("");
    try {
      const res = await fetch("/api/grail/transfer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fromEscrow: gift.escrow_account,
          toWallet: publicKey.toBase58(),
          amountGold: Number(gift.amount_gold),
          giftId: gift.id,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Transfer failed");

      const txBuf = Buffer.from(data.transaction, "base64");
      const tx = Transaction.from(txBuf);
      const sig = await sendTransaction(tx, connection, { skipPreflight: false });
      await connection.confirmTransaction(sig, "confirmed");

      await fetch("/api/gifts/claim", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          gift_id: gift.id,
          recipient_wallet: publicKey.toBase58(),
          transaction_signature: sig,
        }),
      });
      setStatus("success");
      onClaimed?.();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Claim failed");
      setStatus("error");
    }
  };

  if (gift.claimed) {
    return (
      <div className="rounded-xl border border-gold-200 bg-gold-50/50 p-6 text-center">
        <p className="text-gold-800 font-medium">This gift has already been claimed.</p>
      </div>
    );
  }

  if (!connected) {
    return (
      <div className="rounded-xl border border-gold-200 bg-gold-50/50 p-6 text-center">
        <p className="text-foreground/80">Connect your wallet to claim this gift.</p>
      </div>
    );
  }

  if (status === "success") {
    return (
      <div className="rounded-xl border border-gold-200 bg-gold-50/50 p-6 text-center">
        <p className="text-gold-800 font-medium">You claimed your gold! 🎉</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <button
        type="button"
        onClick={handleClaim}
        disabled={status === "loading"}
        className="w-full rounded-lg bg-gradient-to-r from-gold-500 to-gold-600 py-3 text-white font-medium hover:from-gold-400 hover:to-gold-500 disabled:opacity-50"
      >
        {status === "loading" ? "Confirm in wallet..." : "Claim Gift"}
      </button>
      {error && <p className="text-red-600 text-sm text-center">{error}</p>}
    </div>
  );
}
