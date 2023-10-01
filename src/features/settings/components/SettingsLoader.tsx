/**
 * Displays a loading skeleton for the /settings route
 */
export function SettingsLoader() {
  return (
    <div className="flex min-h-screen flex-col items-center overflow-hidden">
      <div className="w-screen border-b border-slate-700">
        <div className="mx-auto flex h-16 max-w-screen-xl items-center justify-between gap-6 px-6">
          {Array.from({length: 2}).map((_, i) => (
            <span
              className="h-7 w-7 animate-pulse rounded-full bg-slate-300 dark:bg-slate-700"
              key={i}
            />
          ))}
        </div>
      </div>
      <div className="flex w-screen max-w-screen-md flex-grow justify-center divide-x divide-slate-700 border-slate-700 md:mt-6 md:max-h-[calc(100vh-124px)] md:max-w-2xl md:rounded-lg md:border">
        {Array.from({length: 2}).map((_, i) => (
          <div
            className="flex w-full flex-grow flex-col items-center overflow-hidden"
            key={i}
          >
            <div className="flex w-full border-b border-slate-700 py-4 px-4 sm:px-6">
              <span className="h-7 w-24 animate-pulse rounded bg-slate-300 dark:bg-slate-700" />
            </div>
            <div className="flex w-full flex-col justify-center overflow-hidden px-4 pt-6 sm:px-6">
              <div className="flex">
                <span className="h-9 w-full animate-pulse rounded bg-slate-300 dark:bg-slate-700" />
              </div>
              <div className="flex h-full flex-col gap-5 pt-6 pb-20">
                {Array.from({length: i === 0 ? 2 : 1}).map((_, j) => (
                  <div className="flex flex-col gap-5" key={`${i}-${j}`}>
                    {[24, 20, 20, 24].map((width, k) => (
                      <div
                        className="flex items-center justify-between"
                        key={`${i}-${j}-${k}`}
                      >
                        <span
                          className={`h-5 w-${width} animate-pulse rounded bg-slate-300 dark:bg-slate-700`}
                        />
                        <div className="flex gap-4">
                          <span className="h-5 w-5 animate-pulse rounded-full bg-slate-300 dark:bg-slate-700" />
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
