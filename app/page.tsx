import Link from "next/link";
import type { CSSProperties } from "react";

import { GridDots, PageNav, ScreenShell, SectionBadge } from "@/components/ui/shell";

const stats = [
  { value: "20 min", label: "average completion time" },
  { value: "5 questions", label: "total input required" },
  { value: "3 files", label: "auto-generated outputs" },
  { value: "1 live URL", label: "queryable team endpoint" }
];

const bentoItems = [
  {
    id: "flow",
    span: "lg:col-span-3 lg:row-span-2",
    accent: true,
    icon: "💬",
    title: "5-question guided flow",
    desc: "A guided coach that pulls out your operating model, workflows, and judgment criteria without turning the founder into a prompt engineer. One question at a time, adapted to your business type.",
    tags: ["Operating Model", "Processes", "Tasks"]
  },
  {
    id: "knowledge",
    span: "lg:col-span-2",
    icon: "📄",
    title: "KNOWLEDGE.md",
    desc: "Company context, pricing logic, client profile, and team structure in a clean AI-readable file."
  },
  {
    id: "processes",
    span: "lg:col-span-1",
    icon: "🔄",
    title: "PROCESSES.md",
    desc: "Workflows with owners and triggers."
  },
  {
    id: "judgment",
    span: "lg:col-span-1",
    icon: "⚖️",
    title: "JUDGMENT.md",
    desc: "Quality criteria and approval guardrails, codified."
  },
  {
    id: "api",
    span: "lg:col-span-2",
    icon: "🔌",
    title: "Live API endpoint",
    desc: "A queryable JSON URL any AI tool or agent can call from day one."
  },
  {
    id: "share",
    span: "lg:col-span-3",
    accent: true,
    icon: "🔗",
    title: "Share-ready output",
    desc: "A read-only browser view that onboards teammates without dumping raw prompts on them.",
    stat: { val: "1 link", sub: "shareable URL" }
  }
];

const steps = [
  {
    num: "1",
    color: "bg-teal-pale text-teal",
    title: "Pick your business type",
    desc: "Agency, freelancer, consultant, or startup. The conversation adapts from the first question to match your context and language."
  },
  {
    num: "2",
    color: "bg-sage-pale text-green-dk",
    title: "Answer five focused questions",
    desc: "Describe real workflows, approvals, pricing, and edge cases in plain language. Hinglish is perfectly fine."
  },
  {
    num: "3",
    color: "bg-wheat-lt text-amber-700",
    title: "Ship your Company Brain",
    desc: "Three markdown files plus a live JSON endpoint your team and AI agents can query immediately."
  }
];

const businessTypes = [
  "Marketing Agency",
  "Dev Studio",
  "CA Firm",
  "Design Freelancer",
  "Growth Consultant",
  "PR Agency",
  "Legal Advisory",
  "Architecture Studio",
  "EdTech Startup",
  "Finance Advisor",
  "Social Media Agency",
  "HR Consultancy"
];

