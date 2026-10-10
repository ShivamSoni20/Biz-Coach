import Link from "next/link";

import { GridDots, PageNav, ScreenShell } from "@/components/ui/shell";

export default function NotFound() {
  return (
    <ScreenShell>
      <GridDots />
      <PageNav />
      <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gold-pale text-3xl">
          🧠
        </div>
        <h1 className="font-display text-[40px] tracking-[-0.03em] text-navy">
          Brain not found
        </h1>
        <p className="mt-3 max-w-sm text-[15px] text-navy-lt">
          This Company Brain may have expired or the link may be incorrect.
          Brains are available for 30 days after generation.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            href="/onboard"
            className="inline-flex items-center rounded-xl bg-gold px-6 py-3 text-[14px] font-semibold text-navy transition-all hover:bg-gold-dk hover:text-ivory hover:-translate-y-0.5 hover:shadow-md"
          >
            🧠 Build a new Company Brain →
          </Link>
          <Link
            href="/"
            className="inline-flex items-center rounded-xl border border-ivory-dk bg-white/70 px-6 py-3 text-[14px] font-medium text-navy-md transition-all hover:border-gold/40 hover:bg-gold-pale hover:text-navy"
          >
            Back to home
          </Link>
        </div>
      </div>
    </ScreenShell>
  );
}
