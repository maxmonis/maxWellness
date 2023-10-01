import {
  faMoon,
  faSignOut,
  faSun,
  faUser,
} from "@fortawesome/free-solid-svg-icons"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {useTheme} from "next-themes"
import Image from "next/image"
import Link from "next/link"
import {useRouter} from "next/router"
import React from "react"
import {googleLogin, logOut} from "~/firebase/client"
import {useKeypress} from "../hooks/useKeypress"
import {useOutsideClick} from "../hooks/useOutsideClick"
import {useSession} from "../hooks/useSession"

/**
 * A basic button which reflects its style variant (if any)
 */
export function Button({
  children,
  className,
  type,
  variant,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "danger"
}) {
  return (
    <button
      className={`flex justify-center rounded-lg text-lg outline-none focus:ring-2   ${
        variant === "primary"
          ? "bg-blue-800 px-4 py-1 font-semibold text-white hover:bg-blue-700"
          : variant === "secondary"
          ? "border border-blue-700 bg-white px-4 py-1 font-semibold text-blue-700 hover:border-blue-800 hover:bg-blue-50 hover:text-blue-800 dark:bg-blue-50 dark:hover:border-blue-600 dark:hover:bg-white dark:hover:text-blue-600"
          : variant === "danger"
          ? "text-red-800 hover:text-red-700 dark:text-red-500 dark:hover:text-red-400"
          : "text-blue-700 hover:text-blue-600 dark:text-blue-500 dark:hover:text-blue-400"
      } ${className}`}
      type={type ?? "button"}
      {...props}
    >
      {children}
    </button>
  )
}

export function IconButton({
  className,
  href,
  textClass,
  icon,
  side = "right",
  text,
  type,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  href?: `/${string}`
  icon: JSX.Element
} & (
    | {textClass?: string; text: string; side?: "left" | "right"}
    | {textClass?: never; text?: never; side?: never}
  )) {
  const classes = `flex gap-2 items-center cursor-pointer ${className ?? ""}`
  const content = (
    <>
      {text && side === "left" && <span className={textClass}>{text}</span>}
      {icon}
      {text && side === "right" && <span className={textClass}>{text}</span>}
    </>
  )

  if (href) {
    return (
      <Link {...{href}}>
        <button
          className={classes}
          tabIndex={-1}
          type={type ?? "button"}
          {...props}
        >
          {content}
        </button>
      </Link>
    )
  }

  return (
    <button className={classes} type={type ?? "button"} {...props}>
      {content}
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
    <div className="flex items-center gap-2">
      <input
        className="flex h-4 w-4 flex-shrink-0 cursor-pointer"
        id={text}
        type="checkbox"
        {...{checked, onChange, value}}
      />
      <label className="text-md cursor-pointer leading-none" htmlFor={text}>
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
      className="flex w-full items-center justify-center rounded border bg-white p-2 text-black"
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
      Continue with Google
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
  const {data: session} = useSession()

  const [open, setOpen] = React.useState(false)
  const ref = useOutsideClick(() => setOpen(false))
  useKeypress("Escape", () => setOpen(false))

  return (
    <div className="relative" {...{ref}}>
      {session?.profile.photoURL ? (
        <IconButton
          aria-label="Toggle menu"
          className="relative h-7 w-7 rounded-full"
          icon={
            <Image
              alt={session.profile.userName}
              className="rounded-full"
              fill
              src={session.profile.photoURL}
            />
          }
          onClick={() => setOpen(!open)}
        />
      ) : (
        <IconButton
          aria-label="Toggle menu"
          icon={<FontAwesomeIcon icon={faUser} size="xl" />}
          onClick={() => setOpen(!open)}
        />
      )}
      {open && (
        <dialog className="absolute top-8 -left-24 flex flex-col items-start gap-4 rounded-lg border border-slate-700 p-4">
          <DarkModeToggle />
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
