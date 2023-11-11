import {nanoid} from "nanoid"
import {getPositiveInt} from "~/shared/functions/parsers"
import {Exercise} from "~/shared/utils/models"
import {validViews} from "./workoutsConstants"
import {View} from "./workoutsModels"

/**
 * @returns a new exercise if possible, or null if not
 */
export function createNewExercise(exerciseData: {
  liftId: string
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
    liftId: exerciseData.liftId,
    sets: sets > 1 ? sets : 1,
    reps: reps > 1 ? reps : 1,
    weight,
  }

  return newExercise
}

/**
 * @returns the routine but updated to remove any consecutive
 * instances of the same number of reps with the same weight,
 * for example: `2(8x50), 3(8x50) -> 5(8x50)`
 */
export function eliminateRedundancy(routine: Array<Exercise>) {
  const updatedRoutine: typeof routine = []
  for (const exercise of routine) {
    const previousExercise = updatedRoutine.at(-1)
    if (
      previousExercise &&
      exercise.liftId === previousExercise.liftId &&
      exercise.reps === previousExercise.reps &&
      exercise.weight === previousExercise.weight
    ) {
      const updatedExercise = createNewExercise({
        ...exercise,
        sets: exercise.sets + previousExercise.sets,
      })
      if (updatedExercise) updatedRoutine.pop()
      updatedRoutine.push(updatedExercise ?? exercise)
    } else {
      updatedRoutine.push(exercise)
    }
  }
  return updatedRoutine
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
 * consecutive exercises in the routine with the same lift ID
 */
export function groupExercisesByLift(routine: Array<Exercise>) {
  const organizedRoutine: Array<Array<Exercise>> = []
  for (const exercise of routine) {
    const previous = organizedRoutine.at(-1)
    if (previous && previous[0].liftId === exercise.liftId) {
      previous.push(exercise)
    } else {
      organizedRoutine.push([exercise])
    }
  }
  return organizedRoutine
}

export function isValidView(view: unknown): view is View {
  return validViews.includes(view as View)
}
