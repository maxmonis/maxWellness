import uuid from "uuid/v4"

const createNewExercise = exercise => {
  const id = uuid()
  const { lift } = exercise
  const num_sets = getNum(exercise.sets)
  const num_reps = getNum(exercise.reps)
  const weight = getNum(exercise.weight)
  const sets = num_sets > 1 ? num_sets : ""
  const reps = num_reps > 1 ? num_reps : sets && weight ? 1 : ""
  const printout =
    sets && reps && weight
      ? `${sets}(${reps}x${weight})`
      : reps && weight
      ? `${reps}x${weight}`
      : sets && reps
      ? `${sets}(${reps})`
      : reps
      ? `${reps}`
      : `${weight}`
  const newExercise = {
    id,
    lift,
    sets,
    reps,
    weight,
    printout,
  }
  return newExercise
}

function getNum(value) {
  return parseInt(value) || ""
}

export default createNewExercise
