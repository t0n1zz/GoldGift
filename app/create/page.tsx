import Link from "next/link";
import { WalletButton } from "@/components/wallet/WalletButton";
import { CreateGiftForm } from "@/components/forms/CreateGiftForm";

export default function CreatePage() {
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
        <h1 className="text-2xl font-bold text-foreground">Create a Gold Gift Card</h1>
        <p className="mt-1 text-foreground/70">Choose amount, occasion, and message. Recipient claims with one click.</p>
        <div className="mt-8 max-w-md">
          <div className="rounded-xl border border-gold-100 bg-white p-6 shadow-sm">
            <CreateGiftForm />
          </div>
        </div>
      </main>
    </div>
  );
}
