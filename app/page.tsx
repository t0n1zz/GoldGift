import Link from "next/link";
import { WalletButton } from "@/components/wallet/WalletButton";

export default function Home() {
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
      <main className="mx-auto max-w-5xl px-4 py-20 sm:py-28">
        <section className="text-center">
          <h1 className="text-4xl font-semibold tracking-tight text-stone-900 sm:text-5xl">
            Send gold as a gift
          </h1>
          <p className="mt-5 text-lg text-stone-600 max-w-xl mx-auto leading-relaxed">
            Gold-backed gift cards that hold their value. Share a link—recipients claim with one click. No crypto needed.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/create"
              className="inline-flex items-center justify-center rounded-xl bg-amber-700 px-6 py-3 text-sm font-medium text-white hover:bg-amber-800 transition-colors"
            >
              Create gift card
            </Link>
            <a
              href="https://solana.com/action"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-xl border border-stone-200 bg-white px-6 py-3 text-sm font-medium text-stone-700 hover:bg-stone-50 transition-colors"
            >
              Try Blink
            </a>
          </div>
        </section>
        <section className="mt-24 grid gap-6 sm:grid-cols-3">
          <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
            <span className="text-2xl" aria-hidden>🥇</span>
            <h3 className="mt-3 font-medium text-stone-900">Gold-backed</h3>
            <p className="mt-1.5 text-sm text-stone-600 leading-relaxed">
              Value that keeps up over time instead of cash that loses it.
            </p>
          </div>
          <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
            <span className="text-2xl" aria-hidden>🔗</span>
            <h3 className="mt-3 font-medium text-stone-900">Blinks</h3>
            <p className="mt-1.5 text-sm text-stone-600 leading-relaxed">
              Share and claim via Solana Blinks on Twitter, Discord, or any link.
            </p>
          </div>
          <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
            <span className="text-2xl" aria-hidden>🎁</span>
            <h3 className="mt-3 font-medium text-stone-900">Beautiful cards</h3>
            <p className="mt-1.5 text-sm text-stone-600 leading-relaxed">
              Birthday, wedding, graduation, thank you—each with its own design.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
