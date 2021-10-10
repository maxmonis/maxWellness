import uuid from 'uuid/v4'

const createNewExercise = exercise => {
  const id = uuid()
  const { lift } = exercise
  const weight = getNum(exercise.weight)
  const sets = getNum(exercise.sets) > 1 ? getNum(exercise.sets) : ''
  const reps =
    getNum(exercise.reps) > 1 ? getNum(exercise.reps) : sets && weight ? 1 : ''
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
  return parseInt(value) || ''
}

export default createNewExercise
