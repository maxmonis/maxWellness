import { EditableName } from "./models"

/**
 * Gets the lift name text which corresponds to an ID
 */
export function getExerciseNameText(
	nameId: string,
	exerciseNames: Array<EditableName>,
) {
	return exerciseNames.find(({ id }) => id === nameId)?.text ?? ""
}

/**
 * Gets the workout name text which corresponds to an ID
 */
export function getWorkoutNameText(
	workoutId: string,
	workoutNames: Array<EditableName>,
) {
	return workoutNames.find(({ id }) => id === workoutId)?.text ?? ""
}
