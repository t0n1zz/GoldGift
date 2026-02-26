import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { WalletButton } from "@/components/wallet/WalletButton";
import { ThemeToggle } from "@/components/ThemeToggle";
import { GiftCard } from "@/components/gift-card";
import { ClaimGiftForm } from "@/components/forms/ClaimGiftForm";
import { SiteFooter } from "@/components/SiteFooter";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { isValidGiftId } from "@/lib/utils/gift-id";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ giftId: string }>;
}): Promise<Metadata> {
  const { giftId } = await params;
  if (!isValidGiftId(giftId)) return { title: "Gift not found — GoldGift" };
  const supabase = createServerSupabaseClient();
  const { data: gift } = await supabase
    .from("gifts")
    .select("amount_usd, occasion, message, claimed")
    .eq("id", giftId)
    .single();
  if (!gift) return { title: "Gift not found — GoldGift" };
  const amount = Number(gift.amount_usd).toFixed(0);
  const title = gift.claimed
    ? "Gold gift claimed — GoldGift"
    : `You received a $${amount} gold gift — GoldGift`;
  const description = gift.message
    ? `"${String(gift.message).slice(0, 100)}" — Claim your gold.`
    : "Claim your gold-backed gift. One click with your wallet.";
  const ogImage = `${APP_URL.replace(/\/$/, "")}/og/${gift.occasion}`;
  return {
    title,
    description,
    openGraph: { title, description, images: [ogImage] },
    twitter: { card: "summary_large_image", title, description, images: [ogImage] },
  };
}

export default async function ClaimPage({
  params,
}: {
  params: Promise<{ giftId: string }>;
}) {
  const { giftId } = await params;
  if (!isValidGiftId(giftId)) notFound();

  const supabase = createServerSupabaseClient();
  const { data: gift, error } = await supabase.from("gifts").select("*").eq("id", giftId).single();
  if (error || !gift) notFound();

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col">
      <header className="sticky top-0 z-10 border-b border-stone-200 bg-white/95 backdrop-blur-sm">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
          <Link href="/" className="text-lg font-semibold text-stone-900 tracking-tight">
            GoldGift
          </Link>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <WalletButton />
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-12 flex-1">
        <div className="mx-auto max-w-md space-y-8">
          <GiftCard gift={gift} />
          <ClaimGiftForm gift={gift} />
        </div>
        <p className="mt-10 text-center">
          <Link
            href="/create"
            className="text-sm font-medium text-amber-700 hover:text-amber-800 transition-colors"
          >
            Create your own gold gift
          </Link>
        </p>
      </main>
      <SiteFooter />
    </div>
  );
}
