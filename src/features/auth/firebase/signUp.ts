import {
	defaultLiftNames,
	defaultWorkoutNames,
} from "@/features/settings/utils/constants"
import { auth, db } from "@/firebase/app"
import { createUserWithEmailAndPassword } from "firebase/auth"
import { addDoc, collection } from "firebase/firestore"

/**
 * Creates a new account using the provided name, email, and password
 */
export async function signUp(name: string, email: string, password: string) {
	const { user } = await createUserWithEmailAndPassword(auth, email, password)
	await addDoc(collection(db, "profile"), {
		liftNames: defaultLiftNames,
		photoURL: "",
		userId: user.uid,
		userName: name,
		workoutNames: defaultWorkoutNames,
	})
	return user
}
