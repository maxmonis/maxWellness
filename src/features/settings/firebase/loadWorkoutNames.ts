import { isEditableName } from "@/features/settings/utils/validators"
import { db } from "@/firebase/app"
import { collection, getDocs, query } from "firebase/firestore"

/**
 * @returns the user's workout names from the database
 */
export async function loadWorkoutNames(userId: string) {
	const { docs } = await getDocs(
		query(collection(db, "users", userId, "workoutNames")),
	)
	const workoutNames = docs.map(doc => ({ ...doc.data(), id: doc.id }))
	return workoutNames.every(isEditableName) ? workoutNames : null
}
