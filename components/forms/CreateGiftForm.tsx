"use client";

import { useState, useCallback } from "react";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { OCCASIONS, MIN_GIFT_USD, MAX_GIFT_USD, MAX_MESSAGE_LENGTH } from "@/lib/utils/constants";
import { formatGold } from "@/lib/utils/formatting";
import { getClaimBlinkUrl } from "@/lib/utils/gift-id";
import { Transaction } from "@/lib/solana/legacy-boundary";
import { createClient as createSupabaseClient } from "@/lib/supabase/client";

type Status = "idle" | "loading-quote" | "loading-create" | "signing" | "success" | "error";

export function CreateGiftForm() {
  const { publicKey, connected, sendTransaction } = useWallet();
  const { connection } = useConnection();
  const [amount, setAmount] = useState("");
  const [occasion, setOccasion] = useState<"birthday" | "wedding" | "graduation" | "thankyou">("birthday");
  const [message, setMessage] = useState("");
  const [cardImage, setCardImage] = useState<File | null>(null);
  const [cardImagePreview, setCardImagePreview] = useState<string | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");
  const [claimUrl, setClaimUrl] = useState("");
  const [createdGiftId, setCreatedGiftId] = useState<string | null>(null);
  const [copied, setCopied] = useState<"claim" | "blink" | null>(null);
  const [quote, setQuote] = useState<{ amountGold: number; rate?: number } | null>(null);

  const copyWithFeedback = useCallback(async (text: string, which: "claim" | "blink") => {
    await navigator.clipboard.writeText(text);
    setCopied(which);
    setTimeout(() => setCopied(null), 2000);
  }, []);

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

      if (!buyData.escrowAccount) {
        throw new Error("Escrow not available from GRAIL; please try again.");
      }

      const txBuf = Buffer.from(buyData.transaction, "base64");
      const tx = Transaction.from(txBuf);
      const sig = await sendTransaction(tx, connection, { skipPreflight: false });
      await connection.confirmTransaction(sig, "confirmed");

      const patchRes = await fetch(`/api/gifts/${createData.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transaction_signature: sig, escrow_account: buyData.escrowAccount }),
      });
      const patchData = await patchRes.json();
      if (!patchRes.ok) {
        throw new Error(patchData.error ?? "Gift created but failed to save transaction. Share the link and contact support if the recipient cannot claim.");
      }

      // Optional: upload custom card image to Supabase Storage and attach URL
      if (cardImage) {
        const supabase = createSupabaseClient();
        const ext = cardImage.name.split(".").pop() || "jpg";
        const path = `gifts/${createData.id}-${Date.now()}.${ext}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("gift-images")
          .upload(path, cardImage, {
            cacheControl: "3600",
            upsert: true,
          });
        if (uploadError) {
          throw new Error("Gift created but failed to upload card image. Please try again.");
        }
        const { data: publicUrlData } = supabase.storage.from("gift-images").getPublicUrl(uploadData.path);
        const imageUrl = publicUrlData?.publicUrl;
        if (imageUrl) {
          await fetch(`/api/gifts/${createData.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ image_url: imageUrl }),
          });
        }
      }

      setClaimUrl(createData.claim_url);
      setCreatedGiftId(createData.id);
      setStatus("success");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
      setStatus("error");
    }
  };

  if (!connected) {
    return (
      <div className="rounded-xl border border-stone-200 bg-amber-50/50 p-6 text-center">
        <p className="text-stone-600">Connect your wallet to create a gold gift card.</p>
      </div>
    );
  }

  if (status === "success" && claimUrl) {
    const blinkUrl = typeof window !== "undefined" && createdGiftId
      ? getClaimBlinkUrl(createdGiftId, window.location.origin)
      : "";
    return (
      <div className="space-y-5">
        <p className="font-medium text-stone-900">Gift created. Share with the recipient:</p>
        <div className="space-y-2">
          <label className="text-xs font-medium text-stone-500 uppercase tracking-wide">Claim link</label>
          <div className="flex gap-2">
            <input
              readOnly
              value={claimUrl}
              className="flex-1 rounded-xl border border-stone-200 bg-stone-50 px-3 py-2.5 text-sm text-stone-900"
              aria-label="Claim URL"
            />
            <button
              type="button"
              onClick={() => copyWithFeedback(claimUrl, "claim")}
              className="rounded-xl bg-amber-700 px-4 py-2.5 text-sm font-medium text-white hover:bg-amber-800 transition-colors whitespace-nowrap"
            >
              {copied === "claim" ? "Copied!" : "Copy"}
            </button>
          </div>
        </div>
        {blinkUrl && (
          <div className="space-y-2">
            <label className="text-xs font-medium text-stone-500 uppercase tracking-wide">Or share as Blink</label>
            <div className="flex gap-2">
              <input
                readOnly
                value={blinkUrl}
                className="flex-1 rounded-xl border border-stone-200 bg-stone-50 px-3 py-2.5 text-sm text-stone-900 truncate"
                aria-label="Blink URL"
              />
              <button
                type="button"
                onClick={() => copyWithFeedback(blinkUrl, "blink")}
                className="rounded-xl border border-stone-200 bg-white px-4 py-2.5 text-sm font-medium text-stone-700 hover:bg-stone-50 transition-colors whitespace-nowrap"
              >
                {copied === "blink" ? "Copied!" : "Copy Blink"}
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="block text-sm font-medium text-stone-900 mb-1.5">Amount (USD)</label>
        <input
          type="number"
          min={MIN_GIFT_USD}
          max={MAX_GIFT_USD}
          step="1"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          onBlur={() => validAmount && fetchQuote()}
          className="w-full rounded-xl border border-stone-200 bg-white px-3 py-2.5 text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500"
          placeholder={`${MIN_GIFT_USD} – ${MAX_GIFT_USD}`}
        />
        {quote && validAmount && (
          <p className="mt-1.5 text-sm text-stone-600">≈ {formatGold(quote.amountGold)}</p>
        )}
      </div>
      <div>
        <label className="block text-sm font-medium text-stone-900 mb-1.5">Occasion</label>
        <select
          value={occasion}
          onChange={(e) => setOccasion(e.target.value as typeof occasion)}
          className="w-full rounded-xl border border-stone-200 bg-white px-3 py-2.5 text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500"
        >
          {OCCASIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.emoji} {o.label}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-stone-900 mb-1.5">Card image (optional)</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0] ?? null;
            setCardImage(file);
            if (file) {
              setCardImagePreview(URL.createObjectURL(file));
            } else {
              setCardImagePreview(null);
            }
          }}
          className="block w-full text-sm text-stone-700 file:mr-3 file:rounded-lg file:border-0 file:bg-amber-700 file:px-3 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-amber-800"
        />
        {cardImagePreview && (
          <div className="mt-2">
            <p className="text-xs text-stone-500 mb-1">Preview</p>
            <div className="overflow-hidden rounded-xl border border-stone-200 bg-stone-50">
              <img
                src={cardImagePreview}
                alt="Card preview"
                className="h-32 w-full object-cover"
              />
            </div>
          </div>
        )}
      </div>
      <div>
        <label className="block text-sm font-medium text-stone-900 mb-1.5">Message (optional)</label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          maxLength={MAX_MESSAGE_LENGTH}
          rows={2}
          className="w-full rounded-xl border border-stone-200 bg-white px-3 py-2.5 text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 resize-none"
          placeholder="Happy birthday!"
        />
        <p className="mt-1 text-xs text-stone-500">{message.length} / {MAX_MESSAGE_LENGTH}</p>
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button
        type="submit"
        disabled={!validAmount || status === "loading-create" || status === "signing"}
        className="w-full rounded-xl bg-amber-700 py-3 text-sm font-medium text-white hover:bg-amber-800 disabled:opacity-50 disabled:pointer-events-none transition-colors"
      >
        {status === "loading-create" || status === "signing"
          ? status === "signing"
            ? "Confirm in wallet…"
            : "Creating…"
          : "Create gold gift"}
      </button>
    </form>
  );
}
