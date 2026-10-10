"use client";

import { useState } from "react";

export function CodeViewer({ content }: { content: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // clipboard not available
    }
  }

  return (
    <div className="group relative">
      <button
        onClick={handleCopy}
        className="absolute right-3 top-3 z-10 rounded-lg border border-ivory-dk bg-white/90 px-2.5 py-1 text-[10px] font-medium text-navy-md opacity-0 transition-all group-hover:opacity-100 hover:border-gold/40 hover:text-gold-dk"
        type="button"
      >
        {copied ? "Copied ✓" : "Copy"}
      </button>
      <pre className="overflow-x-auto rounded-2xl border border-ivory-dk bg-white/80 p-5 font-mono text-[12px] leading-6 text-navy-md shadow-sm sm:text-[13px]">
        <code>{content}</code>
      </pre>
    </div>
  );
}
