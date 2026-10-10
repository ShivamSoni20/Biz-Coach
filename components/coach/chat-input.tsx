"use client";

import type { FormEvent, KeyboardEvent } from "react";
import { useState } from "react";

export function ChatInput({
  disabled,
  isComplete,
  onSend,
}: {
  disabled?: boolean;
  isComplete: boolean;
  onSend: (value: string) => Promise<void> | void;
}) {
  const [value, setValue] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const next = value.trim();
    if (!next || disabled || isComplete) return;
    setValue("");
    await onSend(next);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      const next = value.trim();
      if (!next || disabled || isComplete) return;
      setValue("");
      void onSend(next);
    }
  }

  return (
    <form
      className="border-t border-sage/20 bg-white/60 p-4"
      onSubmit={handleSubmit}
    >
      <label className="sr-only" htmlFor="coach-input">
        Answer the current Biz Coach question
      </label>
      <div className="mx-auto flex max-w-4xl flex-col gap-3 rounded-2xl border border-sage/30 bg-white/80 p-3 shadow-sm sm:flex-row sm:items-end">
        <textarea
          autoComplete="off"
          className="min-h-[80px] flex-1 resize-none rounded-xl border border-sage/25 bg-[#f7f4ee]/60 px-3 py-2.5 text-[13px] text-ink outline-none placeholder:text-ink-lt focus:border-teal/40 focus:ring-2 focus:ring-teal/15 disabled:cursor-not-allowed disabled:opacity-50 sm:min-h-[56px]"
          disabled={disabled || isComplete}
          id="coach-input"
          name="message"
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={
            isComplete
              ? "Your Company Brain is being generated..."
              : "Answer with specifics: tools, owners, steps, pricing, edge cases... (Enter to send)"
          }
          value={value}
        />
        <button
          className="inline-flex min-h-10 w-full items-center justify-center rounded-xl bg-ink px-5 py-2.5 text-[13px] font-medium text-white transition-all hover:-translate-y-0.5 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
          disabled={disabled || isComplete || !value.trim()}
          type="submit"
        >
          Send answer
        </button>
      </div>
      <p className="mt-2 text-center text-[10px] text-ink-lt">
        {isComplete
          ? "Redirecting to your Company Brain..."
          : "Shift + Enter for new line · Enter to send"}
      </p>
    </form>
  );
}
