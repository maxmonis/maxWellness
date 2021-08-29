import uuid from 'uuid/v4';

const createNewExercise = exercise => {
  const id = uuid();
  const { lift } = exercise;
  const sets = getNum(exercise.sets);
  const reps = getNum(exercise.reps);
  const weight = getNum(exercise.weight);
  const printout =
    sets && reps && weight
      ? `${sets}(${reps}x${weight})`
      : reps && weight
      ? `${reps}x${weight}`
      : sets && reps
      ? `${sets}(${reps})`
      : reps
      ? `${reps}`
      : `${weight}`;
  const newExercise = {
    id,
    lift,
    sets,
    reps,
    weight,
    printout,
  };
  return newExercise;
};

function getNum(value) {
  return parseInt(value) || '';
}

export default createNewExercise;
