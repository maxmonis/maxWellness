import { EditableName } from "./models"

/**
 * Gets the lift name text which corresponds to an ID
 */
export function getLiftNameText(
	liftId: string,
	liftNames: Array<EditableName>,
) {
	return liftNames.find(({ id }) => id === liftId)?.text ?? ""
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
