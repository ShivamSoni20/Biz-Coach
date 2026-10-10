"use client";

import { useState, useEffect } from "react";
import type { BrainRecord } from "@/lib/types";

export function HarnessActionsTab({ brain }: { brain: BrainRecord }) {
  const [tools, setTools] = useState<any[]>([]);
  const [selectedTool, setSelectedTool] = useState<string>("create_share_link");
  const [argsJson, setArgsJson] = useState<string>("");
  const [dryRun, setDryRun] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<any | null>(null);

  useEffect(() => {
    fetch("/api/harness")
      .then((res) => res.json())
      .then((data) => {
        if (data.tools) {
          setTools(data.tools);
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (selectedTool === "create_share_link") {
      setArgsJson(JSON.stringify({ brainId: brain.meta.id, allowApiAccess: "true" }, null, 2));
    } else if (selectedTool === "export_brain_markdown") {
      setArgsJson(JSON.stringify({ brainId: brain.meta.id, format: "bundle" }, null, 2));
    } else if (selectedTool === "regenerate_section") {
      setArgsJson(JSON.stringify({ brainId: brain.meta.id, section: "knowledge", guidance: "Add missing client SLAs" }, null, 2));
    }
  }, [selectedTool, brain.meta.id]);

  async function handleExecute(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    let parsedArgs = {};
    try {
      parsedArgs = JSON.parse(argsJson);
    } catch {
      setResult({ success: false, message: "Invalid JSON format in tool arguments." });
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/harness", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          toolName: selectedTool,
          args: parsedArgs,
          dryRun,
        }),
      });

      const data = await res.json();
      setResult(data);
    } catch (err) {
      setResult({ success: false, message: err instanceof Error ? err.message : "Execution failed" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto py-2">
      <div className="rounded-2xl border border-sage/30 bg-white p-6 shadow-sm">
        <h3 className="font-display text-lg text-ink">Agent Harness & Safe Tool Execution</h3>
        <p className="mt-1 text-xs text-ink-lt">
          Execute schema-validated tools over this Company Brain with dry-run preview and append-only audit logging.
        </p>

        <form onSubmit={handleExecute} className="mt-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-ink-lt mb-1">Select Tool</label>
            <select
              value={selectedTool}
              onChange={(e) => setSelectedTool(e.target.value)}
              className="w-full rounded-xl border border-sage/30 bg-white px-3 py-2 text-sm text-ink focus:border-teal focus:outline-none"
            >
              {tools.map((t) => (
                <option key={t.name} value={t.name}>
                  {t.name} — {t.description}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-ink-lt mb-1">Tool Arguments (JSON)</label>
            <textarea
              rows={4}
              value={argsJson}
              onChange={(e) => setArgsJson(e.target.value)}
              className="w-full rounded-xl border border-sage/30 font-mono text-xs p-3 text-ink bg-slate-50 focus:border-teal focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="dryRunCheck"
              checked={dryRun}
              onChange={(e) => setDryRun(e.target.checked)}
              className="rounded border-sage/30 text-teal focus:ring-teal"
            />
            <label htmlFor="dryRunCheck" className="text-xs font-medium text-ink">
              Enable Dry Run Mode (preview side-effects without mutating data)
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="rounded-xl bg-ink px-5 py-2.5 text-sm font-medium text-white transition-all hover:bg-black disabled:opacity-50"
          >
            {loading ? "Processing..." : dryRun ? "Run Dry-Run Preview" : "Execute Tool Safely"}
          </button>
        </form>

        {result && (
          <div className={`mt-6 rounded-xl border p-5 ${result.success ? "border-teal/30 bg-teal-pale/30" : "border-coral-lt bg-coral-lt/10"}`}>
            <div className="flex items-center justify-between">
              <span className={`text-xs font-bold uppercase tracking-wider ${result.success ? "text-green-dk" : "text-red-600"}`}>
                {result.dryRun ? "Dry Run Preview" : result.success ? "Execution Succeeded" : "Execution Failed"}
              </span>
              <span className="text-[10px] text-ink-lt font-mono">{new Date().toLocaleTimeString()}</span>
            </div>

            <p className="mt-2 text-sm text-ink font-medium">{result.message}</p>

            {result.diffPreview && (
              <pre className="mt-3 rounded-lg bg-white p-3 font-mono text-xs text-ink-lt border border-sage/20 whitespace-pre-wrap">
                {result.diffPreview}
              </pre>
            )}

            {result.data && (
              <pre className="mt-3 rounded-lg bg-white p-3 font-mono text-xs text-ink-lt border border-sage/20 overflow-x-auto">
                {JSON.stringify(result.data, null, 2)}
              </pre>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
