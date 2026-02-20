import Link from "next/link";
import { WalletButton } from "@/components/wallet/WalletButton";
import { CreateGiftForm } from "@/components/forms/CreateGiftForm";

export default function CreatePage() {
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
        <h1 className="text-2xl font-semibold text-stone-900 tracking-tight">
          Create a gold gift card
        </h1>
        <p className="mt-1 text-stone-600">
          Set the amount, occasion, and an optional message. Recipient gets a link to claim.
        </p>
        <div className="mt-8 max-w-md">
          <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
            <CreateGiftForm />
          </div>
        </div>
      </main>
    </div>
  );
}
