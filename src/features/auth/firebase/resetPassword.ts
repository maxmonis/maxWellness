import { auth } from "@/firebase/app"
import { sendPasswordResetEmail } from "firebase/auth"

/**
 * Sends an email to the user allowing them to reset their password
 */
export function resetPassword(email: string) {
	return sendPasswordResetEmail(auth, email)
}
