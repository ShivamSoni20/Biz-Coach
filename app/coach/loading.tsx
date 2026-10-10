export default function CoachLoading() {
  return (
    <div className="flex min-h-screen flex-col bg-ivory">
      <div className="border-b border-ivory-dk bg-white/60 px-6 py-4">
        <div className="h-5 w-32 animate-pulse rounded-lg bg-ivory-dk" />
        <div className="mt-1 h-3 w-48 animate-pulse rounded-lg bg-ivory-dk/50" />
      </div>
      <div className="flex flex-1">
        <div className="hidden w-60 border-r border-ivory-dk p-4 lg:block">
          <div className="space-y-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-12 animate-pulse rounded-xl bg-ivory-dk/40" />
            ))}
          </div>
        </div>
        <div className="flex-1 p-5">
          <div className="flex h-[60vh] flex-col rounded-[20px] border border-ivory-dk bg-white/60 p-5">
            <div className="h-4 w-48 animate-pulse rounded-lg bg-ivory-dk" />
            <div className="mt-auto h-20 animate-pulse rounded-2xl bg-ivory-dk/40" />
          </div>
        </div>
      </div>
    </div>
  );
}
