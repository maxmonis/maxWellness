import classNames from "classnames"

/**
 * Displays a loading skeleton for the root route
 */
export function WorkoutsLoader() {
  return (
    <div className="min-h-screen">
      <div className="mx-auto flex h-14 w-full items-end justify-between px-4 pb-3 sm:px-6 sm:pb-2">
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
                className="flex justify-between gap-6 border-slate-700 p-4 pb-6 sm:p-6"
              >
                <div className="flex flex-col">
                  <span
                    className={classNames(
                      "mb-3 h-5 animate-pulse rounded bg-slate-300 dark:bg-slate-700",
                      i % 2 ? "w-32" : "w-24",
                    )}
                  />
                  <span className="mb-4 h-3 w-20 animate-pulse rounded bg-slate-300 dark:bg-slate-700 sm:mb-5" />
                  <span className="mb-2 h-4 w-28 animate-pulse rounded bg-slate-300 dark:bg-slate-700 sm:mb-3" />
                  {i % 2 === 0 && (
                    <span className="mb-2 h-4 w-16 animate-pulse rounded bg-slate-300 dark:bg-slate-700 sm:mb-3" />
                  )}
                  <span className="h-4 w-36 animate-pulse rounded bg-slate-300 dark:bg-slate-700" />
                </div>
                <div className="flex flex-col items-center gap-y-4">
                  <span className="h-3 w-7 animate-pulse rounded-full bg-slate-300 dark:bg-slate-700" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
