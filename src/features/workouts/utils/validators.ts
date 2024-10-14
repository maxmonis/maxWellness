import { hasChars } from "@/utils/validators"
import { Exercise, Workout } from "./models"

function isExercise(value: unknown): value is Exercise {
	if (typeof value !== "object" || value === null) {
		return false
	}
	const exercise = value as Exercise
	return hasChars(exercise.liftId) && (exercise.reps > 0 || exercise.weight > 0)
}

function isRoutine(routine: unknown): routine is Workout["routine"] {
	return Array.isArray(routine) && routine.every(isExercise)
}

function isWorkout(value: unknown): value is Workout {
	if (typeof value !== "object" || value === null) {
		return false
	}
	const workout = value as Workout
	return (
		hasChars(workout.date) &&
		hasChars(workout.nameId) &&
		isRoutine(workout.routine) &&
		hasChars(workout.userId) &&
		hasChars(workout.id)
	)
}

export function isWorkoutList(
	workoutList: unknown,
): workoutList is Array<Workout> {
	return Array.isArray(workoutList) && workoutList.every(isWorkout)
}
