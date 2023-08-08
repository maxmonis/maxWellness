import React from "react"
import Image from "next/image"
import {useRouter} from "next/router"

import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {
  faMoon,
  faSignOut,
  faSun,
  faUser,
} from "@fortawesome/free-solid-svg-icons"

import {useTheme} from "next-themes"

import {googleLogin, logOut} from "~/firebase/client"

import useSession from "../hooks/useSession"
import useOutsideClick from "../hooks/useOutsideClick"
import useKeypress from "../hooks/useKeypress"

/**
 * A basic button which reflects its style variant (if any)
 */
export function Button({
  children,
  className,
  type,
  variant,
  ...props
}: React.DetailedHTMLProps<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
> & {variant?: "primary" | "secondary" | "danger"}) {
  return (
    <button
      className={`flex justify-center text-lg outline-none rounded-lg ${
        variant === "primary"
          ? "px-4 py-1 font-semibold bg-blue-500 text-white hover:bg-blue-600"
          : variant === "secondary"
          ? "px-4 py-1 font-semibold border bg-white text-blue-400 border-blue-400 hover:bg-blue-100 hover:text-blue-500 hover:border-blue-500"
          : variant === "danger"
          ? "text-red-500 hover:text-red-600"
          : "text-blue-400 hover:text-blue-500"
      } ${className}`}
      type={type ?? "button"}
      {...props}
    >
      {children}
    </button>
  )
}

/**
 * Displays a toggleable checkbox element
 */
export function Checkbox({
  checked,
  onChange,
  text,
  value,
}: {
  checked: boolean
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  text: string
  value: string
}) {
  return (
    <div className="flex gap-2 items-center">
      <input
        className="flex flex-shrink-0 cursor-pointer w-4 h-4"
        id={text}
        type="checkbox"
        {...{checked, onChange, value}}
      />
      <label className="cursor-pointer text-md leading-none" htmlFor={text}>
        {text}
      </label>
    </div>
  )
}

/**
 * Opens a modal which prompts the user for their Google
 * credentials, then logs them in (if they've created an
 * account with us) or creates a new account for them (if not)
 */
export function GoogleButton({
  handleError,
  setSubmitting,
  submitting,
}: {
  handleError: (error: unknown) => void
  setSubmitting: React.Dispatch<React.SetStateAction<typeof submitting>>
  submitting: boolean
}) {
  const router = useRouter()

  return (
    <button
      className="p-2 border rounded bg-white text-black w-full flex items-center justify-center"
      disabled={submitting}
      type="button"
      {...{onClick}}
    >
      <Image
        alt="google logo"
        className="mr-3 w-6"
        height={30}
        src={
          "https://user-images.githubusercontent.com/51540371/" +
          "209448811-2b88004b-4abd-4b68-9944-9d47b350a735.png"
        }
        width={30}
      />
      Sign in with Google
    </button>
  )

  /**
   * Attempts to log the user in using their Google credentials
   */
  async function onClick() {
    if (submitting) return
    setSubmitting(true)
    try {
      const isNewUser = await googleLogin()
      router.push(isNewUser ? "/info" : "/")
    } catch (error) {
      handleError(error)
    } finally {
      setSubmitting(false)
    }
  }
}

/**
 * This menu allows the user to toggle dark mode or log out
 */
export function UserMenu() {
  const [session] = useSession()

  const [open, setOpen] = React.useState(false)
  const ref = useOutsideClick(() => setOpen(false))
  useKeypress("Escape", () => setOpen(false))

  return (
    <div className="relative" {...{ref}}>
      {session?.profile.photoURL ? (
        <div
          className="relative h-7 w-7 rounded-full cursor-pointer"
          onClick={() => setOpen(!open)}
        >
          <Image
            alt={session.profile.userName}
            className="rounded-full"
            fill
            src={session.profile.photoURL}
          />
        </div>
      ) : (
        <FontAwesomeIcon
          aria-label="Toggle menu"
          className="cursor-pointer"
          icon={faUser}
          onClick={() => setOpen(!open)}
          size="xl"
        />
      )}
      {open && (
        <dialog className="flex flex-col items-start gap-4 border border-slate-700 absolute top-8 -left-24 p-4 rounded-lg">
          <DarkModeToggle />
          <FontAwesomeIcon
            aria-label="Sign out"
            cursor="pointer"
            icon={faSignOut}
            onClick={logOut}
            size="lg"
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
  const {theme, setTheme} = useTheme()
  const dark = theme === "dark"

  return (
    <div className="flex items-center gap-2">
      <FontAwesomeIcon icon={faSun} />
      <label className="relative inline-flex items-center cursor-pointer">
        <input
          aria-label="Toggle dark mode"
          checked={dark}
          className="sr-only peer"
          onChange={() => setTheme(dark ? "light" : "dark")}
          type="checkbox"
        />
        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600" />
      </label>
      <FontAwesomeIcon icon={faMoon} />
    </div>
  )
}
