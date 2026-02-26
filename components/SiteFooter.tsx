import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-stone-200/70 bg-background/80">
      <div className="mx-auto max-w-5xl px-4 py-8">
        <div className="flex flex-col items-center gap-6 sm:flex-row sm:justify-between sm:items-center">
          <p className="text-sm text-stone-500 dark:text-stone-400">
            GoldGift × <a href="https://www.oro.finance" target="_blank" rel="noopener noreferrer" className="text-amber-700 dark:text-amber-400 hover:underline">Oro</a> · Solana Blinks
          </p>
          <nav className="flex flex-wrap items-center justify-center gap-6 text-sm">
            <a
              href="https://www.blinks.xyz/inspector"
              target="_blank"
              rel="noopener noreferrer"
              className="text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 transition-colors"
            >
              Blinks Inspector
            </a>
            <a
              href="https://actions-validator.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 transition-colors"
            >
              Actions Validator
            </a>
            <Link href="/create" className="text-amber-700 dark:text-amber-400 hover:text-amber-800 dark:hover:text-amber-300 font-medium">
              Create gift
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
