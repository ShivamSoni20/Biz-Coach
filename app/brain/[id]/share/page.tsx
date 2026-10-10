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
        <h1 className="mt-5 font-display text-[32px] tracking-[-0.02em] text-ink">
          {brain.meta.businessName}
        </h1>
        <p className="mt-2 max-w-xl text-[14px] leading-[1.7] text-ink-lt">
          This shared view gives teammates a quick read on company context, workflows, and the quality bar without exposing the coaching session itself.
        </p>

        <div className="mt-5 flex flex-wrap items-center gap-3">
          <span className="rounded-full border border-teal/25 bg-teal-pale px-3 py-1 text-[11px] font-medium text-green-dk">
            {brain.meta.businessType.charAt(0).toUpperCase() + brain.meta.businessType.slice(1)}
          </span>
          <span className="rounded-full border border-sage/30 bg-sage-pale px-3 py-1 text-[11px] font-medium text-ink-lt">
            Generated in {brain.meta.sessionDuration} min
          </span>
          <span className="rounded-full border border-sage/30 bg-sage-pale px-3 py-1 text-[11px] font-medium text-ink-lt">
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
              color: "bg-teal-pale border-teal/25 text-green-dk"
            },
            {
              label: "PROCESSES.md",
              content: brain.markdown.processes_md,
              color: "bg-wheat-lt border-wheat/35 text-amber-700"
            },
            {
              label: "JUDGMENT.md",
              content: brain.markdown.judgment_md,
              color: "bg-sage-pale border-sage/35 text-green-dk"
            }
          ].map(({ label, content, color }) => (
            <section key={label}>
              <div className="mb-3 flex items-center gap-2">
                <span className={`rounded-lg border px-2.5 py-0.5 font-mono text-[11px] font-medium ${color}`}>
                  {label}
                </span>
              </div>
              <CodeViewer content={content} />
            </section>
          ))}
        </div>

        <div className="mt-12 rounded-[20px] border border-teal/20 bg-gradient-to-br from-teal-pale/60 to-sage-pale/40 p-6 text-center">
          <p className="text-[14px] font-medium text-ink">Built with Biz Coach</p>
          <p className="mt-1.5 text-[13px] text-ink-lt">
            Turn your business&apos;s tribal knowledge into an AI-ready Company Brain in 20 minutes.
          </p>
          <a
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-ink px-6 py-3 text-[13px] font-medium text-white transition-all hover:-translate-y-0.5 hover:shadow-md"
            href="/onboard"
          >
            Build Your Own Company Brain
          </a>
        </div>
      </div>
    </ScreenShell>
  );
}
