"use client";

import { cn } from "@/lib/utils";
import type { ChatMessage as ChatMessageType } from "@/lib/types";

export function ChatMessage({
  message,
  isPending,
}: {
  message: ChatMessageType;
  isPending?: boolean;
}) {
  const isUser = message.role === "user";

  return (
    <div className={cn("flex gap-3", isUser ? "justify-end" : "justify-start")}>
      {!isUser && (
        <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gold text-[11px] font-bold text-navy shadow-sm">
          BC
        </div>
      )}
      <div
        className={cn(
          "max-w-[85%] rounded-2xl px-4 py-3 text-[13px] leading-6 shadow-sm sm:max-w-[72%]",
          isUser
            ? "rounded-tr-sm bg-navy text-ivory"
            : "rounded-tl-sm border border-ivory-dk bg-white text-navy"
        )}
      >
        <p className="whitespace-pre-wrap">{message.content}</p>
        {isPending && (
          <span className="ml-1 inline-block h-4 w-1.5 animate-pulse rounded-sm bg-gold align-middle" />
        )}
      </div>
    </div>
  );
}
