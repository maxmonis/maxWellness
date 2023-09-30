import Link from "next/link"
import {useRouter} from "next/router"
import React from "react"

import {signUp} from "~/firebase/client"
import {Button, GoogleButton} from "~/shared/components/CTA"
import Page from "~/shared/components/Page"
import {extractErrorMessage} from "~/shared/utils/parsers"
import {validateAuthForm} from "~/shared/utils/validators"

/**
 * Allows new users to create an account with Google or email/password
 */
export default function Register() {
  const router = useRouter()

  const [values, setValues] = React.useState({
    email: "",
    password: "",
    password2: "",
    userName: "",
  })
  const {userName, email, password, password2} = values

  const [inputErrors, setInputErrors] = React.useState<
    ReturnType<typeof validateAuthForm>
  >({})

  const [submitting, setSubmitting] = React.useState(false)
  const [authError, setAuthError] = React.useState("")

  return (
    <Page mustBeLoggedOut title="Register">
      <div className="flex h-full w-full flex-col items-center py-10 px-4">
        <form
          className="flex w-full max-w-xs flex-col items-start gap-6 rounded-md border bg-black p-6 text-slate-300"
          {...{onSubmit}}
        >
          {authError && <p className="text-md text-red-500">{authError}</p>}
          <div className="w-full">
            <input
              className="w-full rounded px-3 py-2"
              name="userName"
              placeholder="Name"
              value={userName}
              {...{onChange}}
            />
            {inputErrors.userName && (
              <p className="text-sm text-red-500">{inputErrors.userName}</p>
            )}
          </div>
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
          <div className="w-full">
            <input
              className="w-full rounded px-3 py-2"
              name="password2"
              placeholder="Confirm Password"
              type="password"
              value={password2}
              {...{onChange}}
            />
            {inputErrors.password2 && (
              <p className="text-sm text-red-500">{inputErrors.password2}</p>
            )}
          </div>
          <Button className="w-full" type="submit" variant="primary">
            Create Account
          </Button>
          <GoogleButton {...{handleError, submitting, setSubmitting}} />
          <div className="center-align flex justify-center gap-4">
            <div className="flex flex-wrap gap-x-2">
              <p className="whitespace-nowrap">Already a member?</p>
              <Link className="text-blue-300 hover:underline" href="/login">
                Log In
              </Link>
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
   * Attempts to register a new user using their email and password
   */
  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (submitting) {
      return
    }

    const inputErrors = validateAuthForm({...values, page: "register"})
    setInputErrors(inputErrors)
    if (Object.keys(inputErrors).length > 0) {
      setTimeout(() => {
        setInputErrors({})
      }, 3000)
      return
    }

    setSubmitting(true)
    try {
      await signUp(userName, email, password)
      router.push("/info")
    } catch (error) {
      handleError(error)
    } finally {
      setSubmitting(false)
    }
  }

  /**
   * Displays a registration error for a set interval
   */
  function handleError(error: unknown) {
    setAuthError(extractErrorMessage(error))
    setTimeout(() => {
      setAuthError("")
    }, 3000)
  }
}
