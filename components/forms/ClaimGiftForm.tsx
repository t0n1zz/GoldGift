"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
  const router = useRouter();
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

      const claimRes = await fetch("/api/gifts/claim", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          gift_id: gift.id,
          recipient_wallet: publicKey.toBase58(),
          transaction_signature: sig,
        }),
      });
      const claimData = await claimRes.json();
      if (!claimRes.ok) {
        throw new Error(claimData.error ?? "Failed to record claim");
      }
      setStatus("success");
      onClaimed?.();
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Claim failed");
      setStatus("error");
    }
  };

  if (gift.claimed) {
    return (
      <div className="rounded-2xl border border-stone-200 bg-white p-6 text-center">
        <p className="font-medium text-stone-900">This gift has already been claimed.</p>
      </div>
    );
  }

  if (!gift.escrow_account) {
    return (
      <div className="rounded-2xl border border-stone-200 bg-amber-50/80 p-6 text-center">
        <p className="font-medium text-stone-900">This gift isn&apos;t ready to claim yet.</p>
        <p className="mt-1 text-sm text-stone-600">The sender may still be completing the transaction. Try again in a moment.</p>
      </div>
    );
  }

  if (!connected) {
    return (
      <div className="rounded-2xl border border-stone-200 bg-white p-6 text-center">
        <p className="text-stone-600">Connect your wallet to claim this gift.</p>
      </div>
    );
  }

  if (status === "success") {
    return (
      <div className="rounded-2xl border border-stone-200 bg-white p-6 text-center">
        <p className="font-medium text-stone-900">You claimed your gold.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <button
        type="button"
        onClick={handleClaim}
        disabled={status === "loading"}
        className="w-full rounded-xl bg-amber-700 py-3 text-sm font-medium text-white hover:bg-amber-800 disabled:opacity-50 transition-colors"
      >
        {status === "loading" ? "Confirm in wallet…" : "Claim gift"}
      </button>
      {error && <p className="text-sm text-red-600 text-center">{error}</p>}
    </div>
  );
}
