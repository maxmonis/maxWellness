import { createDefaultSettings } from "@/features/settings/firebase/createDefaultSettings"
import { loadExerciseNames } from "@/features/settings/firebase/loadExerciseNames"
import { loadWorkoutNames } from "@/features/settings/firebase/loadWorkoutNames"
import { auth } from "@/firebase/app"
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth"

/**
 * Opens a popup which prompts the user for their Google
 * credentials, then logs them in if they have an account
 * or creates a new account for them if not
 * @returns whether this is a new user
 */
export async function googleLogin() {
	const { user } = await signInWithPopup(auth, new GoogleAuthProvider())
	const [exerciseNames, workoutNames] = await Promise.all([
		loadExerciseNames(user.uid),
		loadWorkoutNames(user.uid),
	])
	const isNewUser =
		!Boolean(exerciseNames?.length) && !Boolean(workoutNames?.length)
	if (isNewUser) await createDefaultSettings(user.uid)
	return isNewUser
}
