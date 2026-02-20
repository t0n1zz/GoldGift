import Link from "next/link";
import { WalletButton } from "@/components/wallet/WalletButton";

export default function Home() {
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
      <main className="mx-auto max-w-6xl px-4 py-16 sm:py-24">
        <section className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Send Gold as a Gift
          </h1>
          <p className="mt-4 text-lg text-foreground/80 max-w-2xl mx-auto">
            Gold-backed gift cards that appreciate. Share via Twitter, Discord, or link. No crypto knowledge required to claim.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/create"
              className="rounded-lg bg-gradient-to-r from-gold-500 to-gold-600 px-6 py-3 font-medium text-white hover:from-gold-400 hover:to-gold-500"
            >
              Create Gift Card
            </Link>
            <a
              href="https://solana.com/action"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg border-2 border-gold-400 px-6 py-3 font-medium text-gold-800 hover:bg-gold-50"
            >
              Try Blink
            </a>
          </div>
        </section>
        <section className="mt-24 grid gap-8 sm:grid-cols-3">
          <div className="rounded-2xl border border-gold-100 bg-white p-6 shadow-sm">
            <div className="text-2xl">🥇</div>
            <h3 className="mt-2 font-semibold text-foreground">Gold-backed</h3>
            <p className="mt-1 text-sm text-foreground/70">Value that appreciates instead of cash that depreciates.</p>
          </div>
          <div className="rounded-2xl border border-gold-100 bg-white p-6 shadow-sm">
            <div className="text-2xl">🔗</div>
            <h3 className="mt-2 font-semibold text-foreground">Blinks integration</h3>
            <p className="mt-1 text-sm text-foreground/70">Share and claim gifts via Solana Blinks on social apps.</p>
          </div>
          <div className="rounded-2xl border border-gold-100 bg-white p-6 shadow-sm">
            <div className="text-2xl">🎁</div>
            <h3 className="mt-2 font-semibold text-foreground">Beautiful templates</h3>
            <p className="mt-1 text-sm text-foreground/70">Birthday, wedding, graduation, thank you—occasion-specific designs.</p>
          </div>
        </section>
      </main>
    </div>
  );
}
