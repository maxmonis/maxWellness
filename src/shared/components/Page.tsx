import Head from "next/head"
import Image from "next/image"
import {useRouter} from "next/router"
import React from "react"
import {useAuth} from "~/shared/context/AuthContext"
import {extractErrorMessage} from "~/shared/functions/parsers"
import {useSession} from "~/shared/hooks/useSession"

/**
 * Displays a page of content or its loading state,
 * also redirecting automatically if necessary when
 * a page requires the user to be logged in or out
 */
export function Page({
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  const element = props && React.createElement(component, props)

  return (
    <>
      <Head>
        <title>{`maxWellness | ${title}`}</title>
      </Head>
      {redirect ? null : (
        <div className="relative overflow-hidden">
          <div
            className={`min-w-screen flex h-screen flex-col justify-between
          ${
            mustBeLoggedOut
              ? "text-white"
              : "bg-white text-gray-900 dark:bg-black dark:text-white"
          }`}
          >
            {children ??
              element ??
              (loading && Loader ? (
                <Loader />
              ) : (
                <p className="absolute left-4 top-4 text-lg">
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
                <footer className="flex w-full flex-col items-center gap-4 py-2 text-center">
                  <a
                    href="https://maxmonis.com/"
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    © Max Monis 2019-{new Date().getFullYear()}
                  </a>
                </footer>
              </>
            )}
          </div>
        </div>
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
function Wallpaper() {
  const [error, setError] = React.useState(false)

  return error ? (
    <></>
  ) : (
    <div className="fixed top-0 left-0 -z-10">
      <div className="relative h-screen w-screen">
        <Image
          alt={
            "Barbell on the Floor by Leon Ardho from Pexels: " +
            "https://www.pexels.com/photo/barbell-on-the-floor-1552252/"
          }
          className="object-cover"
          fill
          onError={() => setError(true)}
          src={
            "https://user-images.githubusercontent.com/51540371/" +
            "202918612-e2daf207-d8fc-45db-827e-8b44aff1b07b.jpg"
          }
        />
      </div>
    </div>
  )
}
