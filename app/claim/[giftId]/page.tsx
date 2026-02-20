import Link from "next/link";
import { notFound } from "next/navigation";
import { WalletButton } from "@/components/wallet/WalletButton";
import { GiftCard } from "@/components/gift-card";
import { ClaimGiftForm } from "@/components/forms/ClaimGiftForm";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { isValidGiftId } from "@/lib/utils/gift-id";

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
    <div className="min-h-screen bg-stone-50">
      <header className="sticky top-0 z-10 border-b border-stone-200 bg-white/95 backdrop-blur-sm">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
          <Link href="/" className="text-lg font-semibold text-stone-900 tracking-tight">
            GoldGift
          </Link>
          <WalletButton />
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-12">
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
    </div>
  );
}
