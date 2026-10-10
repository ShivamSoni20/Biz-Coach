import type { ReactNode } from "react";
import Link from "next/link";

import { AuthStatus } from "@/components/auth/auth-status";
import { cn } from "@/lib/utils";

export function ScreenShell({
  children,
  className
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("relative min-h-screen overflow-hidden bg-ivory font-sans text-navy", className)}>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-20 -top-20 h-96 w-96 rounded-full blur-[80px]"
        style={{
          background: "radial-gradient(circle, rgba(201,164,74,.14), transparent 70%)",
          animation: "floatBlob 12s ease-in-out infinite"
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-16 -left-16 h-80 w-80 rounded-full blur-[70px]"
        style={{
          background: "radial-gradient(circle, rgba(15,32,64,.08), transparent 70%)",
          animation: "floatBlob 16s ease-in-out infinite"
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/3 top-1/2 h-64 w-64 -translate-y-1/2 rounded-full blur-[60px]"
        style={{
          background: "radial-gradient(circle, rgba(201,164,74,.1), transparent 70%)",
          animation: "floatBlob 20s ease-in-out infinite"
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 surface-grid opacity-40"
        style={{ maskImage: "radial-gradient(circle at center, white, transparent 78%)" }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
}

export function SectionBadge({ children }: { children: ReactNode }) {
  return (
    <div className="inline-flex items-center gap-1.5 rounded-full border border-gold/30 bg-gold-pale px-3 py-1 text-[11px] font-medium uppercase tracking-[0.15em] text-gold-dk">
      <span className="inline-block h-1.5 w-1.5 rounded-full bg-gold animate-pulseLine" />
      {children}
    </div>
  );
}

export function GridDots() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 opacity-35"
      style={{
        backgroundImage: "radial-gradient(circle, rgba(201,164,74,.14) 1px, transparent 1px)",
        backgroundSize: "22px 22px",
        maskImage: "linear-gradient(to bottom, white, transparent 82%)"
      }}
    />
  );
}

export function PageNav() {
  return (
    <header className="sticky top-0 z-20 border-b border-ivory-dk bg-ivory/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <Link className="group flex items-center gap-3.5" href="/">
          <div className="relative flex h-11 w-11 items-center justify-center rounded-[15px] bg-gold text-[12px] font-bold tracking-[-0.04em] text-navy shadow-glow transition-all duration-300 group-hover:-translate-y-0.5 group-hover:rotate-[-2deg] group-hover:shadow-lg">
            <span className="absolute inset-0 rounded-[15px] border border-white/30" />
            <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full border-2 border-ivory bg-coral" />
            BC
          </div>
          <div>
            <p className="font-display text-[18px] leading-none tracking-[-0.03em] text-navy transition-colors group-hover:text-gold-dk">
              Biz Coach
            </p>
            <p className="mt-1 text-[10px] tracking-[0.12em] text-navy-lt">Company Brain Builder</p>
          </div>
        </Link>
        <SectionBadge>AI-Guided Operating System</SectionBadge>
        <div className="flex items-center gap-2">
          <AuthStatus />
        </div>
      </div>
    </header>
  );
}
