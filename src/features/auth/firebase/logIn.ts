import { auth } from "@/firebase/app"
import { signInWithEmailAndPassword } from "firebase/auth"

/**
 * Logs a user in using their email and password
 */
export function logIn(email: string, password: string) {
	return signInWithEmailAndPassword(auth, email, password)
}
