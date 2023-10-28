import {hasChars, hasMessage} from "~/shared/functions/validators"
import {EditableName} from "../utils/models"

/**
 * Attempts to extract an error message, returning a default one if necessary
 */
export function extractErrorMessage(error: unknown) {
  if (hasChars(error)) return error
  if (hasMessage(error)) return error.message
  return "An unexpected error occurred"
}

const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
]
export function getDateText(date: string) {
  const [year, month, day] = date.split("T")[0].split("-").map(Number)
  const weekday = days[new Date(year, month - 1, day).getDay()]
  return (
    `${weekday}, ${months[month - 1]} ${day}` +
    (year === new Date().getFullYear() ? "" : `, '${year.toString().slice(2)}`)
  )
}

export function getPositiveInt(value: string | number) {
  return Math.abs(parseInt(value + "")) || 0
}

/**
 * Gets the lift name which corresponds to an ID
 */
export function getLiftNameText(liftId: string, liftNames: EditableName[]) {
  return liftNames.find(({id}) => id === liftId)?.text ?? ""
}

/**
 * Gets the workout name which corresponds to an ID
 */
export function getWorkoutNameText(
  workoutId: string,
  workoutNames: EditableName[],
) {
  return workoutNames.find(({id}) => id === workoutId)?.text ?? ""
}
