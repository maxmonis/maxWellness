import { loadWorkouts } from "@/features/workouts/firebase/loadWorkouts"
import { EditableName } from "../utils/models"
import { loadExerciseNames } from "./loadExerciseNames"
import { loadWorkoutNames } from "./loadWorkoutNames"

/**
 * Saves the user's updated profile to the database,
 * ensuring that no name is deleted if currently in use
 */
export async function updateSettings(
	userId: string,
	{
		exerciseNames,
		workoutNames,
	}: {
		exerciseNames: Array<EditableName>
		workoutNames: Array<EditableName>
	},
) {
	const [workouts, originalWorkoutNames, originalExerciseNames] =
		await Promise.all([
			loadWorkouts(userId),
			loadWorkoutNames(userId),
			loadExerciseNames(userId),
		])
	if (!workouts || !originalWorkoutNames || !originalExerciseNames) return

	const updatedExerciseNames = [...exerciseNames]
	const updatedWorkoutNames = [...workoutNames]

	for (const exerciseNameId of Array.from(
		new Set(
			workouts.flatMap(({ exercises }) =>
				exercises.map(({ nameId }) => nameId),
			),
		),
	)) {
		if (!updatedExerciseNames.some(({ id }) => id === exerciseNameId)) {
			const exerciseName = originalExerciseNames.find(
				({ id }) => id === exerciseNameId,
			)
			if (
				exerciseName &&
				!updatedExerciseNames.some(({ text }) => text === exerciseName.text)
			) {
				updatedExerciseNames.push(exerciseName)
			}
		}
	}

	for (const workoutNameId of Array.from(
		new Set(workouts.map(({ nameId }) => nameId)),
	)) {
		if (!updatedWorkoutNames.some(({ id }) => id === workoutNameId)) {
			const workoutName = originalWorkoutNames.find(
				({ id }) => id === workoutNameId,
			)
			if (
				workoutName &&
				!updatedWorkoutNames.some(({ text }) => text === workoutName.text)
			) {
				updatedWorkoutNames.push(workoutName)
			}
		}
	}

	console.log({ updatedExerciseNames, updatedWorkoutNames })
}
