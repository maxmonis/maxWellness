import React from "react"
import Link from "next/link"
import {useRouter} from "next/router"

import {logIn} from "~/firebase/client"
import {Button, GoogleButton} from "~/shared/components/CTA"
import Page from "~/shared/components/Page"
import {extractErrorMessage} from "~/shared/utils/parsers"
import {validateAuthForm} from "~/shared/utils/validators"

/**
 * Allows existing users to log in using Google or email/password
 */
export default function LoginPage() {
  const router = useRouter()

  const [values, setValues] = React.useState({
    email: "",
    password: "",
  })
  const {email, password} = values

  const [inputErrors, setInputErrors] = React.useState<
    ReturnType<typeof validateAuthForm>
  >({})

  const [submitting, setSubmitting] = React.useState(false)
  const [authError, setAuthError] = React.useState("")

  return (
    <Page mustBeLoggedOut title="Login">
      <div className="flex flex-col items-center py-10 px-4 h-full w-full">
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
          <div className="w-full">
            <input
              className="px-3 py-2 rounded w-full"
              name="password"
              placeholder="Password"
              type="password"
              value={password}
              {...{onChange}}
            />
            {inputErrors.password && (
              <p className="text-red-500 text-sm">{inputErrors.password}</p>
            )}
          </div>
          <Button className="w-full" type="submit" variant="primary">
            Log In
          </Button>
          <GoogleButton {...{handleError, submitting, setSubmitting}} />
          <div className="flex flex-col items-start gap-2">
            <div>
              <Link
                className="hover:underline text-blue-300"
                href="/reset-password"
              >
                Forgot Password
              </Link>
            </div>
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
          </div>
        </form>
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
   * Attempts to log the user in using their email and password
   */
  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (submitting) {
      return
    }

    const inputErrors = validateAuthForm({...values, page: "login"})
    setInputErrors(inputErrors)
    if (Object.keys(inputErrors).length > 0) {
      setTimeout(() => {
        setInputErrors({})
      }, 3000)
      return
    }

    setSubmitting(true)
    try {
      await logIn(email, password)
      router.push("/")
    } catch (error) {
      handleError(error)
    } finally {
      setSubmitting(false)
    }
  }

  /**
   * Displays a login error for a set interval
   */
  function handleError(error: unknown) {
    setAuthError(extractErrorMessage(error))
    setTimeout(() => {
      setAuthError("")
    }, 3000)
  }
}
