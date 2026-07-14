import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 px-6">
      <p className="text-6xl font-extrabold text-emerald">404</p>
      <h1 className="text-xl font-bold text-ink">Page not found</h1>
      <Link
        href="/"
        className="rounded-lg bg-emerald px-5 py-2.5 text-sm font-bold text-white transition hover:bg-emerald-dark"
      >
        Language selection
      </Link>
    </div>
  );
}
