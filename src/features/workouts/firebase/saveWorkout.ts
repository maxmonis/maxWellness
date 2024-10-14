import { db } from "@/firebase/app"
import { addDoc, collection } from "firebase/firestore"
import { omit } from "lodash"
import { Workout } from "../utils/models"

/**
 * Saves a new workout to the database
 */
export function saveWorkout({ date, ...workout }: Omit<Workout, "id">) {
	const [year, month, day] = date.split("T")[0]!.split("-").map(Number)

	if (!year || !month || !day) {
		throw Error("Invalid date")
	}

	return addDoc(collection(db, "workouts"), {
		...workout,
		date: new Date(year, month - 1, day).toISOString(),
		routine: workout.routine.map(exercise =>
			omit(exercise, ["recordStartDate", "recordEndDate"]),
		),
	})
}
