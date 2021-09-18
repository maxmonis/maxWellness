import createNewExercise from './createNewExercise';

const UpdateRoutine = (value = [], routine) =>
  // If the value we were passed is a string...
  typeof value === 'string'
    ? // ...it's the ID of an exercise selected for deletion.
      routine.filter(exercise => exercise.id !== value)
    : // If it's got a lift property...
    value.lift
    ? // it's a new exercise we need to append to the routine.
      [...routine, createNewExercise(value)]
    : // If it's an array of strings...
    typeof value[0] === 'string'
    ? // ...those strings are the IDs of the reordered routine after a drag and drop event.
      reorderExercises(value, routine)
    : // By default we return the array we were passed.
      value;

function reorderExercises(exerciseIds, routine) {
  const updatedRoutine = [];
  for (const exerciseId of exerciseIds) {
    for (const exercise of routine) {
      if (exercise.id === exerciseId) {
        updatedRoutine.push(exercise);
        break;
      }
    }
  }
  return updatedRoutine;
}

export default UpdateRoutine;
