import uuid from 'uuid/v4';
import updateRecords from './updateRecords';
import { chronologize } from './helpers';

const updateWorkouts = (value, workouts) =>
  saveWorkouts(
    // If the value we were passed is a string...
    typeof value === 'string'
      ? // ...it's the ID of a workout selected for deletion.
        workouts.filter(workout => workout.id !== value)
      : // If it has the same ID as one of the workouts...
      value.id && workouts.some(workout => workout.id === value.id)
      ? // ...it's an updated version of that workout.
        chronologize(
          workouts.map(workout => (workout.id === value.id ? value : workout))
        )
      : // By default we append the new workout we were passed to the array.
        chronologize([
          ...workouts,
          {
            ...value,
            id: uuid(),
          },
        ])
  );

function saveWorkouts(pendingWorkouts, workouts = [], records = []) {
  // If no more pending workouts remain...
  if (!pendingWorkouts.length) {
    // ...return an Object with the updated workouts and records.
    return { workouts, records };
  }
  // Otherwise remove the first pending workout...
  const workout = pendingWorkouts.shift();
  // ...and update the personal records...
  const updated = updateRecords(workout, records);
  // ...before calling this same method again with the updated workouts and records.
  return saveWorkouts(
    pendingWorkouts,
    [...workouts, updated.workout],
    updated.records
  );
}

export default updateWorkouts;