export default function LandingPage() {
  return (
    <ScreenShell>
      <GridDots />
      <PageNav />

      <section className="relative mx-auto max-w-6xl px-4 pb-20 pt-16 sm:px-6 lg:px-8 lg:pb-28 lg:pt-24">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="blob-teal absolute -right-20 -top-20 h-[380px] w-[380px] rounded-full blur-[60px]" />
          <div className="blob-sage absolute -bottom-10 -left-10 h-[280px] w-[280px] rounded-full blur-[50px]" />
          <div className="blob-wheat absolute left-1/3 top-1/2 h-[200px] w-[200px] -translate-y-1/2 rounded-full blur-[50px]" />
        </div>

        <div className="relative z-10 flex flex-col gap-12 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-[580px]">
            <SectionBadge>Build your Company Brain in 20 minutes</SectionBadge>

            <h1 className="mt-6 text-balance font-display text-[clamp(38px,5.5vw,64px)] leading-[1.08] tracking-[-0.03em] text-ink">
              Your business runs on <em className="not-italic text-teal-gradient">tribal knowledge.</em>
              <br />
              Let&apos;s fix that.
            </h1>

            <p className="mt-5 max-w-lg text-pretty text-[17px] font-light leading-[1.75] text-ink-md">
              Biz Coach guides Indian service businesses through{" "}
              <strong className="font-medium text-ink">5 structured questions</strong> and
              auto-generates their SOPs, judgment layer, and a live AI-ready Company Brain endpoint.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href="/login?redirect=/dashboard"
                className="inline-flex items-center gap-2 rounded-xl bg-ink px-7 py-3.5 text-[15px] font-medium text-white transition-all hover:-translate-y-0.5 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                🧠 Login to dashboard →
              </Link>
              <Link
                href="#how"
                className="inline-flex items-center rounded-xl border border-ink/12 bg-transparent px-6 py-3.5 text-[15px] font-normal text-ink-md transition-all hover:border-teal/40 hover:bg-teal-pale hover:text-green-dk focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                See a demo
              </Link>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-4 text-[12px] text-ink-lt">
              <div className="flex">
                {["🏢", "💻", "📊", "🚀", "🎨"].map((emoji, index) => (
                  <div
                    className={`${index === 0 ? "" : "-ml-2"} flex h-7 w-7 items-center justify-center rounded-full border-2 border-[#f7f4ee] text-[11px]`}
                    key={emoji}
                    style={{
                      background: [
                        "linear-gradient(var(--sage-lt),var(--sage))",
                        "linear-gradient(var(--teal-pale),var(--mint))",
                        "linear-gradient(var(--wheat-lt),var(--wheat))",
                        "linear-gradient(var(--cream),var(--cream-dk))",
                        "linear-gradient(var(--coral-pale),var(--coral-lt))"
                      ][index]
                    }}
                  >
                    {emoji}
                  </div>
                ))}
              </div>
              <span>
                Trusted by <strong className="text-ink">500+</strong> Indian service businesses
              </span>
              <span className="inline-block h-4 w-px bg-ink/10" />
              <span>
                <strong className="text-ink">4.9 / 5</strong>
              </span>
            </div>
          </div>

          <div className="relative hidden h-[280px] w-[280px] shrink-0 items-center justify-center lg:flex">
            <div className="absolute h-[260px] w-[260px] rounded-full border border-dashed border-teal/20" />
            <div className="absolute h-[180px] w-[180px] rounded-full border border-dashed border-sage/30" />

            {[
              { icon: "📄", delay: "0s" },
              { icon: "🔄", delay: "-4.6s" },
              { icon: "⚖️", delay: "-9.3s" }
            ].map(({ icon, delay }) => (
              <div
                className="absolute flex h-9 w-9 items-center justify-center rounded-full border border-sage/40 bg-white text-sm shadow-sm"
                key={icon}
                style={{
                  animation: `orbitSlow 14s linear ${delay} infinite`,
                  ["--orbit-r" as const]: "130px"
                } as CSSProperties}
              >
                {icon}
              </div>
            ))}

            {[
              { icon: "🔌", delay: "0s" },
              { icon: "🔗", delay: "-5s" }
            ].map(({ icon, delay }) => (
              <div
                className="absolute flex h-8 w-8 items-center justify-center rounded-full border border-teal/25 bg-white text-xs shadow-sm"
                key={icon}
                style={{
                  animation: `orbitSlow 9s linear ${delay} infinite reverse`,
                  ["--orbit-r" as const]: "90px"
                } as CSSProperties}
              >
                {icon}
              </div>
            ))}

            <div className="relative z-10 flex h-[76px] w-[76px] items-center justify-center rounded-2xl border border-teal/25 bg-gradient-to-br from-teal-pale to-mint-lt text-[32px] shadow-glow">
              🧠
            </div>
          </div>
        </div>
      </section>

      <div className="border-y border-sage/25 bg-white/55 backdrop-blur-sm">
        <div className="mx-auto grid max-w-6xl grid-cols-2 divide-x divide-sage/20 lg:grid-cols-4">
          {stats.map((stat) => (
            <div
              className="px-6 py-6 text-center"
              key={stat.label}
            >
              <p className="font-display text-3xl text-teal-gradient">{stat.value}</p>
              <p className="mt-1.5 text-[11px] tracking-wide text-ink-lt">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <h2 className="font-display text-[36px] tracking-[-0.02em] text-ink">
            Everything your agents need to <em className="not-italic text-teal">actually work</em>
          </h2>
          <p className="mx-auto mt-3 max-w-md text-[14px] leading-[1.7] text-ink-lt">
            Three structured files plus a live JSON API. Plug into any tool or workflow from day one.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-3 lg:grid-cols-6">
          {bentoItems.map((item) => (
            <article
              className={`group relative min-h-[160px] overflow-hidden rounded-[20px] border p-5 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md ${
                item.accent
                  ? "border-teal/25 bg-gradient-to-br from-teal-pale/60 to-sage-pale/60"
                  : "border-sage/30 bg-white"
              } ${item.span ?? ""}`}
              key={item.id}
            >
              <div className="mb-2 text-[22px]">{item.icon}</div>
              <h3 className="text-[14px] font-semibold text-ink">{item.title}</h3>
              <p className="mt-1.5 text-[12px] leading-[1.65] text-ink-lt">{item.desc}</p>

              {"tags" in item && item.tags ? (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {item.tags.map((tag) => (
                    <span
                      className="rounded-full border border-teal/25 bg-teal-pale px-2.5 py-0.5 text-[10px] font-medium text-green-dk"
                      key={tag}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              ) : null}

              {"stat" in item && item.stat ? (
                <div className="absolute right-5 top-1/2 -translate-y-1/2 text-right">
                  <p className="font-display text-[22px] text-coral">{item.stat.val}</p>
                  <p className="text-[10px] text-ink-lt">{item.stat.sub}</p>
                </div>
              ) : null}
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6 lg:px-8" id="how">
        <div className="mb-10 text-center">
          <h2 className="font-display text-[34px] tracking-[-0.02em] text-ink">Three steps, one session</h2>
          <p className="mt-2 text-[14px] text-ink-lt">
            No templates. No six-month documentation project. One focused conversation.
          </p>
        </div>

        <div className="grid gap-5 lg:grid-cols-3">
          {steps.map((step, index) => (
            <div
              className="relative rounded-[20px] border border-sage/30 bg-white p-6 shadow-sm"
              key={step.num}
            >
              {index < steps.length - 1 ? (
                <div className="pointer-events-none absolute right-0 top-9 hidden h-px w-6 translate-x-full bg-gradient-to-r from-sage to-transparent lg:block" />
              ) : null}
              <div
                className={`mb-3 flex h-9 w-9 items-center justify-center rounded-[10px] font-display text-lg ${step.color}`}
              >
                {step.num}
              </div>
              <h3 className="text-[15px] font-semibold text-ink">{step.title}</h3>
              <p className="mt-2 text-[13px] leading-[1.65] text-ink-lt">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="overflow-hidden border-t border-sage/25 bg-white/40 py-4">
        <div className="flex w-max gap-2.5 animate-ticker">
          {[...businessTypes, ...businessTypes].map((type, index) => {
            const colors = [
              "bg-teal-pale border-teal/25 text-green-dk",
              "bg-wheat-lt border-wheat/40 text-amber-700",
              "bg-sage-pale border-sage/40 text-green-dk",
              "bg-cream border-cream-dk/50 text-ink-md",
              "bg-coral-pale border-coral/25 text-orange-700"
            ];

            return (
              <span
                className={`whitespace-nowrap rounded-full border px-4 py-1.5 text-[10px] font-medium uppercase tracking-[0.08em] ${colors[index % colors.length]}`}
                key={`${type}-${index}`}
              >
                {type}
              </span>
            );
          })}
        </div>
      </div>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-[24px] border border-teal/20 bg-gradient-to-br from-teal-pale/60 via-sage-pale/40 to-wheat-lt/30 px-8 py-14 text-center shadow-sm sm:px-16 sm:py-20">
          <div
            className="pointer-events-none absolute -right-10 -top-10 h-48 w-48 rounded-full blur-[50px]"
            style={{ background: "radial-gradient(circle, rgba(77,200,189,.15), transparent 70%)" }}
          />
          <div
            className="pointer-events-none absolute -bottom-8 -left-8 h-40 w-40 rounded-full blur-[44px]"
            style={{ background: "radial-gradient(circle, rgba(184,212,176,.18), transparent 70%)" }}
          />

          <div className="relative z-10">
            <SectionBadge>Free during the hackathon</SectionBadge>
            <h2 className="mt-5 font-display text-[38px] tracking-[-0.02em] text-ink">
              Ready to build your Company Brain?
            </h2>
            <p className="mx-auto mt-3 max-w-md text-[15px] leading-[1.7] text-ink-lt">
              Join 500+ Indian service businesses who built their AI-ready knowledge base in one session.
            </p>
            <Link
              href="/login?redirect=/dashboard"
              className="mt-7 inline-flex items-center gap-2 rounded-xl bg-ink px-8 py-4 text-[15px] font-medium text-white transition-all hover:-translate-y-0.5 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              🧠 Login and start building →
            </Link>
          </div>
        </div>
      </section>
    </ScreenShell>
  );
}
