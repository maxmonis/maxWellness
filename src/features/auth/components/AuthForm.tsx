import { Form } from "@/components/Form"
import { Input } from "@/components/Input"
import { PageWithBackdrop } from "@/components/PageWithBackdrop"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/context/AuthContext"
import { logIn, resetPassword, signUp } from "@/firebase/app"
import { extractErrorMessage } from "@/utils/parsers"
import { hasChars } from "@/utils/validators"
import { useRouter } from "next/router"
import * as React from "react"
import {
	buttonText,
	fieldKeys,
	fieldLabels,
	fieldTypes,
	pageTitles,
} from "../utils/constants"
import { AuthRoute } from "../utils/models"
import { AuthFormFooter } from "./AuthFormFooter"
import { EmailSentConfirmation } from "./EmailSentConfirmation"
import { GoogleAuthButton } from "./GoogleAuthButton"

export function AuthForm({ route }: { route: AuthRoute }) {
	const fields = fieldKeys[route]
	const state: Partial<Record<(typeof fields)[number], string>> = {}
	for (const field of fields) state[field] = ""

	const router = useRouter()

	const [values, setValues] = React.useState(state)
	const { email, password, password2, userName } = values
	const [errors, setErrors] = React.useState(state)
	const [error, setError] = React.useState("")
	const [submitting, setSubmitting] = React.useState(false)
	const [emailSent, setEmailSent] = React.useState(false)
	const [redirect, setRedirect] = React.useState(false)

	const user = useAuth()
	React.useEffect(() => {
		if (user) {
			setRedirect(true)
			router.replace("/")
		}
	}, [router, user])

	if (redirect) return <></>

	if (emailSent) return <EmailSentConfirmation email={email!} />

	return (
		<PageWithBackdrop title={pageTitles[route]}>
			<Form className="mt-2 grid gap-2" {...{ onSubmit }}>
				{error && (
					<div className="rounded-lg bg-destructive px-4 py-2 text-sm text-slate-50">
						{error}
					</div>
				)}
				{fields.map((field, i) => (
					<Input
						autoFocus={i === 0}
						clearErrors={() => {
							setErrors(state)
						}}
						disabled={submitting}
						error={errors[field]}
						key={field}
						id={field}
						label={fieldLabels[field]}
						maxLength={50}
						name={field}
						onChange={e => {
							setValues({ ...values, [field]: e.target.value })
						}}
						type={fieldTypes[field]}
						value={values[field]}
					/>
				))}
				<div className="mt-2 grid gap-4">
					<Button disabled={Boolean(error)} loading={submitting} type="submit">
						{buttonText[route]}
					</Button>
					{route !== "password" && (
						<GoogleAuthButton {...{ handleError, setSubmitting, submitting }} />
					)}
				</div>
			</Form>
			<AuthFormFooter {...{ route }} />
		</PageWithBackdrop>
	)

	async function onSubmit() {
		if (error || submitting) return

		const errors: typeof state = {}

		if ("userName" in state)
			if (!hasChars(userName)) errors.userName = "Username is required"

		if ("email" in state)
			if (!hasChars(email)) errors.email = "Email is required"
			else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
				errors.email = "Invalid email"

		if ("password" in state)
			if (!hasChars(password)) errors.password = "Password is required"
			else if (/\s/.test(password))
				errors.password = "Password cannot include spaces"
			else if (!hasChars(password, 6))
				errors.password = "Minimum password length is 6"

		if ("password2" in state)
			if (!hasChars(password2))
				errors.password2 = "Password confirmation is required"
			else if (password2 !== password) errors.password2 = "Passwords must match"

		if (Object.keys(errors).length) {
			setErrors(errors)
			return
		}

		setSubmitting(true)
		try {
			if (route === "password") {
				await resetPassword(email!)
				setEmailSent(true)
			} else if (route === "login") await logIn(email!, password!)
			else await signUp(userName!, email!, password!)
		} catch (error) {
			handleError(error)
		}
	}

	function handleError(error: unknown) {
		setError(extractErrorMessage(error))
		setTimeout(() => {
			setError("")
		}, 3000)
	}
}
