"use client";

import { useState } from "react";
import type { BrainRecord } from "@/lib/types";

export function AskBrainTab({ brain }: { brain: BrainRecord }) {
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [answer, setAnswer] = useState<string | null>(null);
  const [citations, setCitations] = useState<{ section: string; chunkIndex: number; snippet: string }[]>([]);
  const [error, setError] = useState<string | null>(null);

  async function handleAsk(e: React.FormEvent) {
    e.preventDefault();
    if (!question.trim()) return;

    setLoading(true);
    setError(null);
    setAnswer(null);
    setCitations([]);

    try {
      const res = await fetch(`/api/brain/${brain.meta.id}/ask`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to query Company Brain");
      }

      setAnswer(data.answer);
      setCitations(data.citations || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto py-2">
      <div className="rounded-2xl border border-teal/20 bg-gradient-to-br from-teal-pale/40 to-white p-6 shadow-sm">
        <h3 className="font-display text-lg text-ink">Ask your Company Brain (Cited RAG Q&A)</h3>
        <p className="mt-1 text-xs text-ink-lt">
          Ask any specific question about {brain.meta.businessName}&apos;s processes, rules, metrics, or client onboarding. Answers are strictly grounded with explicit vector citations.
        </p>

        <form onSubmit={handleAsk} className="mt-4 flex gap-2">
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="e.g. What is our approval process for discounts over 15%?"
            className="flex-1 rounded-xl border border-sage/30 bg-white px-4 py-2.5 text-sm text-ink placeholder:text-ink-lt/60 focus:border-teal focus:outline-none focus:ring-2 focus:ring-teal/20"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !question.trim()}
            className="rounded-xl bg-teal px-5 py-2.5 text-sm font-medium text-white transition-all hover:bg-green-dk disabled:opacity-50"
          >
            {loading ? "Searching..." : "Ask Brain"}
          </button>
        </form>

        {error && (
          <div className="mt-4 rounded-xl border border-coral-lt bg-coral-lt/10 p-3 text-xs text-red-600">
            {error}
          </div>
        )}

        {answer && (
          <div className="mt-6 rounded-xl border border-sage/30 bg-white p-5">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-green-dk">Generated Answer</h4>
            <div className="mt-2 text-sm text-ink whitespace-pre-line leading-relaxed">{answer}</div>

            {citations.length > 0 && (
              <div className="mt-6 border-t border-sage/20 pt-4">
                <h5 className="text-[11px] font-semibold text-ink-lt uppercase tracking-wider">Citations & Source Chunks</h5>
                <div className="mt-2 space-y-2">
                  {citations.map((c, i) => (
                    <div key={i} className="rounded-lg border border-sage/20 bg-sage-pale/40 p-3 text-xs">
                      <span className="font-semibold text-teal-gradient">
                        [{c.section}:chunk-{c.chunkIndex}]
                      </span>
                      <p className="mt-1 text-ink-lt italic">&ldquo;{c.snippet}&rdquo;</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
