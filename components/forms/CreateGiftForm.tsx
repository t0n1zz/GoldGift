"use client";

import { useState, useCallback } from "react";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { OCCASIONS, MIN_GIFT_USD, MAX_GIFT_USD, MAX_MESSAGE_LENGTH } from "@/lib/utils/constants";
import { formatGold } from "@/lib/utils/formatting";
import { getClaimBlinkUrl } from "@/lib/utils/gift-id";
import { Transaction } from "@/lib/solana/legacy-boundary";
import { createClient as createSupabaseClient } from "@/lib/supabase/client";
import { GiftCard } from "@/components/gift-card";

type Status = "idle" | "loading-quote" | "loading-create" | "signing" | "success" | "error";

export function CreateGiftForm() {
  const { publicKey, connected, sendTransaction } = useWallet();
  const { connection } = useConnection();
  const [amount, setAmount] = useState("");
  const [occasion, setOccasion] = useState<"birthday" | "wedding" | "graduation" | "thankyou">("birthday");
  const [message, setMessage] = useState("");
  const [cardVariant, setCardVariant] = useState<string | null>(null);
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
    <form
      onSubmit={handleSubmit}
      className="space-y-6 lg:space-y-0 lg:grid lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] lg:gap-8 items-start"
    >
      <div className="space-y-5">
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
            onChange={(e) => {
              const value = e.target.value as typeof occasion;
              setOccasion(value);
              setCardVariant(null);
            }}
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
          <label className="block text-sm font-medium text-stone-900 mb-1.5">
            Card style
          </label>
          <div className="flex flex-wrap gap-2">
            {["1", "2", "3", "4", "5"].map((n) => {
              const value = `${occasion}-${n}`;
              const active = cardVariant === value || (!cardVariant && n === "1");
              const label = `#${n}`;
              const gradientByOccasion: Record<string, string[]> = {
                birthday: ["from-purple-500 to-blue-600", "from-fuchsia-500 to-rose-500", "from-sky-500 to-cyan-500", "from-amber-400 to-pink-500", "from-emerald-500 to-teal-500"],
                wedding: ["from-pink-400 to-rose-600", "from-rose-300 to-amber-300", "from-slate-800 to-slate-900", "from-emerald-400 to-teal-500", "from-stone-200 to-stone-400"],
                graduation: ["from-blue-500 to-indigo-600", "from-slate-900 to-slate-700", "from-amber-500 to-emerald-500", "from-indigo-500 to-purple-600", "from-stone-800 to-stone-900"],
                thankyou: ["from-amber-400 to-orange-500", "from-emerald-400 to-lime-400", "from-sky-400 to-cyan-500", "from-stone-800 to-stone-900", "from-rose-400 to-fuchsia-500"],
              };
              const gradients = gradientByOccasion[occasion] ?? [];
              const gradient = gradients[parseInt(n, 10) - 1] ?? gradients[0] ?? "from-amber-400 to-amber-600";
              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => setCardVariant(value)}
                  className={[
                    "flex flex-col items-center gap-1 rounded-xl border px-2 py-1.5 text-xs transition",
                    active
                      ? "border-amber-600 bg-amber-50 text-amber-800"
                      : "border-stone-200 bg-white text-stone-600 hover:border-amber-500/70",
                  ].join(" ")}
                >
                  <span
                    className={`h-8 w-16 rounded-lg bg-gradient-to-r ${gradient}`}
                    aria-hidden
                  />
                  <span>{label}</span>
                </button>
              );
            })}
          </div>
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
            <div className="mt-2 overflow-hidden rounded-xl border border-stone-200 bg-stone-50">
              <img
                src={cardImagePreview}
                alt="Card preview"
                className="h-32 w-full object-cover"
              />
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
      </div>
      <div>
        <label className="block text-sm font-medium text-stone-900 mb-1.5">
          Preview
        </label>
        <div className="rounded-2xl border border-stone-200 bg-stone-50/80 p-3">
          <GiftCard
            gift={{
              amount_usd: amountNum || MIN_GIFT_USD,
              amount_gold: quote?.amountGold ?? 0,
              occasion,
              message: message || "Your message will appear here.",
              claimed: false,
              image_url: cardImagePreview ?? null,
              card_variant: cardVariant ?? `${occasion}-1`,
            }}
          />
        </div>
      </div>
    </form>
  );
}
