import React from "react"
import Head from "next/head"
import {useRouter} from "next/router"

import {useAuth} from "~/shared/context/AuthContext"
import useSession from "~/shared/hooks/useSession"
import {extractErrorMessage} from "~/shared/utils/parsers"

/**
 * Displays a page of content or its loading state,
 * also redirecting automatically if necessary when
 * a page requires the user to be logged in or out
 */
export default function Page({
  children,
  component,
  error,
  Loader,
  loading,
  loadingText,
  mustBeLoggedIn,
  mustBeLoggedOut,
  props,
  title = "Fitness First",
}: {
  error?: unknown
  title?: string
} & (
  | {
      mustBeLoggedIn?: true
      mustBeLoggedOut?: never
    }
  | {
      mustBeLoggedIn?: never
      mustBeLoggedOut?: true
    }
) &
  (
    | {Loader?: never; loading: boolean; loadingText?: string}
    | {Loader?: React.ElementType; loading: boolean; loadingText?: never}
    | {Loader?: never; loading?: never; loadingText?: never}
  ) &
  (
    | {
        children: JSX.Element
        component?: never
        props?: never
      }
    | {
        children?: never
        component: React.ElementType
        props?: object
      }
    | {
        children?: never
        component?: never
        props?: never
      }
  )) {
  const user = useAuth()
  const router = useRouter()
  useSession()

  const [redirect, setRedirect] = React.useState(false)

  React.useEffect(() => {
    if (user && mustBeLoggedOut) {
      handleRedirect("/")
    } else if (!user && mustBeLoggedIn) {
      handleRedirect("/login")
    }
  }, [user])

  const element = props && React.createElement(component, props)

  return (
    <>
      <Head>
        <title>{`maxWellness | ${title}`}</title>
      </Head>
      {redirect ? null : (
        <main className="relative overflow-hidden">
          <div
            className={`min-h-screen min-w-screen flex flex-col justify-between
          ${
            mustBeLoggedOut
              ? ""
              : "bg-slate-50 dark:bg-black text-slate-700 dark:text-slate-300"
          }`}
          >
            {children ??
              element ??
              (loading && Loader ? (
                <Loader />
              ) : (
                <p className="text-lg absolute left-4 top-4">
                  {loading
                    ? loadingText ?? "Loading..."
                    : error
                    ? extractErrorMessage(error)
                    : null}
                </p>
              ))}
            {mustBeLoggedOut && (
              <>
                <Wallpaper />
                <footer className="flex flex-col items-center text-center w-full py-2 gap-4 text-slate-300">
                  <a
                    href="https://github.com/maxmonis/"
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    © Max Monis 2019-{new Date().getFullYear()}
                  </a>
                </footer>
              </>
            )}
          </div>
        </main>
      )}
    </>
  )

  /**
   * Redirects to the route it receives
   */
  function handleRedirect(route: `/${string}`) {
    setRedirect(true)
    router.replace(route)
  }
}

/**
 * Memoized background image for select pages
 */
const Wallpaper = React.memo(function Wallpaper() {
  const [error, setError] = React.useState(false)

  return error ? (
    <></>
  ) : (
    <img
      alt={
        "Barbell on the Floor by Leon Ardho from Pexels: " +
        "https://www.pexels.com/photo/barbell-on-the-floor-1552252/"
      }
      className="h-screen w-screen fixed object-cover z-[-1] top-0 left-0"
      onError={() => setError(true)}
      src={
        "https://user-images.githubusercontent.com/51540371/" +
        "202918612-e2daf207-d8fc-45db-827e-8b44aff1b07b.jpg"
      }
    />
  )
})
