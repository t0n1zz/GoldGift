import Link from "next/link";
import { WalletButton } from "@/components/wallet/WalletButton";
import { ThemeToggle } from "@/components/ThemeToggle";
import { CreateGiftForm } from "@/components/forms/CreateGiftForm";
import { SiteFooter } from "@/components/SiteFooter";

export default function CreatePage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <header className="sticky top-0 z-10 border-b border-stone-200/70 bg-background/95 backdrop-blur-sm">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
          <Link href="/" className="text-lg font-semibold tracking-tight text-foreground">
            GoldGift
          </Link>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <WalletButton />
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-12 flex-1">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-xl">
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">
              Create a gold gift card
            </h1>
            <p className="mt-1 text-stone-600 dark:text-stone-300">
              Set the amount, occasion, an optional image, and a personal message. The recipient gets a link to claim the gold.
            </p>
          </div>
        </div>
        <div className="mt-8">
          <div className="rounded-2xl border border-stone-200/70 dark:border-stone-700 bg-white dark:bg-stone-900 p-6 shadow-sm">
            <CreateGiftForm />
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
