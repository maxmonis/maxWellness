import { db } from "@/firebase/app"
import { collection, getDocs, orderBy, query, where } from "firebase/firestore"
import { isWorkoutList } from "../utils/validators"

/**
 * @returns the user's workouts from the database
 */
export async function loadWorkouts(userId: string) {
	const { docs } = await getDocs(
		query(
			collection(db, "workouts"),
			where("userId", "==", userId),
			orderBy("date", "desc"),
		),
	)
	const workouts = docs.map(doc => ({ ...doc.data(), id: doc.id }))
	if (!isWorkoutList(workouts)) {
		return null
	}
	return workouts
}
