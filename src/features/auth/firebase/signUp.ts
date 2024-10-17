import { createDefaultSettings } from "@/features/settings/firebase/createDefaultSettings"
import { auth } from "@/firebase/app"
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth"

/**
 * Creates a new account using the provided name, email, and password
 */
export async function signUp(name: string, email: string, password: string) {
	const { user } = await createUserWithEmailAndPassword(auth, email, password)
	await updateProfile(user, { displayName: name })
	await createDefaultSettings(user.uid)
	return { ...user, displayName: name }
}
