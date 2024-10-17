import { db } from "@/firebase/app"
import { deleteDoc, doc } from "firebase/firestore"

/**
 * Deletes a workout from the database using its ID
 */
export function deleteWorkout(userId: string, workoutId: string) {
	return deleteDoc(doc(db, "users", userId, "workouts", workoutId))
}
