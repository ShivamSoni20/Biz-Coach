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
      <div className="rounded-2xl border border-gold/30 bg-gold-pale/40 p-6 shadow-sm">
        <h3 className="font-display text-lg text-navy">Ask your Company Brain (Cited RAG Q&A)</h3>
        <p className="mt-1 text-xs text-navy-lt">
          Ask any specific question about {brain.meta.businessName}&apos;s processes, rules, metrics, or client onboarding. Answers are strictly grounded with explicit vector citations.
        </p>

        <form onSubmit={handleAsk} className="mt-4 flex gap-2">
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="e.g. What is our approval process for discounts over 15%?"
            className="flex-1 rounded-xl border border-ivory-dk bg-white px-4 py-2.5 text-sm text-navy placeholder:text-navy-lt/60 focus:border-gold/60 focus:outline-none focus:ring-2 focus:ring-gold/20"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !question.trim()}
            className="rounded-xl bg-gold px-5 py-2.5 text-sm font-semibold text-navy transition-all hover:bg-gold-dk hover:text-ivory disabled:opacity-50"
          >
            {loading ? "Searching..." : "Ask Brain"}
          </button>
        </form>

        {error && (
          <div className="mt-4 rounded-xl border border-coral-lt bg-coral-lt/10 p-3 text-xs text-coral">
            {error}
          </div>
        )}

        {answer && (
          <div className="mt-6 rounded-xl border border-ivory-dk bg-white p-5">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-gold-dk">Generated Answer</h4>
            <div className="mt-2 text-sm text-navy whitespace-pre-line leading-relaxed">{answer}</div>

            {citations.length > 0 && (
              <div className="mt-6 border-t border-ivory-dk pt-4">
                <h5 className="text-[11px] font-semibold text-navy-lt uppercase tracking-wider">Citations & Source Chunks</h5>
                <div className="mt-2 space-y-2">
                  {citations.map((c, i) => (
                    <div key={i} className="rounded-lg border border-ivory-dk bg-ivory/60 p-3 text-xs">
                      <span className="font-semibold text-gold-gradient">
                        [{c.section}:chunk-{c.chunkIndex}]
                      </span>
                      <p className="mt-1 text-navy-lt italic">&ldquo;{c.snippet}&rdquo;</p>
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
