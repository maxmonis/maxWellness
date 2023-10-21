import classNames from "classnames"

/**
 * Displays a loading skeleton for the /settings route
 */
export function SettingsLoader() {
  return (
    <div className="flex min-h-screen flex-col justify-between md:flex-row-reverse md:justify-end">
      <div className="flex w-full flex-grow justify-center md:pt-6">
        <div className="flex max-h-[calc(100dvh-56px)] w-screen flex-grow justify-center divide-x divide-slate-700 border-slate-700 md:my-10 md:max-h-[calc(100dvh-136px)] md:max-h-[calc(100dvh-80px)] md:max-w-2xl md:rounded-lg md:border">
          {Array.from({length: 2}).map((_, i) => (
            <div
              className="flex w-full flex-grow flex-col items-center overflow-hidden"
              key={i}
            >
              <div className="flex w-full flex-col justify-center overflow-hidden px-4 pt-6 md:px-6">
                <div className="flex">
                  <span className="h-9 w-full animate-pulse rounded bg-slate-300 dark:bg-slate-700" />
                </div>
                <div className="flex h-full flex-col gap-5 pb-20 pt-6">
                  {Array.from({length: i === 0 ? 2 : 1}).map((_, j) => (
                    <div className="flex flex-col gap-5" key={`${i}-${j}`}>
                      {[24, 16, 20].map((width, k) => (
                        <div
                          className="flex items-center justify-between"
                          key={`${i}-${j}-${k}`}
                        >
                          <span
                            className={classNames(
                              "h-5 animate-pulse rounded bg-slate-300 dark:bg-slate-700",
                              `w-${width}`,
                            )}
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
    </div>
  )
}
