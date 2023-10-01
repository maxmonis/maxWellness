import Link from "next/link"
import {useRouter} from "next/router"
import React from "react"
import {logIn} from "~/firebase/client"
import {Button, GoogleButton} from "~/shared/components/CTA"
import {Page} from "~/shared/components/Page"
import {extractErrorMessage} from "~/shared/functions/parsers"
import {validateAuthForm} from "~/shared/functions/validators"

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
      <div className="flex h-full w-full flex-col items-center py-10 px-4">
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
          <div className="w-full">
            <input
              className="w-full rounded px-3 py-2"
              name="password"
              placeholder="Password"
              type="password"
              value={password}
              {...{onChange}}
            />
            {inputErrors.password && (
              <p className="text-sm text-red-500">{inputErrors.password}</p>
            )}
          </div>
          <Button className="w-full" type="submit" variant="primary">
            Log In
          </Button>
          <GoogleButton {...{handleError, submitting, setSubmitting}} />
          <div className="flex flex-col items-start gap-2">
            <div>
              <Link
                className="text-blue-300 hover:underline"
                href="/reset-password"
              >
                Forgot Password
              </Link>
            </div>
            <div className="center-align flex justify-center gap-4">
              <div className="flex flex-wrap gap-x-2">
                <p className="whitespace-nowrap">Need an account?</p>
                <Link
                  className="text-blue-300 hover:underline"
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
