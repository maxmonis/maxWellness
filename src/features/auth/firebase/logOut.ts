import { auth } from "@/firebase/app"
import { signOut } from "firebase/auth"

/**
 * Logs the user out
 */
export function logOut() {
	return signOut(auth)
}
