const steps = [
  "Operating model",
  "Client onboarding",
  "Delivery workflow",
  "Quality and approval",
  "Tribal knowledge",
];

export function ProgressSidebar({ questionsAnswered }: { questionsAnswered: number }) {
  return (
    <aside className="hidden w-60 shrink-0 border-r border-ivory-dk bg-white/50 px-4 py-6 lg:block">
      <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.15em] text-gold-dk">
        Questions
      </p>
      <div className="space-y-2">
        {steps.map((step, index) => {
          const isDone = index < questionsAnswered;
          const isCurrent = index === questionsAnswered;

          return (
            <div
              key={step}
              className={`rounded-xl border px-3 py-2.5 text-[12px] transition-all ${
                isCurrent
                  ? "border-gold/40 bg-gold-pale text-navy font-medium"
                  : isDone
                    ? "border-ivory-dk bg-ivory text-gold-dk"
                    : "border-transparent bg-transparent text-navy-lt"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <div
                  className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-semibold ${
                    isDone
                      ? "bg-gold text-navy"
                      : isCurrent
                        ? "bg-gold/20 text-gold-dk"
                        : "bg-ivory-dk text-navy-lt"
                  }`}
                >
                  {isDone ? "✓" : index + 1}
                </div>
                <div>
                  <p className="font-medium leading-tight">{step}</p>
                  <p className="text-[10px] text-navy-lt">
                    {isDone ? "Captured" : isCurrent ? "In progress" : "Coming up"}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </aside>
  );
}
