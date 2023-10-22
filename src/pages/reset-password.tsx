import Link from "next/link"
import React from "react"
import {resetPassword} from "~/firebase/client"
import {Button} from "~/shared/components/CTA"
import {Page} from "~/shared/components/Page"
import {extractErrorMessage} from "~/shared/functions/parsers"
import {validateAuthForm} from "~/shared/functions/validators"

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
      <div className="flex h-full w-full flex-col items-center px-4 py-10 text-left text-white">
        {emailSent ? (
          <div className="flex w-full max-w-xs flex-col items-start gap-4 rounded-md border border-slate-700 bg-black p-6">
            <h3 className="text-3xl">Email Sent</h3>
            <p>
              Please check {email} for instructions on resetting your password
            </p>
            <Link className="text-blue-300 hover:underline" href="/login">
              Return to Login
            </Link>
          </div>
        ) : (
          <form
            className="flex w-full max-w-xs flex-col items-start gap-6 rounded-md border border-slate-700 bg-black p-6"
            {...{onSubmit}}
          >
            {authError && <p className="text-md text-red-500">{authError}</p>}
            <div className="w-full">
              <input
                className="w-full rounded px-3 py-2"
                name="email"
                placeholder="Email"
                value={email}
                {...{onChange}}
              />
              {inputErrors.email && (
                <p className="text-sm text-red-500">{inputErrors.email}</p>
              )}
            </div>
            <Button className="w-full" type="submit" variant="primary">
              Reset Password
            </Button>
            <div className="center-align flex justify-center gap-4">
              <div className="flex flex-wrap gap-x-2">
                <p className="whitespace-nowrap text-white">Need an account?</p>
                <Link
                  className="text-blue-300 hover:underline"
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
