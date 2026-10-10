import { notFound } from "next/navigation";

import { CodeViewer } from "@/components/brain/code-viewer";
import { PageNav, ScreenShell, SectionBadge } from "@/components/ui/shell";
import { kvGet } from "@/lib/kv";
import type { BrainRecord } from "@/lib/types";

export default async function ShareBrainPage({
  params
}: {
  params: { id: string };
}) {
  const brain = await kvGet<BrainRecord>(`brain:${params.id}`);

  if (!brain) {
    notFound();
  }

  return (
    <ScreenShell>
      <PageNav />
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        <SectionBadge>Read-only share view</SectionBadge>
        <h1 className="mt-5 font-display text-[32px] tracking-[-0.02em] text-navy">
          {brain.meta.businessName}
        </h1>
        <p className="mt-2 max-w-xl text-[14px] leading-[1.7] text-navy-lt">
          This shared view gives teammates a quick read on company context, workflows, and the quality bar without exposing the coaching session itself.
        </p>

        <div className="mt-5 flex flex-wrap items-center gap-3">
          <span className="rounded-full border border-gold/30 bg-gold-pale px-3 py-1 text-[11px] font-semibold text-gold-dk">
            {brain.meta.businessType.charAt(0).toUpperCase() + brain.meta.businessType.slice(1)}
          </span>
          <span className="rounded-full border border-ivory-dk bg-white/70 px-3 py-1 text-[11px] font-medium text-navy-lt">
            Generated in {brain.meta.sessionDuration} min
          </span>
          <span className="rounded-full border border-ivory-dk bg-white/70 px-3 py-1 text-[11px] font-medium text-navy-lt">
            {new Date(brain.meta.generatedAt).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "short",
              year: "numeric"
            })}
          </span>
        </div>

        <div className="mt-10 space-y-8">
          {[
            {
              label: "KNOWLEDGE.md",
              content: brain.markdown.knowledge_md,
              color: "bg-gold-pale border-gold/25 text-gold-dk"
            },
            {
              label: "PROCESSES.md",
              content: brain.markdown.processes_md,
              color: "bg-ivory border-ivory-dk text-navy-md"
            },
            {
              label: "JUDGMENT.md",
              content: brain.markdown.judgment_md,
              color: "bg-gold-pale border-gold/25 text-gold-dk"
            }
          ].map(({ label, content, color }) => (
            <section key={label}>
              <div className="mb-3 flex items-center gap-2">
                <span className={`rounded-lg border px-2.5 py-0.5 font-mono text-[11px] font-semibold ${color}`}>
                  {label}
                </span>
              </div>
              <CodeViewer content={content} />
            </section>
          ))}
        </div>

        <div className="mt-12 rounded-[20px] border border-gold/30 bg-gold-pale/50 p-6 text-center">
          <p className="text-[14px] font-semibold text-navy">Built with Biz Coach</p>
          <p className="mt-1.5 text-[13px] text-navy-lt">
            Turn your business&apos;s tribal knowledge into an AI-ready Company Brain in 20 minutes.
          </p>
          <a
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-gold px-6 py-3 text-[13px] font-semibold text-navy transition-all hover:bg-gold-dk hover:text-ivory hover:-translate-y-0.5 hover:shadow-md"
            href="/onboard"
          >
            Build Your Own Company Brain
          </a>
        </div>
      </div>
    </ScreenShell>
  );
}
