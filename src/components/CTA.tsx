import { Checkbox as CheckboxPrimitive } from "@/components/ui/checkbox"
import { useAuth } from "@/context/AuthContext"
import { googleLogin } from "@/firebase/app"
import { ArrowLeftIcon } from "@radix-ui/react-icons"
import Image from "next/image"
import { useRouter } from "next/router"
import React from "react"
import { Button } from "./ui/button"

/**
 * Displays a toggleable checkbox element
 */
export function Checkbox({
	checked,
	label,
	onCheckedChange,
	subtext,
}: {
	checked: boolean
	label: string
	onCheckedChange: Parameters<typeof CheckboxPrimitive>[0]["onCheckedChange"]
	subtext?: string
}) {
	return (
		<div className="items-top flex space-x-2">
			<CheckboxPrimitive id={label} {...{ checked, onCheckedChange }} />
			<div className="grid gap-1.5 leading-none">
				<label
					className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
					htmlFor={label}
				>
					{label}
				</label>
				{subtext && <p className="text-sm text-muted-foreground">{subtext}</p>}
			</div>
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
			className="flex w-full items-center justify-center rounded border bg-white p-2 text-gray-900"
			disabled={submitting}
			onClick={async () => {
				if (submitting) {
					return
				}
				setSubmitting(true)
				try {
					const isNewUser = await googleLogin()
					router.push(isNewUser ? "/about" : "/")
				} catch (error) {
					handleError(error)
				} finally {
					setSubmitting(false)
				}
			}}
			type="button"
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
}

/**
 * Takes the user back to the previous page if one exists,
 * and otherwise to the home page if they're logged in or
 * to the register page if they're not
 */
export function BackButton() {
	const user = useAuth()
	const router = useRouter()

	return (
		<Button
			aria-label="go back"
			className="mr-2 h-min rounded-full p-1"
			onClick={() => {
				if (history.length > 1) {
					router.back()
				} else {
					router.replace(user ? "/" : "/register")
				}
			}}
			variant="ghost"
		>
			<ArrowLeftIcon className="h-5 w-5" />
		</Button>
	)
}
