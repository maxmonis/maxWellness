import Navbar from "~/shared/components/Navbar"

/**
 * Displays a loading skeleton for the root route
 */
export function WorkoutsLoader() {
  return (
    <div className="flex min-h-screen flex-col justify-between lg:flex-row-reverse lg:justify-end">
      <div className="w-full lg:flex lg:flex-col">
        <div className="mx-auto flex w-full items-center justify-between px-6 pt-6 pb-2 text-lg sm:px-6 md:max-w-2xl">
          <span className="h-5 w-16 animate-pulse rounded bg-slate-300 dark:bg-slate-700" />
          <div className="flex gap-6">
            <span className="h-5 w-16 animate-pulse rounded bg-slate-300 dark:bg-slate-700" />
            <span className="h-5 w-16 animate-pulse rounded bg-slate-300 dark:bg-slate-700" />
          </div>
        </div>
        <div className="mx-auto flex h-full max-h-[calc(100dvh-116px)] w-screen justify-center border-t border-slate-700 md:max-h-[calc(100dvh-148px)] md:max-w-2xl md:rounded-lg md:border lg:max-h-[calc(100dvh-96px)]">
          <div className="flex w-full flex-1 flex-col overflow-hidden">
            <div className="h-full p-6">
              {Array.from({length: 5}).map((_, i) => (
                <div
                  key={i}
                  className={`flex justify-between gap-6 border-slate-700 pb-6 ${
                    i ? "border-t pt-6" : "pt-2"
                  }`}
                >
                  <div className="flex flex-col">
                    <span className="mb-4 h-6 w-40 animate-pulse rounded bg-slate-300 dark:bg-slate-700" />
                    <span className="mb-6 h-4 w-20 animate-pulse rounded bg-slate-300 dark:bg-slate-700" />
                    <span className="h-5 w-28 animate-pulse rounded bg-slate-300 dark:bg-slate-700" />
                    <span className="my-4 h-5 w-48 animate-pulse rounded bg-slate-300 dark:bg-slate-700" />
                    <span className="h-5 w-36 animate-pulse rounded bg-slate-300 dark:bg-slate-700" />
                  </div>
                  <div className="flex flex-col items-center justify-evenly gap-y-4">
                    {Array.from({length: 3}).map((_, j) => (
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
      <Navbar />
    </div>
  )
}
