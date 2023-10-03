import {
  faGear,
  faHome,
  faMoon,
  faQuestionCircle,
  faSignOut,
  faSun,
  faUser,
} from "@fortawesome/free-solid-svg-icons"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {useTheme} from "next-themes"
import Image from "next/image"
import React from "react"
import {logOut} from "~/firebase/client"
import {useAuth} from "../context/AuthContext"
import {useKeypress} from "../hooks/useKeypress"
import {useOutsideClick} from "../hooks/useOutsideClick"
import {useSession} from "../hooks/useSession"
import {IconButton} from "./CTA"

export default function Navbar() {
  return (
    <div className="flex items-center border-slate-700 bg-gray-100 dark:bg-gray-900 max-lg:h-14 max-lg:w-screen">
      <div className="mx-auto flex w-full max-w-2xl items-center justify-between gap-6 px-4 sm:px-6 lg:h-full lg:w-48 lg:flex-col lg:items-start lg:justify-start lg:gap-10 lg:py-12">
        <IconButton
          href="/"
          icon={
            <Image
              alt="Logo"
              className="rounded-md border"
              src="/android-chrome-192x192.png"
              height={24}
              width={24}
            />
          }
          text="maxWellness"
          textClass="max-sm:sr-only"
        />
        <IconButton
          href="/"
          icon={<FontAwesomeIcon icon={faHome} size="lg" />}
          text="Home"
          textClass="max-sm:sr-only"
        />
        <IconButton
          href="/settings"
          icon={<FontAwesomeIcon icon={faGear} size="lg" />}
          text="Settings"
          textClass="max-sm:sr-only"
        />
        <IconButton
          href="/info"
          icon={<FontAwesomeIcon icon={faQuestionCircle} size="lg" />}
          text="Info"
          textClass="max-sm:sr-only"
        />
        <UserMenu />
      </div>
    </div>
  )
}

/**
 * This menu allows the user to toggle dark mode or log out
 */
function UserMenu() {
  const user = useAuth()
  const {data: session} = useSession()

  const [open, setOpen] = React.useState(false)
  const ref = useOutsideClick(() => setOpen(false))
  useKeypress("Escape", () => setOpen(false))

  return (
    <div className="relative" {...{ref}}>
      {session?.profile.photoURL ? (
        <IconButton
          aria-label="Toggle menu"
          icon={
            <div className="relative h-6 w-6">
              <Image
                alt={session.profile.userName}
                className="rounded-full"
                fill
                src={session.profile.photoURL}
              />
            </div>
          }
          text="Profile"
          textClass="max-sm:sr-only"
          onClick={() => setOpen(!open)}
        />
      ) : (
        <IconButton
          aria-label="Toggle menu"
          icon={<FontAwesomeIcon icon={faUser} size="lg" />}
          onClick={() => setOpen(!open)}
          text="Profile"
          textClass="max-sm:sr-only"
        />
      )}
      {open && (
        <dialog className="absolute z-10 flex flex-col items-start gap-4 rounded-lg border border-slate-700 p-4 max-lg:bottom-8 max-lg:-left-24 lg:left-8 lg:top-8">
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
              onClick={logOut}
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
        <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:top-[2px] after:left-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:border-gray-600 dark:bg-gray-700 dark:peer-focus:ring-blue-800" />
      </label>
      <FontAwesomeIcon icon={faMoon} />
    </div>
  )
}
