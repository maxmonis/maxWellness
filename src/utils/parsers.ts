import { hasChars } from "./validators"

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
 * Attempts to extract an error message, returning a default one if necessary
 */
export function getErrorMessage(value: unknown) {
	if (value instanceof Error && hasChars(value.message)) return value.message
	if (hasChars(value)) return value
	return "An unexpected error occurred"
}

/**
 * Parses a value to an integer greater than or equal to zero
 */
export function getPositiveInt(value: string | number) {
	return Math.abs(parseInt(value + "")) || 0
}
