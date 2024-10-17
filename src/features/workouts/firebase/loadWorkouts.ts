import { db } from "@/firebase/app"
import { collection, getDocs, query } from "firebase/firestore"
import { isWorkoutList } from "../utils/validators"

/**
 * @returns the user's workouts from the database
 */
export async function loadWorkouts(userId: string) {
	const { docs } = await getDocs(
		query(collection(db, "users", userId, "workouts")),
	)
	const workouts = docs.map(doc => ({ ...doc.data(), id: doc.id }))
	return isWorkoutList(workouts) ? workouts : null
}
