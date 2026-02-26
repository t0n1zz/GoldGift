import Link from "next/link";
import { WalletButton } from "@/components/wallet/WalletButton";
import { ThemeToggle } from "@/components/ThemeToggle";
import { TryAsBlinkLink } from "@/components/TryAsBlinkLink";
import { getCreateBlinkUrl } from "@/lib/utils/gift-id";
import { APP_URL } from "@/lib/utils/constants";
import { SiteFooter } from "@/components/SiteFooter";

function isPublicAppUrl(url: string): boolean {
  const u = url.replace(/\/$/, "").toLowerCase();
  return (
    u.startsWith("https://") &&
    !u.includes("localhost") &&
    !u.includes("127.0.0.1")
  );
}

export default function Home() {
  const createBlinkUrl = getCreateBlinkUrl(APP_URL);
  const isLocal = !isPublicAppUrl(APP_URL);

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
      <main className="mx-auto max-w-5xl px-4 py-20 sm:py-28 flex-1">
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
            <TryAsBlinkLink
              href={createBlinkUrl}
              isLocal={isLocal}
              className="inline-flex items-center justify-center rounded-xl border border-stone-200 bg-white px-6 py-3 text-sm font-medium text-stone-700 hover:bg-stone-50 transition-colors"
            >
              Try as Blink
            </TryAsBlinkLink>
          </div>
        </section>

        <section className="mt-20 text-center">
          <h2 className="text-xl font-semibold text-stone-900">How it works</h2>
          <div className="mt-8 grid gap-8 sm:grid-cols-3 max-w-3xl mx-auto">
            <div className="flex flex-col items-center">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 text-amber-800 font-semibold text-lg">1</span>
              <h3 className="mt-4 font-medium text-stone-900">Create</h3>
              <p className="mt-1 text-sm text-stone-600">Pick amount, occasion, and message. Pay with USDC; we convert to gold.</p>
            </div>
            <div className="flex flex-col items-center">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 text-amber-800 font-semibold text-lg">2</span>
              <h3 className="mt-4 font-medium text-stone-900">Share</h3>
              <p className="mt-1 text-sm text-stone-600">Send the link or share as a Solana Blink—Twitter, Discord, anywhere.</p>
            </div>
            <div className="flex flex-col items-center">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 text-amber-800 font-semibold text-lg">3</span>
              <h3 className="mt-4 font-medium text-stone-900">Claim</h3>
              <p className="mt-1 text-sm text-stone-600">Recipient opens the link, connects a wallet, and claims the gold.</p>
            </div>
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
      <SiteFooter />
    </div>
  );
}
