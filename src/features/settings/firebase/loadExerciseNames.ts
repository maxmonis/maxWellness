import { isEditableName } from "@/features/settings/utils/validators"
import { db } from "@/firebase/app"
import { collection, getDocs, query } from "firebase/firestore"

/**
 * @returns the user's exercise names from the database
 */
export async function loadExerciseNames(userId: string) {
	const { docs } = await getDocs(
		query(collection(db, "users", userId, "exerciseNames")),
	)
	const exerciseNames = docs.map(doc => ({ ...doc.data(), id: doc.id }))
	return exerciseNames.every(isEditableName) ? exerciseNames : null
}
