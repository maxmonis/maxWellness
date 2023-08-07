import React from "react"
import Link from "next/link"

import {Button} from "~/shared/components/CTA"
import Page from "~/shared/components/Page"
import {extractErrorMessage} from "~/shared/utils/parsers"
import {validateAuthForm} from "~/shared/utils/validators"
import {resetPassword} from "~/firebase/client"

/**
 * Can send a password reset email to a user
 */
export default function ResetPasswordPage() {
  const [values, setValues] = React.useState({
    email: "",
  })
  const {email} = values

  const [inputErrors, setInputErrors] = React.useState<
    ReturnType<typeof validateAuthForm>
  >({})

  const [emailSent, setEmailSent] = React.useState(false)
  const [submitting, setSubmitting] = React.useState(false)
  const [authError, setAuthError] = React.useState("")

  return (
    <Page mustBeLoggedOut title="Reset Password">
      <div className="flex flex-col items-center py-10 px-4 h-full w-full text-left">
        {emailSent ? (
          <div className="flex flex-col items-start max-w-xs w-full gap-4 border rounded-md p-6 bg-black text-slate-300">
            <h3 className="text-3xl">Email Sent</h3>
            <p>
              Please check {email} for instructions on resetting your password
            </p>
            <Link className="hover:underline text-blue-300" href="/login">
              Return to Login
            </Link>
          </div>
        ) : (
          <form
            className="flex flex-col items-start max-w-xs w-full gap-6 border rounded-md p-6 bg-black text-slate-300"
            {...{onSubmit}}
          >
            {authError && <p className="text-red-500 text-md">{authError}</p>}
            <div className="w-full">
              <input
                className="px-3 py-2 rounded w-full"
                name="email"
                placeholder="Email"
                value={email}
                {...{onChange}}
              />
              {inputErrors.email && (
                <p className="text-red-500 text-sm">{inputErrors.email}</p>
              )}
            </div>
            <Button className="w-full" type="submit" variant="primary">
              Reset Password
            </Button>
            <div className="flex gap-4 center-align justify-center">
              <div className="flex flex-wrap gap-x-2">
                <p className="whitespace-nowrap">Need an account?</p>
                <Link
                  className="hover:underline text-blue-300"
                  href="/register"
                >
                  Register
                </Link>
              </div>
            </div>
          </form>
        )}
      </div>
    </Page>
  )

  /**
   * Handles changes to inputs and updates validation error accordingly
   */
  function onChange({
    target: {name, value},
  }: React.ChangeEvent<HTMLInputElement>) {
    setValues({...values, [name]: value})
    setInputErrors({})
  }

  /**
   * Attempts to send a password recovery email to the provided address
   */
  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (submitting) {
      return
    }

    const inputErrors = validateAuthForm({...values, page: "reset-password"})
    setInputErrors(inputErrors)
    if (Object.keys(inputErrors).length > 0) {
      setTimeout(() => {
        setInputErrors({})
      }, 3000)
      return
    }

    setSubmitting(true)
    try {
      await resetPassword(email)
      setEmailSent(true)
    } catch (error) {
      handleError(error)
    } finally {
      setSubmitting(false)
    }
  }

  /**
   * Displays an error for a set interval
   */
  function handleError(error: unknown) {
    setAuthError(extractErrorMessage(error))
    setTimeout(() => {
      setAuthError("")
    }, 3000)
  }
}
