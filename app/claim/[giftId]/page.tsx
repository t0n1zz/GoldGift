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
    <div className="min-h-screen bg-gradient-to-b from-gold-50 to-white">
      <header className="border-b border-gold-100 bg-white/80 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
          <Link href="/" className="text-xl font-bold bg-gold-gradient bg-clip-text text-transparent">
            GoldGift
          </Link>
          <WalletButton />
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-12">
        <div className="mx-auto max-w-md space-y-8">
          <GiftCard gift={gift} />
          <ClaimGiftForm gift={gift} />
        </div>
        <p className="mt-8 text-center">
          <Link href="/create" className="text-gold-600 hover:underline">
            Create your own gold gift
          </Link>
        </p>
      </main>
    </div>
  );
}
