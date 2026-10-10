"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { CodeViewer } from "@/components/brain/code-viewer";
import { AskBrainTab } from "@/components/brain/ask-tab";
import { HarnessActionsTab } from "@/components/brain/harness-tab";
import type { BrainRecord } from "@/lib/types";

const tabs = [
  { id: "knowledge", label: "KNOWLEDGE.md", filename: "KNOWLEDGE.md" },
  { id: "processes", label: "PROCESSES.md", filename: "PROCESSES.md" },
  { id: "judgment", label: "JUDGMENT.md", filename: "JUDGMENT.md" },
  { id: "ask", label: "Ask Brain (RAG)", filename: "ask-rag" },
  { id: "actions", label: "Actions (Harness)", filename: "actions" },
  { id: "api", label: "API Endpoint", filename: "brain-api-payload.json" },
] as const;

function BrainTabsInner({ brain }: { brain: BrainRecord }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [copied, setCopied] = useState(false);
  const activeTab =
    (searchParams.get("tab") as (typeof tabs)[number]["id"] | null) ?? "knowledge";
  const activeTabConfig = tabs.find((tab) => tab.id === activeTab) ?? tabs[0];

  const apiPayload = JSON.stringify(brain, null, 2);

  const content =
    activeTab === "knowledge"
      ? brain.markdown.knowledge_md
      : activeTab === "processes"
        ? brain.markdown.processes_md
        : activeTab === "judgment"
          ? brain.markdown.judgment_md
          : apiPayload;

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  }

  function handleDownload() {
    const blob = new Blob([content], {
      type: activeTab === "api" ? "application/json" : "text/markdown",
    });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${slugify(brain.meta.businessName)}-${activeTabConfig.filename}`;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex flex-col gap-3 border-b border-sage/20 bg-white/40 px-4 py-3 sm:px-6">
        <div className="flex flex-wrap gap-2">
          {tabs.map((tab) => {
            const isActive = tab.id === activeTab;
            return (
              <button
                key={tab.id}
                className={`rounded-full border px-4 py-1.5 text-[12px] font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal/40 ${
                  isActive
                    ? "border-teal/30 bg-teal-pale text-green-dk font-semibold shadow-sm"
                    : "border-sage/25 bg-white/60 text-ink-lt hover:border-sage/40 hover:text-ink"
                }`}
                onClick={() => router.replace(`?tab=${tab.id}`)}
                type="button"
              >
                {tab.label}
              </button>
            );
          })}
        </div>
        {activeTab !== "ask" && activeTab !== "actions" && (
          <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
            <button
              className="inline-flex min-h-9 items-center justify-center rounded-xl border border-sage/30 bg-white/60 px-4 text-[12px] font-medium text-ink-md transition-all hover:border-teal/35 hover:bg-teal-pale hover:text-green-dk"
              onClick={handleCopy}
              type="button"
            >
              {copied ? "Copied ✓" : "Copy current tab"}
            </button>
            <button
              className="inline-flex min-h-9 items-center justify-center rounded-xl border border-sage/30 bg-white/60 px-4 text-[12px] font-medium text-ink-md transition-all hover:border-teal/35 hover:bg-teal-pale hover:text-green-dk"
              onClick={handleDownload}
              type="button"
            >
              Download {activeTabConfig.filename}
            </button>
            {activeTab === "api" && (
              <a
                className="inline-flex min-h-9 items-center justify-center rounded-xl bg-ink px-4 text-[12px] font-medium text-white transition-all hover:-translate-y-0.5 hover:shadow-md"
                href={`/brain/${brain.meta.id}/api`}
                target="_blank"
                rel="noreferrer"
              >
                Open raw API ↗
              </a>
            )}
          </div>
        )}
      </div>
      <div className="flex-1 overflow-y-auto p-4 sm:p-6">
        {activeTab === "ask" ? (
          <AskBrainTab brain={brain} />
        ) : activeTab === "actions" ? (
          <HarnessActionsTab brain={brain} />
        ) : (
          <CodeViewer content={content} />
        )}
      </div>
    </div>
  );
}

export function BrainTabs({ brain }: { brain: BrainRecord }) {
  return (
    <Suspense
      fallback={
        <div className="flex-1 animate-pulse p-6">
          <div className="h-8 w-64 rounded-xl bg-sage/20" />
          <div className="mt-4 h-40 rounded-2xl bg-sage/10" />
        </div>
      }
    >
      <BrainTabsInner brain={brain} />
    </Suspense>
  );
}

function slugify(value: string) {
  return (
    value
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "company-brain"
  );
}
