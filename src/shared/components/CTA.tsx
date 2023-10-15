import classNames from "classnames"
import Image from "next/image"
import Link from "next/link"
import {useRouter} from "next/router"
import React from "react"
import {googleLogin} from "~/firebase/client"

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
      className={classNames(
        "flex justify-center rounded-lg text-lg font-bold outline-none focus:ring-2",
        variant === "primary"
          ? "bg-blue-800 px-4 py-1 font-semibold text-white enabled:hover:bg-blue-700 disabled:bg-neutral-500"
          : variant === "secondary"
          ? "border border-blue-700 bg-white px-4 py-1 font-semibold text-blue-700 hover:border-blue-800 hover:bg-blue-50 hover:text-blue-800 dark:bg-blue-50 dark:hover:border-blue-600 dark:hover:bg-white dark:hover:text-blue-600"
          : variant === "danger"
          ? "text-red-800 hover:text-red-700 dark:text-red-500 dark:hover:text-red-400"
          : "text-blue-700 hover:text-blue-600 dark:text-blue-500 dark:hover:text-blue-400",
        className,
      )}
      type={type ?? "button"}
      {...props}
    >
      {children}
    </button>
  )
}

export function IconButton({
  className,
  color,
  href,
  textClass,
  icon,
  side = "right",
  text,
  type,
  ...props
}: Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "color"> & {
  color?: "blue"
  href?: `/${string}`
  icon: JSX.Element
} & (
    | {textClass?: string; text: string; side?: "left" | "right"}
    | {textClass?: never; text?: never; side?: never}
  )) {
  const classes = classNames(
    "flex gap-2 items-center cursor-pointer text-lg font-bold",
    color === "blue"
      ? "text-blue-600 dark:text-blue-400"
      : "text-gray-700 dark:text-gray-200",
    className,
  )
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
