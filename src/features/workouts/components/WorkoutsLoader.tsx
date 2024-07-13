/**
 * Displays a loading skeleton for the root route
 */
export function WorkoutsLoader() {
  return (
    <div className="min-h-screen">
      <div className="mx-auto flex h-14 w-full items-end justify-between px-4 pb-3 md:px-6 md:pb-2">
        <span className="h-5 w-16 animate-pulse rounded bg-slate-300 dark:bg-slate-700 md:hidden" />
        <div className="flex gap-6 md:hidden">
          <span className="h-5 w-16 animate-pulse rounded bg-slate-300 dark:bg-slate-700" />
          <span className="h-5 w-16 animate-pulse rounded bg-slate-300 dark:bg-slate-700" />
        </div>
        <h1 className="text-xl font-bold max-md:hidden">Workouts</h1>
      </div>
      <div className="mx-auto flex h-full max-h-[calc(100dvh-7rem)] w-full justify-center border-t border-slate-700 md:max-h-[calc(100dvh-3.5rem)]">
        <div className="flex flex-1 flex-col overflow-hidden">
          <div className="h-full divide-y divide-slate-700">
            {Array.from({length: 5}).map((_, i) => (
              <div
                key={i}
                className="flex justify-between gap-6 border-slate-700 px-4 py-6 md:px-6"
              >
                <div className="flex flex-col">
                  <span className="mb-4 h-6 w-40 animate-pulse rounded bg-slate-300 dark:bg-slate-700" />
                  <span className="mb-6 h-4 w-20 animate-pulse rounded bg-slate-300 dark:bg-slate-700" />
                  <span className="h-5 w-28 animate-pulse rounded bg-slate-300 dark:bg-slate-700" />
                  <span className="my-4 h-5 w-48 animate-pulse rounded bg-slate-300 dark:bg-slate-700" />
                  <span className="h-5 w-36 animate-pulse rounded bg-slate-300 dark:bg-slate-700" />
                </div>
                <div className="flex flex-col items-center gap-y-4">
                  {Array.from({length: 1}).map((_, j) => (
                    <span
                      className="h-6 w-6 animate-pulse rounded-full bg-slate-300 dark:bg-slate-700"
                      key={`${i}-${j}`}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
