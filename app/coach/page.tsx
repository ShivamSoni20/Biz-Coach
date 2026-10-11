"use client";

import { nanoid } from "nanoid";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { BrainPreview } from "@/components/coach/brain-preview";
import { ChatInput } from "@/components/coach/chat-input";
import { ChatMessage } from "@/components/coach/chat-message";
import { ProgressSidebar } from "@/components/coach/progress-sidebar";
import { Button } from "@/components/ui/button";
import { ScreenShell } from "@/components/ui/shell";
import { supabaseBrowser } from "@/lib/supabase-browser";
import type { BusinessType, ChatMessage as ChatMessageType } from "@/lib/types";
import { getNextQuestionCount, parseBrainReady } from "@/lib/utils";

const businessTypeLabels: Record<BusinessType, string> = {
  agency: "Agency",
  freelancer: "Freelancer",
  consultant: "Consultant",
  startup: "Startup"
};

const mobileSteps = [
  "Operating model",
  "Onboarding",
  "Delivery",
  "Approval",
  "Tribal knowledge"
];

export default function CoachPage() {
  const router = useRouter();
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const sessionIdRef = useRef("");
  const [isMounted, setIsMounted] = useState(false);
  const [businessType, setBusinessType] = useState<BusinessType>("agency");
  const [businessName, setBusinessName] = useState("");
  const [messages, setMessages] = useState<ChatMessageType[]>([]);
  const [questionsAnswered, setQuestionsAnswered] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) {
      return;
    }

    async function startSession() {
      if (!sessionIdRef.current) {
        sessionIdRef.current = nanoid();
      }

      const { data } = await supabaseBrowser.auth.getSession();

      if (!data.session) {
        router.replace("/login?redirect=/coach");
        return;
      }

      const storedType = window.localStorage.getItem("businessType") as BusinessType | null;
      const storedName = window.localStorage.getItem("businessName") ?? "";
      const resolvedType = storedType ?? "agency";

      setBusinessType(resolvedType);
      setBusinessName(storedName);

      void sendMessageWithContext("__INIT__", resolvedType, storedName);
    }

    void startSession();
  }, [isMounted, router]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isGenerating]);

  async function sendMessageWithContext(
    userText: string,
    resolvedType: BusinessType,
    resolvedName: string
  ) {
    const isInit = userText === "__INIT__";
    setError(null);

    if (!isInit) {
      setMessages((current) => [
        ...current,
        { role: "user", content: userText, timestamp: new Date().toISOString() }
      ]);
    }

    setIsLoading(true);

    setMessages((current) => [
      ...current,
      { role: "assistant", content: "", timestamp: new Date().toISOString() }
    ]);

    try {
      const { data } = await supabaseBrowser.auth.refreshSession();

      if (!data.session) {
        router.replace("/login?redirect=/coach");
        throw new Error("Please login before continuing.");
      }

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${data.session.access_token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          sessionId: sessionIdRef.current,
          businessType: resolvedType,
          businessName: resolvedName,
          userMessage: isInit ? "Start" : userText
        })
      });

      if (!response.ok || !response.body) {
        const payload = (await response.json().catch(() => null)) as { error?: string } | null;
        throw new Error(payload?.error ?? "Could not reach the coach. Please try again.");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let aiText = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          break;
        }

        aiText += decoder.decode(value, { stream: true });
        setMessages((current) => {
          const next = [...current];
          next[next.length - 1] = { ...next[next.length - 1], content: aiText };
          return next;
        });
      }

      const nextCount = getNextQuestionCount(aiText, questionsAnswered);
      setQuestionsAnswered(nextCount);

      if (parseBrainReady(aiText) || nextCount >= 5) {
        await generateBrain();
      }
    } catch (caughtError) {
      const message =
        caughtError instanceof Error ? caughtError.message : "The chat request failed.";
      setError(message);
      setMessages((current) => current.slice(0, -1));
    } finally {
      setIsLoading(false);
    }
  }

  async function sendMessage(userText: string) {
    await sendMessageWithContext(userText, businessType, businessName);
  }

  async function generateBrain() {
    setIsGenerating(true);
    setError(null);

    try {
      const { data } = await supabaseBrowser.auth.refreshSession();

      if (!data.session) {
        router.replace("/login?redirect=/coach");
        throw new Error("Please login before generating your brain.");
      }

      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${data.session.access_token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ sessionId: sessionIdRef.current })
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as { error?: string } | null;
        throw new Error(payload?.error ?? "Brain generation failed. Please retry.");
      }

      const payload = (await response.json()) as { brainId: string };
      router.push(`/brain/${payload.brainId}`);
    } catch (caughtError) {
      const message =
        caughtError instanceof Error ? caughtError.message : "Brain generation failed.";
      setError(message);
      setIsGenerating(false);
    }
  }

  if (!isMounted) {
    return null;
  }

  return (
    <ScreenShell className="flex min-h-screen flex-col">
      <div className="relative z-10 flex min-h-screen flex-col">
        <header className="border-b border-ivory-dk bg-ivory/90 px-4 py-4 backdrop-blur-md sm:px-6">
          <div className="mx-auto flex max-w-7xl flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="font-display text-[15px] text-navy">Biz Coach</p>
              <p className="text-[12px] text-navy-lt">
                {businessName || "Untitled business"} · {businessTypeLabels[businessType]} · {questionsAnswered}/5 answered
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="inline-flex items-center gap-1.5 rounded-full border border-gold/30 bg-gold-pale px-3 py-1 text-[11px] font-medium uppercase tracking-[0.15em] text-gold-dk">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-gold animate-pulseLine" />
                {businessTypeLabels[businessType]}
              </div>
              <Button href="/onboard" variant="ghost">Change type</Button>
            </div>
          </div>
        </header>

        <div className="mx-auto flex w-full max-w-7xl flex-1">
          <ProgressSidebar questionsAnswered={questionsAnswered} />

          <main className="flex h-[calc(100vh-73px)] min-h-0 flex-1 flex-col overflow-hidden">
            <div className="border-b border-ivory-dk bg-white/40 px-4 py-3 lg:hidden">
              <div className="flex flex-wrap gap-2">
                {mobileSteps.map((step, index) => {
                  const isDone = index < questionsAnswered;
                  const isCurrent = index === questionsAnswered;
                  return (
                    <div
                      key={step}
                      className={`rounded-full border px-3 py-1 text-[11px] font-medium ${
                        isCurrent
                          ? "border-gold/30 bg-gold-pale text-navy font-semibold"
                          : isDone
                            ? "border-ivory-dk bg-ivory text-gold-dk"
                            : "border-ivory-dk bg-white/60 text-navy-lt"
                      }`}
                    >
                      {index + 1}. {step}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="grid min-h-0 flex-1 gap-5 overflow-hidden px-4 py-5 sm:px-6 xl:grid-cols-[minmax(0,1fr)_300px]">
              <section className="flex h-full min-h-0 flex-col rounded-[20px] border border-ivory-dk bg-white/80 shadow-sm">
                <div className="border-b border-ivory-dk px-5 py-4">
                  <p className="text-[14px] font-semibold text-navy">Structured coaching</p>
                  <p className="mt-0.5 text-[12px] text-navy-lt">
                    Answer with real examples, owners, tools, and edge cases.
                  </p>
                </div>

                <div className="flex-1 space-y-4 overflow-y-auto px-4 py-5 sm:px-5">
                  {messages.length === 0 ? (
                    <div className="rounded-2xl border border-ivory-dk bg-ivory/50 p-4 text-[13px] text-navy-lt">
                      Starting your session...
                    </div>
                  ) : null}

                  {messages.map((message, index) => (
                    <ChatMessage
                      key={`${message.timestamp}-${index}`}
                      isPending={isLoading && index === messages.length - 1 && message.role === "assistant"}
                      message={message}
                    />
                  ))}

                  {error ? (
                    <div className="rounded-2xl border border-coral/25 bg-coral-pale p-4 text-[13px]">
                      <p className="font-medium text-navy">Couldn&apos;t continue the coaching flow.</p>
                      <p className="mt-1.5 text-navy-lt">{error}</p>
                    </div>
                  ) : null}

                  {isGenerating ? (
                    <div className="rounded-2xl border border-gold/30 bg-gold-pale p-4 text-[13px] text-gold-dk">
                      <div className="flex items-center gap-2">
                        <span className="inline-block h-1.5 w-1.5 rounded-full bg-gold animate-pulseLine" />
                        Generating your Company Brain...
                      </div>
                    </div>
                  ) : null}

                  <div ref={bottomRef} />
                </div>

                <details className="border-t border-ivory-dk bg-white/40 px-4 py-2 xl:hidden">
                  <summary className="cursor-pointer text-[11px] font-semibold text-gold-dk">
                    💡 Prompting tips
                  </summary>
                  <ul className="mt-2 space-y-1 pb-2 text-[11px] leading-5 text-navy-lt">
                    <li>Use exact numbers: retainers, turnaround times, approval windows.</li>
                    <li>Name real tools and owners — not just &quot;the team&quot;.</li>
                    <li>Call out failure cases and escalation rules.</li>
                  </ul>
                </details>

                <ChatInput
                  disabled={isLoading || isGenerating}
                  isComplete={isGenerating}
                  onSend={sendMessage}
                />
              </section>

              <aside className="hidden space-y-4 overflow-y-auto pr-1 xl:block xl:h-full">
                <BrainPreview questionsAnswered={questionsAnswered} />
                <div className="rounded-[20px] border border-ivory-dk bg-white/80 p-5">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-gold-dk">
                    Prompting tips
                  </p>
                  <ul className="mt-4 space-y-3 text-[12px] leading-6 text-navy-lt">
                    <li>Use exact numbers: retainers, turnaround times, approval windows.</li>
                    <li>Name real tools and owners, not just &quot;the team&quot;.</li>
                    <li>Call out failure cases and escalation rules when work gets blocked.</li>
                  </ul>
                </div>
              </aside>
            </div>
          </main>
        </div>
      </div>
    </ScreenShell>
  );
}
