import Link from "next/link";

import { LoginForm } from "@/components/auth/login-form";
import { GridDots, ScreenShell } from "@/components/ui/shell";

export default function LoginPage({
  searchParams,
}: {
  searchParams?: { redirect?: string };
}) {
  const redirectTo = searchParams?.redirect || "/dashboard";

  return (
    <ScreenShell>
      <GridDots />
      <header className="sticky top-0 z-20 border-b border-ivory-dk bg-ivory/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-gold text-base font-bold text-navy shadow-glow">
              BC
            </div>
            <div>
              <p className="font-display text-[15px] text-navy">Biz Coach</p>
              <p className="text-[10px] tracking-wide text-navy-lt">Company Brain Builder</p>
            </div>
          </Link>
          <Link
            href="/"
            className="inline-flex min-h-9 items-center rounded-xl border border-ivory-dk bg-white/70 px-4 py-2 text-[12px] font-medium text-navy-md transition-all hover:border-gold/40 hover:bg-gold-pale hover:text-navy"
          >
            Back home
          </Link>
        </div>
      </header>
      <main className="flex min-h-[calc(100vh-74px)] items-center justify-center px-4 py-10 sm:px-6">
        <LoginForm redirectTo={redirectTo} />
      </main>
    </ScreenShell>
  );
}
