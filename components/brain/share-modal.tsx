"use client";

import { useState } from "react";

export function SharePanel({
  brainId,
  shareUrl,
}: {
  brainId: string;
  shareUrl: string;
}) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="rounded-2xl border border-ivory-dk bg-white/70 p-4">
      <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.15em] text-gold-dk">
        Share
      </p>
      <p className="mb-3 text-[12px] leading-5 text-navy-lt">
        Share the read-only view with teammates or use the API URL in an agent workflow.
      </p>
      <div className="mb-3 break-all rounded-xl border border-ivory-dk bg-ivory p-2.5 font-mono text-[10px] text-navy-md">
        {shareUrl}
      </div>
      <div className="flex flex-col gap-2">
        <button
          className="inline-flex min-h-9 items-center justify-center rounded-xl border border-ivory-dk bg-white/60 px-3 text-[12px] font-medium text-navy-md transition-all hover:border-gold/40 hover:bg-gold-pale hover:text-navy"
          onClick={handleCopy}
          type="button"
        >
          {copied ? "Copied ✓" : "Copy share URL"}
        </button>
        <a
          className="inline-flex min-h-9 items-center justify-center rounded-xl border border-ivory-dk bg-white/60 px-3 text-[12px] font-medium text-navy-md transition-all hover:border-gold/40 hover:bg-gold-pale hover:text-navy"
          href={`/brain/${brainId}/share`}
          target="_blank"
          rel="noreferrer"
        >
          Open share page ↗
        </a>
        <a
          className="inline-flex min-h-9 items-center justify-center rounded-xl bg-gold px-3 text-[12px] font-semibold text-navy transition-all hover:bg-gold-dk hover:text-ivory hover:-translate-y-0.5 hover:shadow-md"
          href={`/brain/${brainId}?tab=api`}
        >
          View API payload
        </a>
      </div>
    </div>
  );
}
