import {nanoid} from "nanoid"

import {Exercise} from "~/resources/models"
import {getPositiveInt} from "~/utils/parsers"

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

export function eliminateRedundancy(routine: Exercise[]) {
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

export function groupExercisesByLift(routine: Exercise[]) {
  const organizedRoutine: Exercise[][] = []
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
