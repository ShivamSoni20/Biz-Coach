"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { supabaseBrowser } from "@/lib/supabase-browser";

export function AuthStatus() {
  const pathname = usePathname();
  const router = useRouter();
  const [email, setEmail] = useState<string | null>(null);
  const [displayName, setDisplayName] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    supabaseBrowser.auth.getSession().then(({ data }) => {
      if (!isMounted) return;
      const user = data.session?.user;
      const metadata = user?.user_metadata as { name?: unknown } | undefined;
      setEmail(user?.email ?? null);
      setDisplayName(
        typeof metadata?.name === "string" && metadata.name.trim()
          ? metadata.name.trim()
          : user?.email ?? null
      );
      setIsLoading(false);
    });

    const {
      data: { subscription },
    } = supabaseBrowser.auth.onAuthStateChange((_event, session) => {
      const metadata = session?.user.user_metadata as { name?: unknown } | undefined;
      setEmail(session?.user.email ?? null);
      setDisplayName(
        typeof metadata?.name === "string" && metadata.name.trim()
          ? metadata.name.trim()
          : session?.user.email ?? null
      );
      setIsLoading(false);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  async function handleSignOut() {
    await supabaseBrowser.auth.signOut();
    setEmail(null);
    setDisplayName(null);

    if (pathname.startsWith("/dashboard") || pathname.startsWith("/onboard") || pathname.startsWith("/coach")) {
      router.replace("/login?redirect=/dashboard");
    }
  }

  if (isLoading) {
    return (
      <span className="hidden rounded-xl border border-ivory-dk bg-white/50 px-4 py-2 text-[12px] text-navy-lt sm:inline-flex">
        Checking...
      </span>
    );
  }

  if (!email) {
    return (
      <Link
        className="inline-flex min-h-9 items-center rounded-xl bg-gold px-5 py-2.5 text-sm font-semibold text-navy transition-all hover:bg-gold-dk hover:text-ivory hover:-translate-y-0.5 hover:shadow-md"
        href="/login?redirect=/dashboard"
      >
        Login
      </Link>
    );
  }

  return (
    <div className="flex items-center gap-2">
      {displayName ? (
        <span className="hidden max-w-[150px] truncate rounded-xl border border-ivory-dk bg-white/60 px-3 py-2 text-[12px] font-medium text-navy-md sm:inline-flex">
          {displayName}
        </span>
      ) : null}
      <button
        className="inline-flex min-h-9 items-center rounded-xl bg-gold px-5 py-2.5 text-sm font-semibold text-navy transition-all hover:bg-gold-dk hover:text-ivory hover:-translate-y-0.5 hover:shadow-md"
        onClick={handleSignOut}
        type="button"
      >
        Logout
      </button>
    </div>
  );
}
