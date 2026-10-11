"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { GridDots, PageNav, ScreenShell, SectionBadge } from "@/components/ui/shell";
import { supabaseBrowser } from "@/lib/supabase-browser";
import type { BusinessType, ChatMessage, SessionState } from "@/lib/types";

type BrainRow = {
  id: string;
  business_name: string;
  business_type: BusinessType;
  generated_at: string;
  session_duration: number;
  knowledge_md: string;
  processes_md: string;
  judgment_md: string;
};

type SessionRow = {
  id: string;
  business_name: string | null;
  business_type: BusinessType;
  status: SessionState["status"];
  questions_answered: number;
  messages: ChatMessage[];
  created_at: string;
  updated_at?: string;
};

export default function DashboardPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [about, setAbout] = useState("");
  const [brains, setBrains] = useState<BrainRow[]>([]);
  const [sessions, setSessions] = useState<SessionRow[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [needsMigration, setNeedsMigration] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      const { data: authData } = await supabaseBrowser.auth.getSession();

      if (!authData.session) {
        router.replace("/login?redirect=/dashboard");
        return;
      }

      const user = authData.session.user;
      const metadata = user.user_metadata as { name?: unknown; about?: unknown };
      setEmail(user.email ?? "");
      setDisplayName(typeof metadata.name === "string" ? metadata.name : "");
      setAbout(typeof metadata.about === "string" ? metadata.about : "");

      const [brainsResult, sessionsResult] = await Promise.all([
        supabaseBrowser
          .from("brains")
          .select("id,business_name,business_type,generated_at,session_duration,knowledge_md,processes_md,judgment_md")
          .eq("user_id", user.id)
          .order("generated_at", { ascending: false })
          .limit(12),
        supabaseBrowser
          .from("sessions")
          .select("id,business_name,business_type,status,questions_answered,messages,created_at,updated_at")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(12),
      ]);

      const missingUserId =
        brainsResult.error?.message.includes("user_id") ||
        sessionsResult.error?.message.includes("user_id");

      if (missingUserId) {
        console.warn(
          "Dashboard history is waiting for supabase/migrations/002_user_dashboard.sql to be applied."
        );
        const [fallbackBrainsResult, fallbackSessionsResult] = await Promise.all([
          supabaseBrowser
            .from("brains")
            .select("id,business_name,business_type,generated_at,session_duration,knowledge_md,processes_md,judgment_md")
            .order("generated_at", { ascending: false })
            .limit(12),
          supabaseBrowser
            .from("sessions")
            .select("id,business_name,business_type,status,questions_answered,messages,created_at,updated_at")
            .order("created_at", { ascending: false })
            .limit(12),
        ]);

        setNeedsMigration(true);
        setBrains((fallbackBrainsResult.data ?? []) as BrainRow[]);
        setSessions((fallbackSessionsResult.data ?? []) as SessionRow[]);
      } else if (brainsResult.error || sessionsResult.error) {
        setError(
          brainsResult.error?.message ??
            sessionsResult.error?.message ??
            "Could not load dashboard history."
        );
      } else {
        setBrains((brainsResult.data ?? []) as BrainRow[]);
        setSessions((sessionsResult.data ?? []) as SessionRow[]);
      }

      setIsLoading(false);
    }

    void loadDashboard();
  }, [router]);

  const activeSessions = sessions.filter((session) => session.status !== "complete").length;

  return (
    <ScreenShell>
      <GridDots />
      <PageNav />
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-5 rounded-[28px] border border-ivory-dk bg-white/80 p-5 shadow-sm backdrop-blur-sm sm:p-7 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <SectionBadge>Your private workspace</SectionBadge>
            <h1 className="mt-5 font-display text-[42px] leading-tight tracking-[-0.03em] text-navy">
              Dashboard
            </h1>
            <p className="mt-2 max-w-2xl text-[14px] leading-6 text-navy-lt">
              Welcome{displayName || email ? `, ${displayName || email}` : ""}. Your previous coaching chats and generated Company Brain files live here after login.
            </p>
            {about ? (
              <p className="mt-3 max-w-2xl rounded-2xl border border-ivory-dk bg-white/60 p-3 text-[13px] leading-6 text-navy-md">
                {about}
              </p>
            ) : null}
            {needsMigration ? (
              <p className="mt-2 max-w-2xl text-[12px] leading-5 text-navy-lt">
                History sync is being prepared. You can still start a new Company Brain now.
              </p>
            ) : null}
          </div>
          <Link
            className="inline-flex min-h-12 items-center justify-center rounded-2xl bg-gold px-6 text-[14px] font-semibold text-navy transition-all hover:bg-gold-dk hover:text-ivory hover:-translate-y-0.5 hover:shadow-md"
            href="/onboard"
          >
            Build new Company Brain
          </Link>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          {[
            { label: "Generated brains", value: brains.length },
            { label: "Saved chats", value: sessions.length },
            { label: "In-progress sessions", value: activeSessions },
          ].map((item) => (
            <div className="rounded-2xl border border-ivory-dk bg-white/80 p-4 shadow-sm" key={item.label}>
              <p className="font-display text-[30px] text-gold-gradient">{item.value}</p>
              <p className="mt-1 text-[12px] text-navy-lt">{item.label}</p>
            </div>
          ))}
        </div>

        {isLoading ? (
          <div className="mt-8 grid gap-4 lg:grid-cols-2">
            {[1, 2, 3, 4].map((item) => (
              <div className="h-44 animate-pulse rounded-[22px] bg-ivory-dk/40" key={item} />
            ))}
          </div>
        ) : null}

        {error ? (
          <div className="mt-8 rounded-[22px] border border-coral/25 bg-coral-pale p-5 text-[13px] leading-6 text-navy">
            <p className="font-semibold">Dashboard history could not load yet.</p>
            <p className="mt-1 text-navy-lt">{error}</p>
          </div>
        ) : null}

        {!isLoading && !error ? (
          <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(320px,.9fr)]">
            <section>
              <div className="mb-3 flex items-center justify-between gap-3">
                <h2 className="font-display text-[28px] tracking-[-0.02em] text-navy">
                  Brain files
                </h2>
                <span className="text-[11px] text-navy-lt">{brains.length} total</span>
              </div>

              {brains.length === 0 ? (
                <EmptyState
                  actionHref="/onboard"
                  actionLabel="Start your first brain"
                  text="No generated Company Brain yet. Complete the coach flow once and your files will appear here."
                  title="No brain files yet"
                />
              ) : (
                <div className="space-y-3">
                  {brains.map((brain) => (
                    <article className="rounded-[22px] border border-ivory-dk bg-white/80 p-4 shadow-sm" key={brain.id}>
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-gold-dk">
                            {brain.business_type}
                          </p>
                          <h3 className="mt-1 font-display text-[22px] text-navy">
                            {brain.business_name}
                          </h3>
                          <p className="mt-1 text-[12px] text-navy-lt">
                            Generated {new Date(brain.generated_at).toLocaleDateString("en-IN")} · {brain.session_duration} min session
                          </p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <Link className="rounded-xl bg-navy px-4 py-2 text-[12px] font-medium text-ivory transition-all hover:bg-gold hover:text-navy" href={`/brain/${brain.id}`}>
                            Open files
                          </Link>
                          <Link className="rounded-xl border border-ivory-dk bg-white/60 px-4 py-2 text-[12px] font-medium text-navy-md transition-all hover:border-gold/40 hover:bg-gold-pale hover:text-navy" href={`/brain/${brain.id}/share`}>
                            Share
                          </Link>
                        </div>
                      </div>
                      <div className="mt-4 grid gap-2 sm:grid-cols-3">
                        {[
                          { label: "KNOWLEDGE.md", content: brain.knowledge_md },
                          { label: "PROCESSES.md", content: brain.processes_md },
                          { label: "JUDGMENT.md", content: brain.judgment_md },
                        ].map((file) => (
                          <div className="rounded-xl border border-ivory-dk bg-ivory/60 p-3" key={file.label}>
                            <p className="font-mono text-[10px] text-navy">{file.label}</p>
                            <p className="mt-1 line-clamp-2 text-[11px] leading-5 text-navy-lt">
                              {file.content || "Waiting for content"}
                            </p>
                          </div>
                        ))}
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </section>

            <section>
              <div className="mb-3 flex items-center justify-between gap-3">
                <h2 className="font-display text-[28px] tracking-[-0.02em] text-navy">
                  Previous chats
                </h2>
                <span className="text-[11px] text-navy-lt">{sessions.length} saved</span>
              </div>

              {sessions.length === 0 ? (
                <EmptyState
                  actionHref="/onboard"
                  actionLabel="Start coaching"
                  text="Your coaching conversations will appear here after you answer the first question."
                  title="No saved chats yet"
                />
              ) : (
                <div className="max-h-[600px] space-y-3 overflow-y-auto pr-1">
                  {sessions.map((session) => {
                    const lastMessage = [...(session.messages ?? [])].reverse().find(Boolean);
                    return (
                      <article className="rounded-[22px] border border-ivory-dk bg-white/80 p-4 shadow-sm" key={session.id}>
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="font-medium text-navy">
                              {session.business_name || "Untitled business"}
                            </p>
                            <p className="mt-1 text-[11px] text-navy-lt">
                              {session.questions_answered}/5 answered · {session.status}
                            </p>
                          </div>
                          <span className="rounded-full border border-gold/30 bg-gold-pale px-2.5 py-1 text-[10px] font-semibold text-gold-dk">
                            {session.business_type}
                          </span>
                        </div>
                        <div className="mt-3 max-h-32 overflow-y-auto rounded-xl bg-ivory/60 p-3 text-[12px] leading-5 text-navy-lt">
                          <p className="whitespace-pre-wrap">{lastMessage?.content || "Session started, no message captured yet."}</p>
                        </div>
                      </article>
                    );
                  })}
                </div>
              )}
            </section>
          </div>
        ) : null}
      </main>
    </ScreenShell>
  );
}

function EmptyState({
  actionHref,
  actionLabel,
  text,
  title,
}: {
  actionHref: string;
  actionLabel: string;
  text: string;
  title: string;
}) {
  return (
    <div className="rounded-[22px] border border-dashed border-ivory-dk bg-white/50 p-6 text-center">
      <h3 className="font-display text-[24px] text-navy">{title}</h3>
      <p className="mx-auto mt-2 max-w-sm text-[13px] leading-6 text-navy-lt">{text}</p>
      <Link
        className="mt-5 inline-flex min-h-10 items-center rounded-xl bg-gold px-5 text-[13px] font-semibold text-navy transition-all hover:bg-gold-dk hover:text-ivory"
        href={actionHref}
      >
        {actionLabel}
      </Link>
    </div>
  );
}
