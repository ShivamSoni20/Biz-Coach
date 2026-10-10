"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { GridDots, ScreenShell, SectionBadge } from "@/components/ui/shell";
import { supabaseBrowser } from "@/lib/supabase-browser";
import type { BusinessType } from "@/lib/types";
import { cn } from "@/lib/utils";

const options: Array<{
  id: BusinessType;
  label: string;
  description: string;
}> = [
  { id: "agency", label: "Agency", description: "Marketing, dev, design, PR" },
  { id: "freelancer", label: "Freelancer", description: "Solo consultant or contractor" },
  { id: "consultant", label: "Consultant", description: "Business, legal, finance" },
  { id: "startup", label: "Startup", description: "Early team, scaling ops" }
];

export default function OnboardPage() {
  const router = useRouter();
  const [selected, setSelected] = useState<BusinessType>("agency");
  const [businessName, setBusinessName] = useState("");
  const [isAuthChecking, setIsAuthChecking] = useState(true);
  const summary = useMemo(
    () => options.find((option) => option.id === selected),
    [selected]
  );

  useEffect(() => {
    async function preparePage() {
      const { data } = await supabaseBrowser.auth.getSession();

      if (!data.session) {
        router.replace("/login?redirect=/onboard");
        return;
      }

      const storedType = window.localStorage.getItem("businessType") as BusinessType | null;
      const storedName = window.localStorage.getItem("businessName");

      if (storedType) {
        setSelected(storedType);
      }

      if (storedName) {
        setBusinessName(storedName);
      }

      setIsAuthChecking(false);
    }

    void preparePage();
  }, [router]);

  function handleContinue() {
    const trimmedName = businessName.trim();

    if (!trimmedName) {
      return;
    }

    window.localStorage.setItem("businessType", selected);
    window.localStorage.setItem("businessName", trimmedName);
    router.push("/coach");
  }

  return (
    <ScreenShell className="flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <GridDots />
      {isAuthChecking ? (
        <div className="relative z-10 w-full max-w-md rounded-[2rem] border border-sage/30 bg-white/75 p-8 text-center shadow-glow">
          <p className="font-display text-[28px] text-ink">Checking login...</p>
          <p className="mt-2 text-[13px] text-ink-lt">Redirecting you if needed.</p>
        </div>
      ) : (
        <div className="relative z-10 w-full max-w-3xl rounded-[2rem] border border-border/70 bg-card/75 p-5 shadow-glow sm:p-8">
        <SectionBadge>Step 1 of 2</SectionBadge>
        <h1 className="mt-5 text-3xl font-semibold tracking-tight sm:text-4xl">
          Tell us about your business
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
          We use this to shape the conversation and examples around your business model instead of giving you generic startup advice.
        </p>

        <div className="mt-8">
          <label className="block text-sm font-medium text-foreground" htmlFor="business-name">
            Business name
          </label>
          <input
            autoComplete="organization"
            className="mt-2 min-h-12 w-full rounded-2xl border border-border/70 bg-background/60 px-4 py-3 text-sm text-foreground outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
            id="business-name"
            onChange={(event) => setBusinessName(event.target.value)}
            placeholder="Bright Social Media Agency"
            type="text"
            value={businessName}
          />
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {options.map((option) => {
            const isActive = option.id === selected;

            return (
              <button
                className={cn(
                  "min-h-32 rounded-3xl border p-5 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                  isActive
                    ? "border-primary/40 bg-primary/10 shadow-glow"
                    : "border-border/70 bg-background/40 motion-safe:hover:border-primary/30 motion-safe:hover:bg-card"
                )}
                key={option.id}
                onClick={() => setSelected(option.id)}
                type="button"
              >
                <p className="text-base font-semibold text-foreground">{option.label}</p>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">{option.description}</p>
              </button>
            );
          })}
        </div>

        <div className="mt-8 flex flex-col gap-4 rounded-3xl border border-border/60 bg-background/40 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-foreground">Selected profile</p>
            <p className="mt-1 text-sm text-muted-foreground">
              {summary?.label}: {summary?.description}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              {businessName.trim() ? businessName.trim() : "Add your business name to continue"}
            </p>
          </div>
          <Button
            className="w-full sm:w-auto"
            disabled={!businessName.trim()}
            onClick={handleContinue}
          >
            Continue to Biz Coach
          </Button>
        </div>
        </div>
      )}
    </ScreenShell>
  );
}
