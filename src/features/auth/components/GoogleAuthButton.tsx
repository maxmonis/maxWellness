import { Button } from "@/components/ui/button"
import Image from "next/image"
import { googleLogin } from "../firebase/googleLogin"

/**
 * Opens a modal which prompts the user for their Google
 * credentials, then logs them in (if they've created an
 * account with us) or creates a new account for them (if not)
 */
export function GoogleAuthButton({
	handleError,
	setSubmitting,
	submitting,
}: {
	handleError: (error: unknown) => void
	setSubmitting: React.Dispatch<React.SetStateAction<boolean>>
	submitting: boolean
}) {
	return (
		<Button {...{ onClick }}>
			<Image
				alt="google logo"
				className="mr-2"
				height={28}
				src="/google-logo.png"
				width={28}
			/>
			Continue with Google
		</Button>
	)

	async function onClick() {
		if (submitting) return
		setSubmitting(true)

		try {
			await googleLogin()
		} catch (error) {
			handleError(error)
		} finally {
			setSubmitting(false)
		}
	}
}
