import { EditableName } from "./models"
import { hasChars, hasMessage } from "./validators"

/**
 * Attempts to extract an error message, returning a default one if necessary
 */
export function extractErrorMessage(error: unknown) {
	if (hasChars(error)) {
		return error
	}
	if (hasMessage(error)) {
		return error.message
	}
	return "An unexpected error occurred"
}

/**
 * Generates a human-readable string representing the given date
 * @param date A date string in the format "yyyy-mm-ddThh:mm:ss.sssZ"
 * @returns "Weekday, Month Day, Year" if the year is different from
 * the current year, otherwise simply "Weekday, Month Day"
 */
export function getDateText(date: string) {
	const [year, month, day] = date.split("T")[0].split("-").map(Number)
	return new Date(year, month - 1, day).toLocaleDateString(undefined, {
		day: "numeric",
		month: "short",
		weekday: "short",
		...(year !== new Date().getFullYear() && { year: "2-digit" }),
	})
}

/**
 * Parses a value to an integer greater than or equal to zero
 */
export function getPositiveInt(value: string | number) {
	return Math.abs(parseInt(value + "")) || 0
}

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
