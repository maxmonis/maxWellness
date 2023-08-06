import React from "react"
import {useRouter} from "next/router"

import {googleLogin} from "~/firebase/client"

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
        className="flex flex-shrink-0 cursor-pointer w-4 h-4 text-slate-700 rounded-xl focus:ring-slate-700 focus:ring-2 bg-slate-700 border-slate-600"
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
      <img
        alt="google logo"
        className="mr-3 w-6"
        src={
          "https://user-images.githubusercontent.com/51540371/" +
          "209448811-2b88004b-4abd-4b68-9944-9d47b350a735.png"
        }
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
