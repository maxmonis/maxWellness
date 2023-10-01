export function HomeLoader() {
  return (
    <div className="flex flex-col items-center overflow-hidden">
      <div className="w-screen">
        <div className="border-b border-slate-700">
          <div className="mx-auto flex h-16 max-w-screen-xl items-center justify-between gap-6 px-6">
            {Array.from({length: 4}).map((_, i) => (
              <span
                className="h-7 w-7 animate-pulse rounded-full bg-slate-300 dark:bg-slate-700"
                key={i}
              />
            ))}
          </div>
        </div>
        <div className="mx-auto flex items-center justify-between border-slate-700 py-4 px-6 max-md:border-b md:max-w-2xl">
          <span className="h-7 w-24 animate-pulse rounded bg-slate-300 dark:bg-slate-700" />
          <span className="h-5 w-28 animate-pulse rounded bg-slate-300 dark:bg-slate-700" />
        </div>
      </div>
      <div className="flex w-screen justify-center border-slate-700 md:max-w-2xl md:rounded-lg md:border">
        <div className="flex max-h-[calc(100vh-124px)] w-full flex-grow md:max-h-[calc(100vh-156px)]">
          <div className="flex w-full flex-1 flex-col">
            <div className="h-full p-6">
              {Array.from({length: 6}).map((_, i) => (
                <div
                  key={i}
                  className={`flex justify-between gap-6 border-slate-700 pb-6 ${
                    i ? "border-t-2 pt-6" : "pt-2"
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
    </div>
  )
}

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
