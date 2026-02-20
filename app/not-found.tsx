import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-stone-50 flex flex-col items-center justify-center px-4">
      <h1 className="text-2xl font-semibold text-stone-900">Page not found</h1>
      <p className="mt-2 text-stone-600">We couldn’t find the page you’re looking for.</p>
      <Link
        href="/"
        className="mt-6 rounded-xl bg-amber-700 px-4 py-2.5 text-sm font-medium text-white hover:bg-amber-800 transition-colors"
      >
        Back to GoldGift
      </Link>
    </div>
  );
}
