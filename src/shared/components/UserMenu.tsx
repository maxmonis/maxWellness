import {
  faMoon,
  faSignOut,
  faSun,
  faUser,
} from "@fortawesome/free-solid-svg-icons"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import classNames from "classnames"
import {useTheme} from "next-themes"
import Image from "next/image"
import {useRouter} from "next/router"
import React from "react"
import {logOut} from "~/firebase/client"
import {useAuth} from "../context/AuthContext"
import {useKeypress} from "../hooks/useKeypress"
import {useOutsideClick} from "../hooks/useOutsideClick"
import {useSession} from "../hooks/useSession"
import {IconButton} from "./CTA"

/**
 * This menu allows the user to toggle dark mode or log out
 */
export function UserMenu({className = "", showName = false}) {
  const user = useAuth()
  const {data: session} = useSession()
  const router = useRouter()

  const [open, setOpen] = React.useState(false)
  const ref = useOutsideClick(() => setOpen(false))
  useKeypress("Escape", () => setOpen(false))

  return (
    <div className={classNames("relative", className)} {...{ref}}>
      <IconButton
        icon={
          session?.profile.photoURL ? (
            <div className="relative h-6 w-6">
              <Image
                alt={`${session.profile.userName} profile photo`}
                className="rounded-full"
                fill
                priority
                src={session.profile.photoURL}
              />
            </div>
          ) : (
            <FontAwesomeIcon icon={faUser} size="lg" />
          )
        }
        text={showName ? session?.profile.userName ?? "Profile" : "Profile"}
        textClass="max-sm:sr-only"
        onClick={() => setOpen(!open)}
      />
      {open && (
        <dialog className="absolute z-10 flex flex-col items-start gap-4 rounded-lg border border-slate-700 p-4 max-md:-left-24 max-md:bottom-8 md:left-8 md:top-8">
          <DarkModeToggle />
          {user && (
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
          )}
        </dialog>
      )}
    </div>
  )
}

/**
 * Allows the user to toggle light/dark mode
 */
function DarkModeToggle() {
  const {theme, setTheme} = useTheme()
  const dark = theme === "dark"

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
