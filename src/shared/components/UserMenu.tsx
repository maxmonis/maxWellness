import {faMoon, faSignOut, faSun} from "@fortawesome/free-solid-svg-icons"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import classNames from "classnames"
import {useTheme} from "next-themes"
import {useRouter} from "next/router"
import React from "react"
import {logOut} from "~/firebase/client"
import {useKeypress} from "../hooks/useKeypress"
import {useOutsideClick} from "../hooks/useOutsideClick"
import {useSession} from "../hooks/useSession"
import {IconButton} from "./CTA"
import {UserImage} from "./UserImage"

/**
 * This menu allows the user to toggle dark mode or log out
 */
export function UserMenu({className = ""}) {
  const {data: session, isLoading} = useSession()
  const router = useRouter()

  const [open, setOpen] = React.useState(false)
  const ref = useOutsideClick(() => setOpen(false))
  useKeypress("Escape", () => setOpen(false))

  if (isLoading) return <></>

  if (!session)
    return (
      <div className={classNames("max-sm:pr-4", className)}>
        <DarkModeToggle />
      </div>
    )

  const {
    profile: {userName},
  } = session

  return (
    <div className={classNames("relative", className)} {...{ref}}>
      <IconButton
        className="max-sm:p-2"
        icon={<UserImage />}
        text={userName.split(" ")[0]}
        textClass="max-sm:sr-only whitespace-nowrap max-w-[15ch] truncate"
        onClick={() => setOpen(!open)}
      />
      {open && (
        <dialog className="absolute -left-28 bottom-10 z-10 flex w-min flex-col items-start gap-4 rounded-lg border border-slate-700 p-4 sm:-left-16 md:left-0">
          <DarkModeToggle />
          <p className="leading-tight">Logged in as {userName}</p>
          <UserImage editable />
          <IconButton
            icon={
              <FontAwesomeIcon
                aria-label="Sign out"
                icon={faSignOut}
                size="lg"
              />
            }
            onClick={() => {
              logOut().then(() => router.push("/login"))
            }}
            text="Logout"
          />
        </dialog>
      )}
    </div>
  )
}

/**
 * Allows the user to toggle light/dark mode
 */
function DarkModeToggle() {
  const {resolvedTheme, setTheme} = useTheme()
  const dark = resolvedTheme === "dark"

  return (
    <div className="flex items-center gap-2">
      <FontAwesomeIcon icon={faSun} />
      <label className="relative inline-flex cursor-pointer items-center">
        <input
          aria-label="Toggle dark mode"
          checked={dark}
          className="peer sr-only"
          onChange={() => setTheme(dark ? "light" : "dark")}
          type="checkbox"
        />
        <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:border-gray-600 dark:bg-gray-700 dark:peer-focus:ring-blue-800" />
      </label>
      <FontAwesomeIcon icon={faMoon} />
    </div>
  )
}
