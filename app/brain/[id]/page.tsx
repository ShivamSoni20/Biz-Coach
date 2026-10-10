import { notFound } from "next/navigation";

import { BrainTabs } from "@/components/brain/file-tab";
import { SharePanel } from "@/components/brain/share-modal";
import { ScreenShell } from "@/components/ui/shell";
import { kvGet } from "@/lib/kv";
import type { BrainRecord } from "@/lib/types";

export default async function BrainPage({
  params
}: {
  params: { id: string };
}) {
  const brain = await kvGet<BrainRecord>(`brain:${params.id}`);

  if (!brain) {
    notFound();
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  const shareUrl = `${appUrl}/brain/${params.id}/share`;
  const apiUrl = `${appUrl}/brain/${params.id}/api`;

  return (
    <ScreenShell className="min-h-screen">
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col lg:flex-row">
        <aside className="w-full shrink-0 border-b border-ivory-dk bg-white/80 backdrop-blur-md lg:w-[280px] lg:border-b-0 lg:border-r">
          <div className="p-6">
            <div className="mb-6 flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-[9px] bg-gold text-sm font-bold text-navy shadow-glow">
                BC
              </div>
              <span className="font-display text-[15px] text-navy">Biz Coach</span>
            </div>

            <div className="mb-6 rounded-2xl border border-gold/30 bg-gold-pale/60 p-4">
              <p className="mb-1 text-[9px] font-semibold uppercase tracking-[0.15em] text-gold-dk">
                Company Brain
              </p>
              <h1 className="font-display text-[18px] leading-tight text-navy">{brain.meta.businessName}</h1>
              <p className="mt-1.5 text-[12px] text-navy-lt">
                {brain.meta.businessType.charAt(0).toUpperCase() + brain.meta.businessType.slice(1)} - Generated in{" "}
                {brain.meta.sessionDuration} min
              </p>
              <div className="mt-3 flex items-center gap-1.5">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-gold animate-pulseLine" />
                <span className="text-[10px] font-semibold text-gold-dk">Brain is live</span>
              </div>
            </div>

            <div className="mb-5 space-y-2">
              <p className="mb-2 text-[9px] font-semibold uppercase tracking-[0.15em] text-navy-lt">Brain Status</p>
              {[
                { label: "Operating Model", color: "bg-gold-pale border-gold/25 text-gold-dk" },
                { label: "Processes", color: "bg-ivory border-ivory-dk text-navy-md" },
                { label: "Tasks + Judgment", color: "bg-gold-pale border-gold/25 text-gold-dk" }
              ].map((item) => (
                <div
                  className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-[11px] font-medium ${item.color}`}
                  key={item.label}
                >
                  <span>OK</span>
                  {item.label}
                </div>
              ))}
            </div>

            <div className="mb-5 grid grid-cols-2 gap-2">
              {[
                { label: "Session", val: `${brain.meta.sessionDuration} min` },
                { label: "Files", val: "3" },
                { label: "Skills", val: String(brain.skills.length) },
                { label: "Processes", val: String(brain.processes.length) }
              ].map((metric) => (
                <div className="rounded-xl border border-ivory-dk bg-white/70 p-2.5 text-center" key={metric.label}>
                  <p className="font-display text-[18px] text-gold-gradient">{metric.val}</p>
                  <p className="text-[9px] text-navy-lt">{metric.label}</p>
                </div>
              ))}
            </div>

            <SharePanel brainId={params.id} shareUrl={shareUrl} />
          </div>
        </aside>

        <main className="flex min-h-screen flex-1 flex-col">
          <div className="border-b border-ivory-dk bg-white/70 px-4 py-4 backdrop-blur-sm sm:px-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-[15px] font-semibold text-navy">Brain output</p>
                <p className="mt-0.5 text-[12px] text-navy-lt">
                  Switch between files or inspect the raw JSON endpoint payload.
                </p>
              </div>
              <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
                <a
                  className="inline-flex min-h-11 items-center justify-center rounded-xl border border-ivory-dk bg-white/60 px-4 py-2 text-[12px] font-medium text-navy-md transition-all hover:border-gold/40 hover:bg-gold-pale hover:text-navy"
                  href="/dashboard"
                >
                  Back to dashboard
                </a>
                <a
                  className="inline-flex min-h-11 items-center justify-center rounded-xl border border-ivory-dk bg-white/60 px-4 py-2 text-[12px] font-medium text-navy-md transition-all hover:border-gold/40 hover:bg-gold-pale hover:text-navy"
                  href={apiUrl}
                  rel="noreferrer"
                  target="_blank"
                >
                  API endpoint
                </a>
                <a
                  className="inline-flex min-h-11 items-center justify-center rounded-xl bg-gold px-4 py-2 text-[12px] font-semibold text-navy transition-all hover:bg-gold-dk hover:text-ivory"
                  href={shareUrl}
                >
                  Share link
                </a>
                <a href="/" className="text-[11px] text-navy-lt underline underline-offset-2 sm:hidden">
                  ← Home
                </a>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto border-b border-ivory-dk bg-white/40 px-4 py-3 sm:px-6">
            <div className="flex min-w-max items-center gap-6">
              <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-navy-lt">
                Brain completeness
              </p>
              {[
                { label: "Knowledge", pct: 100, color: "from-gold to-gold-dk" },
                {
                  label: "Processes",
                  pct: Math.max(65, Math.min(100, brain.processes.length * 20)),
                  color: "from-gold-lt to-coral"
                },
                {
                  label: "Judgment",
                  pct: brain.judgment.hardRules.length > 0 ? 91 : 70,
                  color: "from-gold to-navy-md"
                }
              ].map((bar) => (
                <div className="flex items-center gap-2" key={bar.label}>
                  <span className="text-[10px] text-navy-lt">{bar.label}</span>
                  <div className="h-1.5 w-20 overflow-hidden rounded-full bg-navy/10">
                    <div
                      className={`h-full rounded-full bg-gradient-to-r ${bar.color}`}
                      style={{ width: `${bar.pct}%` }}
                    />
                  </div>
                  <span className="text-[10px] font-semibold text-gold-dk">{bar.pct}%</span>
                </div>
              ))}
            </div>
          </div>

          <BrainTabs brain={brain} />
        </main>
      </div>
    </ScreenShell>
  );
}
