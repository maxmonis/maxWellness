import { getPositiveInt } from "@/utils/parsers"
import { nanoid } from "nanoid"
import { validViews } from "./constants"
import { Exercise, View } from "./models"

/**
 * @returns a new exercise if possible, or null if not
 */
export function createNewExercise(exerciseData: {
	nameId: string
	reps: string | number
	sets: string | number
	weight: string | number
}) {
	const sets = getPositiveInt(exerciseData.sets)
	const reps = getPositiveInt(exerciseData.reps)
	const weight = getPositiveInt(exerciseData.weight)

	if (!reps && !weight) {
		return null
	}

	const newExercise: Exercise = {
		id: nanoid(),
		nameId: exerciseData.nameId,
		sets: sets > 1 ? sets : 1,
		reps: reps > 1 ? reps : 1,
		weight,
	}

	return newExercise
}

/**
 * @returns the exercises but updated to remove any consecutive
 * instances of the same number of reps with the same weight,
 * for example: `2(8x50), 3(8x50) -> 5(8x50)`
 */
export function eliminateRedundancy(exercises: Array<Exercise>) {
	const updatedExercises: typeof exercises = []
	for (const exercise of exercises) {
		const previousExercise = updatedExercises.at(-1)
		if (
			previousExercise &&
			exercise.nameId === previousExercise.nameId &&
			exercise.reps === previousExercise.reps &&
			exercise.weight === previousExercise.weight
		) {
			const updatedExercise = createNewExercise({
				...exercise,
				sets: exercise.sets + previousExercise.sets,
			})
			if (updatedExercise) {
				updatedExercises.pop()
			}
			updatedExercises.push(updatedExercise ?? exercise)
		} else {
			updatedExercises.push(exercise)
		}
	}
	return updatedExercises
}

/**
 * @returns text which reflects the lift, sets, and reps
 * of an exercise, along with asterisks indicating whether
 * it was a personal record and whether that record stands
 */
export function getPrintout({
	recordEndDate,
	recordStartDate,
	reps,
	sets,
	weight,
}: Exercise) {
	let printout = ""
	if (sets > 1 && reps && weight) {
		printout = `${sets}(${reps}x${weight})`
	} else if (sets > 1 && reps) {
		printout = `${sets}(${reps})`
	} else if (reps && weight) {
		printout = `${reps}x${weight}`
	} else if (weight) {
		printout = `1x${weight}`
	} else {
		printout = `${reps}`
	}
	return (
		printout +
		(recordStartDate && !recordEndDate ? "**" : recordStartDate ? "*" : "")
	)
}

/**
 * @returns an array of lists where each list is comprised of
 * consecutive exercises in the exercises with the same lift ID
 */
export function groupExercisesByLift(exercises: Array<Exercise>) {
	const organizedExercises: Array<Array<Exercise>> = []
	for (const exercise of exercises) {
		const previous = organizedExercises.at(-1)
		if (previous?.[0]?.nameId === exercise.nameId) {
			previous.push(exercise)
		} else {
			organizedExercises.push([exercise])
		}
	}
	return organizedExercises
}

export function isValidView(view: unknown): view is View {
	return validViews.includes(view as View)
}
