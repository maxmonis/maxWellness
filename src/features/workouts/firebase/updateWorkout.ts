import { db } from "@/firebase/app"
import { doc, updateDoc } from "firebase/firestore"
import { omit } from "lodash"
import { Workout } from "../utils/models"

/**
 * Updates an existing workout in the database
 */
export function updateWorkout({ date, id, ...workout }: Workout) {
	const [year, month, day] = date.split("T")[0]!.split("-").map(Number)

	if (!year || !month || !day) {
		throw Error("Invalid date")
	}

	return updateDoc(doc(db, "workouts", id), {
		...workout,
		date: new Date(year, month - 1, day).toISOString(),
		routine: workout.routine.map(exercise =>
			omit(exercise, ["recordStartDate", "recordEndDate"]),
		),
	})
}
