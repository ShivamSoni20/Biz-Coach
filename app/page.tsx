import Link from "next/link";

export default function LandingPage() {
  const faqs = [
    {
      q: "What do I get?",
      a: "Three markdown files (KNOWLEDGE.md, PROCESSES.md, JUDGMENT.md), extracted skill records, a read-only share link, and a live JSON API endpoint.",
    },
    {
      q: "Do I need to write prompts?",
      a: "No. You answer 5 questions in plain language — the coach does the structuring.",
    },
    {
      q: "What does the AI do with my answers?",
      a: "It only uses what you said. Anything not stated is marked 'Not specified' — never invented.",
    },
    {
      q: "Is it free?",
      a: "Yes — free to try, no credit card required.",
    },
  ];

  return (
    <div className="min-h-screen bg-[#f7f4ee] font-sans text-ink selection:bg-teal selection:text-white">
      {/* 1. Navbar */}
      <header className="sticky top-0 z-30 border-b border-[#2a2d24]/10 bg-[#f7f4ee]/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3 sm:px-6">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal font-display text-[15px] font-bold text-white shadow-sm">
              BC
            </div>
            <span className="font-display text-[22px] font-bold tracking-tight text-ink">
              Biz Coach
            </span>
          </Link>

          <div className="flex items-center gap-4 sm:gap-6">
            <Link
              href="#how-it-works"
              className="text-[13px] font-medium text-ink-md transition-colors hover:text-ink"
            >
              How it works
            </Link>
            <Link
              href="#faq"
              className="text-[13px] font-medium text-ink-md transition-colors hover:text-ink"
            >
              FAQ
            </Link>
            <Link
              href="/login?redirect=/dashboard"
              className="rounded-lg bg-teal px-3.5 py-1.5 text-[12px] font-semibold text-white shadow-sm transition-all hover:bg-[#38b2a7] hover:shadow"
            >
              Build my Company Brain
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-12">
        {/* 2. Hero */}
        <section className="text-center">
          <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#0d9488]">
            FOR AGENCIES, FREELANCERS &amp; CONSULTANTS
          </p>

          <h1 className="mx-auto mt-4 max-w-2xl font-display text-[38px] font-bold leading-[1.12] tracking-[-0.03em] text-ink sm:text-[54px]">
            Your company has a brain.
            <br />
            It&apos;s in your head.
          </h1>

          <p className="mx-auto mt-4 max-w-xl text-[15px] font-normal leading-relaxed text-ink-md sm:text-[16px]">
            Answer 5 questions. Biz Coach turns your tribal knowledge into SOPs, judgment rules,
            and a live API your team and AI agents can use.
          </p>

          <div className="mt-6 flex flex-col items-center justify-center gap-2.5">
            <Link
              href="/login?redirect=/dashboard"
              className="w-full rounded-xl bg-teal px-8 py-3.5 text-center text-[15px] font-semibold text-white shadow-sm transition-all hover:bg-[#38b2a7] hover:shadow-md sm:w-auto"
            >
              Build my Company Brain
            </Link>
            <Link
              href="#how-it-works"
              className="text-[13px] font-medium text-ink-md underline underline-offset-4 transition-colors hover:text-ink"
            >
              See how it works
            </Link>
          </div>
        </section>

        {/* 3. Product visual (Live coaching session) */}
        <section className="mt-10 sm:mt-14">
          <div className="overflow-hidden rounded-2xl border border-[#2a2d24]/12 bg-[#fbf9f4] p-5 shadow-sm sm:p-7">
            <div className="text-center">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-teal/30 bg-teal/10 px-3 py-1 text-[11px] font-medium text-[#0d9488]">
                <span>💬</span> Live coaching session
              </span>
            </div>

            <div className="mt-4 rounded-xl border border-[#2a2d24]/10 bg-white p-4">
              <p className="text-[13px] font-bold text-ink">
                <span className="text-teal">Q3:</span> What&apos;s your main service delivery process? Who does what, in what order?
              </p>
            </div>

            <div className="mt-4 px-1 text-[13px] leading-relaxed text-ink">
              <span className="font-semibold text-ink-md">Founder answer:</span>
              <p className="mt-0.5 text-ink-md">
                We start with a discovery call → scope the project in Notion → designer builds → I review → we deliver via email + Loom walkthrough.
              </p>
            </div>

            <div className="my-4 flex justify-center text-teal">
              <span className="text-xl font-bold">↓</span>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div className="flex flex-col items-center rounded-xl border border-[#2a2d24]/10 bg-white p-4 text-center">
                <span className="text-2xl text-teal">📄</span>
                <p className="mt-2 text-[13px] font-bold text-ink">KNOWLEDGE.md</p>
                <p className="mt-0.5 text-[11px] text-ink-lt">core facts + context</p>
              </div>

              <div className="flex flex-col items-center rounded-xl border border-[#2a2d24]/10 bg-white p-4 text-center">
                <span className="text-2xl text-teal">📑</span>
                <p className="mt-2 text-[13px] font-bold text-ink">PROCESSES.md</p>
                <p className="mt-0.5 text-[11px] text-ink-lt">step-by-step SOPs</p>
              </div>

              <div className="flex flex-col items-center rounded-xl border border-[#2a2d24]/10 bg-white p-4 text-center">
                <span className="text-2xl text-teal">📋</span>
                <p className="mt-2 text-[13px] font-bold text-ink">JUDGMENT.md</p>
                <p className="mt-0.5 text-[11px] text-ink-lt">rules + decisions</p>
              </div>
            </div>
          </div>
        </section>

        {/* 4. Magic moment strip */}
        <section className="mt-14 sm:mt-18">
          <div className="text-center">
            <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#0d9488]">
              MAGIC MOMENT
            </p>
            <h2 className="mt-1 font-display text-[20px] font-bold text-ink sm:text-[22px]">
              From 5 answers to a Company Brain + live API
            </h2>
          </div>

          <div className="mt-6 flex flex-col items-center justify-between gap-3 sm:flex-row sm:gap-2">
            <div className="flex w-full flex-1 items-center gap-3 rounded-xl border border-[#2a2d24]/10 bg-white p-3.5 sm:w-auto">
              <span className="text-xl text-teal">📋</span>
              <div>
                <p className="text-[12px] font-bold text-ink">5 plain answers</p>
                <p className="text-[11px] text-ink-lt">Quick Q&amp;A format</p>
              </div>
            </div>

            <span className="text-sm font-bold text-teal sm:text-base">→</span>

            <div className="flex w-full flex-1 items-center gap-3 rounded-xl border border-[#2a2d24]/10 bg-white p-3.5 sm:w-auto">
              <span className="text-xl text-teal">⚡</span>
              <div>
                <p className="text-[12px] font-bold text-ink">Biz Coach extracts</p>
                <p className="text-[11px] text-ink-lt">turns into SOPs &amp; rules</p>
              </div>
            </div>

            <span className="text-sm font-bold text-teal sm:text-base">→</span>

            <div className="flex w-full flex-1 items-center gap-3 rounded-xl border border-[#2a2d24]/10 bg-white p-3.5 sm:w-auto">
              <span className="text-xl text-teal">🔗</span>
              <div>
                <p className="text-[12px] font-bold text-ink">Company Brain + live API</p>
                <p className="text-[11px] text-ink-lt">ready to share &amp; use</p>
              </div>
            </div>
          </div>
        </section>

        {/* 5. How it works & 6. Proof strip */}
        <section id="how-it-works" className="mt-16 scroll-mt-20 sm:mt-20">
          <div className="text-center sm:text-left">
            <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#0d9488]">
              HOW IT WORKS
            </p>
          </div>

          <div className="mt-5 grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-start">
            {/* Steps (left) */}
            <div className="space-y-3.5 lg:col-span-7">
              <div className="flex items-start gap-3.5 rounded-xl border border-[#2a2d24]/10 bg-white p-4">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-teal text-[11px] font-bold text-white">
                  1
                </div>
                <div>
                  <p className="text-[13px] font-bold text-ink">
                    1. Answer 5 questions — <span className="font-normal text-ink-md">plain language, Hinglish welcome.</span>
                  </p>
                  <p className="mt-0.5 text-[12px] text-ink-lt">
                    One question at a time — no prompt engineering needed.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5 rounded-xl border border-[#2a2d24]/10 bg-white p-4">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-teal text-[11px] font-bold text-white">
                  2
                </div>
                <div>
                  <p className="text-[13px] font-bold text-ink">
                    2. Get your Company Brain — <span className="font-normal text-ink-md">SOPs, judgment rules, skills.</span>
                  </p>
                  <p className="mt-0.5 text-[12px] text-ink-lt">
                    Generated in ~20 minutes with zero hallucination.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5 rounded-xl border border-[#2a2d24]/10 bg-white p-4">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-teal text-[11px] font-bold text-white">
                  3
                </div>
                <div>
                  <p className="text-[13px] font-bold text-ink">
                    3. Share it everywhere — <span className="font-normal text-ink-md">team link + live JSON API.</span>
                  </p>
                  <p className="mt-0.5 text-[12px] text-ink-lt">
                    Read-only link for teammates, live JSON API for your AI agents.
                  </p>
                </div>
              </div>
            </div>

            {/* Proof strip (right) */}
            <div className="rounded-2xl border border-[#2a2d24]/10 bg-[#fbf9f4] p-5 lg:col-span-5">
              <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#0d9488]">
                PROOF STRIP
              </p>

              <div className="mt-4 grid grid-cols-2 gap-4">
                <div>
                  <p className="font-display text-[22px] font-bold text-teal">5 questions</p>
                  <p className="text-[11px] text-ink-lt">to complete</p>
                </div>
                <div>
                  <p className="font-display text-[22px] font-bold text-teal">~20 min</p>
                  <p className="text-[11px] text-ink-lt">average setup</p>
                </div>
                <div>
                  <p className="font-display text-[22px] font-bold text-teal">3 files</p>
                  <p className="text-[10px] leading-tight text-ink-lt">
                    KNOWLEDGE.md · PROCESSES.md · JUDGMENT.md
                  </p>
                </div>
                <div>
                  <p className="font-display text-[22px] font-bold text-teal">1 live API</p>
                  <p className="text-[11px] text-ink-lt">JSON endpoint</p>
                </div>
              </div>

              <div className="mt-5 border-t border-[#2a2d24]/8 pt-3 text-center">
                <p className="text-[11px] text-ink-lt">
                  MIT open source · no data training · self-hostable
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 7. FAQ */}
        <section id="faq" className="mt-16 scroll-mt-20 sm:mt-20">
          <div className="text-center">
            <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#0d9488]">
              FAQ
            </p>
            <h2 className="mt-1 font-display text-[24px] font-bold text-ink">
              Frequently asked questions
            </h2>
          </div>

          <div className="mt-6 space-y-3">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className="rounded-xl border border-[#2a2d24]/10 bg-white p-4.5 sm:p-5"
              >
                <p className="text-[14px] font-bold text-ink">{faq.q}</p>
                <p className="mt-1.5 text-[13px] leading-relaxed text-ink-md">{faq.a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 8. Final CTA */}
        <section className="mt-16 text-center sm:mt-20">
          <h2 className="font-display text-[32px] font-bold tracking-tight text-ink sm:text-[40px]">
            Stop losing what only you know.
          </h2>

          <div className="mt-6 flex flex-col items-center justify-center gap-2">
            <Link
              href="/login?redirect=/dashboard"
              className="w-full rounded-xl bg-teal px-8 py-3.5 text-center text-[15px] font-semibold text-white shadow-sm transition-all hover:bg-[#38b2a7] hover:shadow-md sm:w-auto"
            >
              Build my Company Brain
            </Link>
            <p className="text-[12px] text-ink-lt">Free to try · No credit card required</p>
          </div>
        </section>
      </main>

      {/* 9. Footer */}
      <footer className="mt-16 border-t border-[#2a2d24]/10 bg-[#f7f4ee] py-6 sm:mt-20">
        <div className="mx-auto flex max-w-4xl flex-col items-center justify-between gap-3 px-4 text-[12px] text-ink-lt sm:flex-row sm:px-6">
          <p>© 2026 Biz Coach</p>
          <div className="flex items-center gap-4">
            <a
              href="https://github.com/ShivamSoni20/Biz-Coach"
              target="_blank"
              rel="noreferrer"
              className="transition-colors hover:text-ink"
            >
              GitHub
            </a>
            <Link href="#how-it-works" className="transition-colors hover:text-ink">
              How it works
            </Link>
            <Link href="#faq" className="transition-colors hover:text-ink">
              FAQ
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
