"use client";

import { useState } from "react";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { OCCASIONS, MIN_GIFT_USD, MAX_GIFT_USD, MAX_MESSAGE_LENGTH } from "@/lib/utils/constants";
import { formatGold } from "@/lib/utils/formatting";
import { Transaction } from "@/lib/solana/legacy-boundary";

type Status = "idle" | "loading-quote" | "loading-create" | "signing" | "success" | "error";

export function CreateGiftForm() {
  const { publicKey, connected, sendTransaction } = useWallet();
  const { connection } = useConnection();
  const [amount, setAmount] = useState("");
  const [occasion, setOccasion] = useState<"birthday" | "wedding" | "graduation" | "thankyou">("birthday");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");
  const [claimUrl, setClaimUrl] = useState("");
  const [quote, setQuote] = useState<{ amountGold: number; rate?: number } | null>(null);

  const amountNum = parseFloat(amount) || 0;
  const validAmount = amountNum >= MIN_GIFT_USD && amountNum <= MAX_GIFT_USD;

  const fetchQuote = async () => {
    if (!validAmount) return;
    setStatus("loading-quote");
    setError("");
    try {
      const res = await fetch("/api/grail/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amountUsd: amountNum }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Quote failed");
      setQuote({ amountGold: data.amountGold, rate: data.rate });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to get quote");
    } finally {
      setStatus("idle");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!connected || !publicKey || !validAmount) return;
    setStatus("loading-create");
    setError("");
    try {
      const createRes = await fetch("/api/gifts/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sender_wallet: publicKey.toBase58(),
          amount_usd: amountNum,
          occasion,
          message: message.slice(0, MAX_MESSAGE_LENGTH) || null,
        }),
      });
      const createData = await createRes.json();
      if (!createRes.ok) throw new Error(createData.error ?? "Create failed");

      setStatus("signing");
      const buyRes = await fetch("/api/grail/buy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amountUsd: amountNum,
          buyerWallet: publicKey.toBase58(),
          giftId: createData.id,
        }),
      });
      const buyData = await buyRes.json();
      if (!buyRes.ok) throw new Error(buyData.error ?? "Buy tx failed");

      const txBuf = Buffer.from(buyData.transaction, "base64");
      const tx = Transaction.from(txBuf);
      const sig = await sendTransaction(tx, connection, { skipPreflight: false });
      await connection.confirmTransaction(sig, "confirmed");

      await fetch(`/api/gifts/${createData.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transaction_signature: sig, escrow_account: buyData.escrowAccount }),
      });

      setClaimUrl(createData.claim_url);
      setStatus("success");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
      setStatus("error");
    }
  };

  if (!connected) {
    return (
      <div className="rounded-xl border border-gold-200 bg-gold-50/50 p-6 text-center">
        <p className="text-foreground/80">Connect your wallet to create a gold gift card.</p>
      </div>
    );
  }

  if (status === "success" && claimUrl) {
    return (
      <div className="rounded-xl border border-gold-200 bg-gold-50/50 p-6 space-y-4">
        <p className="font-medium text-gold-800">Gift created! Share this link:</p>
        <div className="flex gap-2">
          <input
            readOnly
            value={claimUrl}
            className="flex-1 rounded-lg border border-gold-200 bg-white px-3 py-2 text-sm"
          />
          <button
            type="button"
            onClick={() => navigator.clipboard.writeText(claimUrl)}
            className="rounded-lg bg-gold-500 px-4 py-2 text-white font-medium hover:bg-gold-600"
          >
            Copy
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-foreground mb-1">Amount (USD)</label>
        <input
          type="number"
          min={MIN_GIFT_USD}
          max={MAX_GIFT_USD}
          step="1"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          onBlur={() => validAmount && fetchQuote()}
          className="w-full rounded-lg border border-gold-200 bg-white px-3 py-2"
          placeholder={`$${MIN_GIFT_USD} - $${MAX_GIFT_USD}`}
        />
        {quote && validAmount && (
          <p className="mt-1 text-sm text-foreground/70">
            ≈ {formatGold(quote.amountGold)}
          </p>
        )}
      </div>
      <div>
        <label className="block text-sm font-medium text-foreground mb-1">Occasion</label>
        <select
          value={occasion}
          onChange={(e) => setOccasion(e.target.value as typeof occasion)}
          className="w-full rounded-lg border border-gold-200 bg-white px-3 py-2"
        >
          {OCCASIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.emoji} {o.label}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-foreground mb-1">Message (optional)</label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          maxLength={MAX_MESSAGE_LENGTH}
          rows={2}
          className="w-full rounded-lg border border-gold-200 bg-white px-3 py-2 text-sm"
          placeholder="Happy birthday!"
        />
        <p className="text-xs text-foreground/60 mt-1">{message.length}/{MAX_MESSAGE_LENGTH}</p>
      </div>
      {error && <p className="text-red-600 text-sm">{error}</p>}
      <button
        type="submit"
        disabled={!validAmount || status === "loading-create" || status === "signing"}
        className="w-full rounded-lg bg-gradient-to-r from-gold-500 to-gold-600 py-3 text-white font-medium hover:from-gold-400 hover:to-gold-500 disabled:opacity-50"
      >
        {status === "loading-create" || status === "signing"
          ? status === "signing"
            ? "Confirm in wallet..."
            : "Creating..."
          : "Create Gold Gift"}
      </button>
    </form>
  );
}
