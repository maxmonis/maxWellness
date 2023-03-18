import React from "react"
import Head from "next/head"
import {useRouter} from "next/router"

import {useAuth} from "~/context/AuthContext"
import useSession from "~/hooks/useSession"
import {extractErrorMessage} from "~/utils/parsers"

export default function Page({
  children,
  component,
  error,
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
    | {loading: boolean; loadingText?: string}
    | {loading?: never; loadingText?: never}
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
  const [user] = useAuth()
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
        <main className="relative overflow-hidden text-slate-300">
          <div className="min-h-screen min-w-screen flex flex-col justify-between">
            {children ?? element ?? (
              <p className="text-lg absolute left-4 top-4">
                {loading
                  ? loadingText ?? "Loading..."
                  : error
                  ? extractErrorMessage(error)
                  : null}
              </p>
            )}
            {mustBeLoggedOut && (
              <>
                <Wallpaper />
                <footer className="flex flex-col items-center text-center w-full py-2 gap-4">
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

  function handleRedirect(route: string) {
    setRedirect(true)
    router.replace(route)
  }
}

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
      src={
        "https://user-images.githubusercontent.com/51540371/" +
        "202918612-e2daf207-d8fc-45db-827e-8b44aff1b07b.jpg"
      }
      {...{onError}}
    />
  )

  function onError() {
    setError(true)
  }
})
