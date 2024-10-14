import {
	defaultLiftNames,
	defaultWorkoutNames,
} from "@/features/settings/utils/constants"
import { auth, db } from "@/firebase/app"
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth"
import { addDoc, collection, getDocs, query, where } from "firebase/firestore"

/**
 * Opens a popup which prompts the user for their Google
 * credentials, then logs them in if they have an account
 * or creates a new account for them if not
 * @returns whether this is a new user
 */
export async function googleLogin() {
	const { user } = await signInWithPopup(auth, new GoogleAuthProvider())
	const { docs } = await getDocs(
		query(collection(db, "profile"), where("userId", "==", user.uid)),
	)
	const isNewUser = docs.length === 0
	if (isNewUser) {
		await addDoc(collection(db, "profile"), {
			liftNames: defaultLiftNames,
			photoURL: user.photoURL,
			userId: user.uid,
			userName: user.displayName,
			workoutNames: defaultWorkoutNames,
		})
	}
	return isNewUser
}
