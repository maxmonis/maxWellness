import { hasChars } from "@/utils/validators"
import { Exercise, Workout } from "./models"

function isExercise(value: unknown): value is Exercise {
	if (typeof value !== "object" || value === null) {
		return false
	}
	const exercise = value as Exercise
	return hasChars(exercise.nameId) && (exercise.reps > 0 || exercise.weight > 0)
}

function isWorkout(value: unknown): value is Workout {
	if (typeof value !== "object" || value === null) {
		return false
	}
	const workout = value as Workout
	return (
		hasChars(workout.date) &&
		hasChars(workout.nameId) &&
		Array.isArray(workout.exercises) &&
		workout.exercises.length > 0 &&
		workout.exercises.every(isExercise) &&
		hasChars(workout.id)
	)
}

export function isWorkoutList(
	workoutList: unknown,
): workoutList is Array<Workout> {
	return Array.isArray(workoutList) && workoutList.every(isWorkout)
}
