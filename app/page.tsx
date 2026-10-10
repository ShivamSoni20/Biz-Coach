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
    <div className="min-h-screen bg-ivory font-sans text-navy selection:bg-gold selection:text-navy">
      {/* 1. Navbar */}
      <header className="sticky top-0 z-30 border-b border-ivory-dk bg-ivory/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3 sm:px-6">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gold font-display text-[15px] font-bold text-navy shadow-sm">
              BC
            </div>
            <span className="font-display text-[22px] font-bold tracking-tight text-navy">
              Biz Coach
            </span>
          </Link>

          <div className="flex items-center gap-4 sm:gap-6">
            <Link
              href="#how-it-works"
              className="text-[13px] font-medium text-navy-md transition-colors hover:text-navy"
            >
              How it works
            </Link>
            <Link
              href="#faq"
              className="text-[13px] font-medium text-navy-md transition-colors hover:text-navy"
            >
              FAQ
            </Link>
            <Link
              href="/login?redirect=/dashboard"
              className="rounded-lg bg-gold px-3.5 py-1.5 text-[12px] font-semibold text-navy shadow-sm transition-all hover:bg-gold-dk hover:text-ivory hover:shadow"
            >
              Build my Company Brain
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-12">
        {/* 2. Hero */}
        <section className="text-center">
          <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-gold-dk">
            FOR AGENCIES, FREELANCERS &amp; CONSULTANTS
          </p>

          <h1 className="mx-auto mt-4 max-w-2xl font-display text-[38px] font-bold leading-[1.12] tracking-[-0.03em] text-navy sm:text-[54px]">
            Your company has a brain.
            <br />
            It&apos;s in your head.
          </h1>

          <p className="mx-auto mt-4 max-w-xl text-[15px] font-normal leading-relaxed text-navy-md sm:text-[16px]">
            Answer 5 questions. Biz Coach turns your tribal knowledge into SOPs, judgment rules,
            and a live API your team and AI agents can use.
          </p>

          <div className="mt-6 flex flex-col items-center justify-center gap-2.5">
            <Link
              href="/login?redirect=/dashboard"
              className="w-full rounded-xl bg-gold px-8 py-3.5 text-center text-[15px] font-semibold text-navy shadow-sm transition-all hover:bg-gold-dk hover:text-ivory hover:shadow-md sm:w-auto"
            >
              Build my Company Brain
            </Link>
            <Link
              href="#how-it-works"
              className="text-[13px] font-medium text-navy-md underline underline-offset-4 transition-colors hover:text-navy"
            >
              See how it works
            </Link>
          </div>
        </section>

        {/* 3. Product visual (Live coaching session) */}
        <section className="mt-10 sm:mt-14">
          <div className="overflow-hidden rounded-2xl border border-ivory-dk bg-[#FCFAF5] p-5 shadow-sm sm:p-7">
            <div className="text-center">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-gold/30 bg-gold-pale px-3 py-1 text-[11px] font-semibold text-gold-dk">
                <span>💬</span> Live coaching session
              </span>
            </div>

            <div className="mt-4 rounded-xl border border-ivory-dk bg-white p-4">
              <p className="text-[13px] font-bold text-navy">
                <span className="text-gold-dk">Q3:</span> What&apos;s your main service delivery process? Who does what, in what order?
              </p>
            </div>

            <div className="mt-4 px-1 text-[13px] leading-relaxed text-navy">
              <span className="font-semibold text-navy-md">Founder answer:</span>
              <p className="mt-0.5 text-navy-md">
                We start with a discovery call → scope the project in Notion → designer builds → I review → we deliver via email + Loom walkthrough.
              </p>
            </div>

            <div className="my-4 flex justify-center text-gold">
              <span className="text-xl font-bold">↓</span>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div className="flex flex-col items-center rounded-xl border border-ivory-dk bg-white p-4 text-center">
                <span className="text-2xl text-gold">📄</span>
                <p className="mt-2 text-[13px] font-bold text-navy">KNOWLEDGE.md</p>
                <p className="mt-0.5 text-[11px] text-navy-lt">core facts + context</p>
              </div>

              <div className="flex flex-col items-center rounded-xl border border-ivory-dk bg-white p-4 text-center">
                <span className="text-2xl text-gold">📑</span>
                <p className="mt-2 text-[13px] font-bold text-navy">PROCESSES.md</p>
                <p className="mt-0.5 text-[11px] text-navy-lt">step-by-step SOPs</p>
              </div>

              <div className="flex flex-col items-center rounded-xl border border-ivory-dk bg-white p-4 text-center">
                <span className="text-2xl text-gold">📋</span>
                <p className="mt-2 text-[13px] font-bold text-navy">JUDGMENT.md</p>
                <p className="mt-0.5 text-[11px] text-navy-lt">rules + decisions</p>
              </div>
            </div>
          </div>
        </section>

        {/* 4. Magic moment strip */}
        <section className="mt-14 sm:mt-18">
          <div className="text-center">
            <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-gold-dk">
              MAGIC MOMENT
            </p>
            <h2 className="mt-1 font-display text-[20px] font-bold text-navy sm:text-[22px]">
              From 5 answers to a Company Brain + live API
            </h2>
          </div>

          <div className="mt-6 flex flex-col items-center justify-between gap-3 sm:flex-row sm:gap-2">
            <div className="flex w-full flex-1 items-center gap-3 rounded-xl border border-ivory-dk bg-white p-3.5 sm:w-auto">
              <span className="text-xl text-gold">📋</span>
              <div>
                <p className="text-[12px] font-bold text-navy">5 plain answers</p>
                <p className="text-[11px] text-navy-lt">Quick Q&amp;A format</p>
              </div>
            </div>

            <span className="text-sm font-bold text-gold sm:text-base">→</span>

            <div className="flex w-full flex-1 items-center gap-3 rounded-xl border border-ivory-dk bg-white p-3.5 sm:w-auto">
              <span className="text-xl text-gold">⚡</span>
              <div>
                <p className="text-[12px] font-bold text-navy">Biz Coach extracts</p>
                <p className="text-[11px] text-navy-lt">turns into SOPs &amp; rules</p>
              </div>
            </div>

            <span className="text-sm font-bold text-gold sm:text-base">→</span>

            <div className="flex w-full flex-1 items-center gap-3 rounded-xl border border-ivory-dk bg-white p-3.5 sm:w-auto">
              <span className="text-xl text-gold">🔗</span>
              <div>
                <p className="text-[12px] font-bold text-navy">Company Brain + live API</p>
                <p className="text-[11px] text-navy-lt">ready to share &amp; use</p>
              </div>
            </div>
          </div>
        </section>

        {/* 5. How it works & 6. Proof strip */}
        <section id="how-it-works" className="mt-16 scroll-mt-20 sm:mt-20">
          <div className="text-center sm:text-left">
            <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-gold-dk">
              HOW IT WORKS
            </p>
          </div>

          <div className="mt-5 grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-start">
            {/* Steps (left) */}
            <div className="space-y-3.5 lg:col-span-7">
              <div className="flex items-start gap-3.5 rounded-xl border border-ivory-dk bg-white p-4">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gold text-[11px] font-bold text-navy">
                  1
                </div>
                <div>
                  <p className="text-[13px] font-bold text-navy">
                    1. Answer 5 questions — <span className="font-normal text-navy-md">plain language, Hinglish welcome.</span>
                  </p>
                  <p className="mt-0.5 text-[12px] text-navy-lt">
                    One question at a time — no prompt engineering needed.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5 rounded-xl border border-ivory-dk bg-white p-4">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gold text-[11px] font-bold text-navy">
                  2
                </div>
                <div>
                  <p className="text-[13px] font-bold text-navy">
                    2. Get your Company Brain — <span className="font-normal text-navy-md">SOPs, judgment rules, skills.</span>
                  </p>
                  <p className="mt-0.5 text-[12px] text-navy-lt">
                    Generated in ~20 minutes with zero hallucination.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5 rounded-xl border border-ivory-dk bg-white p-4">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gold text-[11px] font-bold text-navy">
                  3
                </div>
                <div>
                  <p className="text-[13px] font-bold text-navy">
                    3. Share it everywhere — <span className="font-normal text-navy-md">team link + live JSON API.</span>
                  </p>
                  <p className="mt-0.5 text-[12px] text-navy-lt">
                    Read-only link for teammates, live JSON API for your AI agents.
                  </p>
                </div>
              </div>
            </div>

            {/* Proof strip (right) */}
            <div className="rounded-2xl border border-ivory-dk bg-[#FCFAF5] p-5 lg:col-span-5">
              <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-gold-dk">
                PROOF STRIP
              </p>

              <div className="mt-4 grid grid-cols-2 gap-4">
                <div>
                  <p className="font-display text-[22px] font-bold text-gold-dk">5 questions</p>
                  <p className="text-[11px] text-navy-lt">to complete</p>
                </div>
                <div>
                  <p className="font-display text-[22px] font-bold text-gold-dk">~20 min</p>
                  <p className="text-[11px] text-navy-lt">average setup</p>
                </div>
                <div>
                  <p className="font-display text-[22px] font-bold text-gold-dk">3 files</p>
                  <p className="text-[10px] leading-tight text-navy-lt">
                    KNOWLEDGE.md · PROCESSES.md · JUDGMENT.md
                  </p>
                </div>
                <div>
                  <p className="font-display text-[22px] font-bold text-gold-dk">1 live API</p>
                  <p className="text-[11px] text-navy-lt">JSON endpoint</p>
                </div>
              </div>

              <div className="mt-5 border-t border-ivory-dk pt-3 text-center">
                <p className="text-[11px] text-navy-lt">
                  MIT open source · no data training · self-hostable
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 7. FAQ */}
        <section id="faq" className="mt-16 scroll-mt-20 sm:mt-20">
          <div className="text-center">
            <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-gold-dk">
              FAQ
            </p>
            <h2 className="mt-1 font-display text-[24px] font-bold text-navy">
              Frequently asked questions
            </h2>
          </div>

          <div className="mt-6 space-y-3">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className="rounded-xl border border-ivory-dk bg-white p-4.5 sm:p-5"
              >
                <p className="text-[14px] font-bold text-navy">{faq.q}</p>
                <p className="mt-1.5 text-[13px] leading-relaxed text-navy-md">{faq.a}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* 8. Final CTA (Deep Atlas Navy Band) */}
      <section className="mt-20 bg-navy py-16 text-center text-ivory sm:py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <h2 className="font-display text-[32px] font-bold tracking-tight text-ivory sm:text-[42px]">
            Stop losing what only you know.
          </h2>

          <div className="mt-6 flex flex-col items-center justify-center gap-2">
            <Link
              href="/login?redirect=/dashboard"
              className="w-full rounded-xl bg-gold px-8 py-3.5 text-center text-[15px] font-semibold text-navy shadow-sm transition-all hover:bg-gold-dk hover:text-ivory hover:shadow-md sm:w-auto"
            >
              Build my Company Brain
            </Link>
            <p className="text-[12px] text-ivory-deep">Free to try · No credit card required</p>
          </div>
        </div>
      </section>

      {/* 9. Footer (Deep Navy) */}
      <footer className="border-t border-navy-md bg-navy py-8 text-[12px] text-navy-lt">
        <div className="mx-auto flex max-w-4xl flex-col items-center justify-between gap-3 px-4 sm:flex-row sm:px-6">
          <p className="text-ivory-deep">© 2026 Biz Coach</p>
          <div className="flex items-center gap-4">
            <a
              href="https://github.com/ShivamSoni20/Biz-Coach"
              target="_blank"
              rel="noreferrer"
              className="transition-colors hover:text-gold"
            >
              GitHub
            </a>
            <Link href="#how-it-works" className="transition-colors hover:text-gold">
              How it works
            </Link>
            <Link href="#faq" className="transition-colors hover:text-gold">
              FAQ
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
