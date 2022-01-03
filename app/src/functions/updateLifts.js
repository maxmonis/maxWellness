import { alphabetize } from './helpers'

const updateLifts = (newName, oldName, client, routine) => {
  const { lifts, workouts } = client
  // If a name has been replaced with an empty string and there are at least two lifts left...
  return oldName && !newName && lifts.length > 1
    ? // ...we delete the name.
      lifts.filter(lift => lift !== oldName)
    : // If we were passed a new name which is not a duplicate...
    newName && !oldName && !lifts.includes(newName)
    ? // ...we add it to the lifts.
      alphabetize([...lifts, newName])
    : // Otherwise a name has been updated.
      updateName()

  // Update the name of a lift everywhere it appears.
  function updateName() {
    return {
      lifts: alphabetize(
        lifts.map(lift => (lift === oldName ? newName : lift))
      ),
      workouts: workouts.map(workout => ({
        ...workout,
        routine: mapName(workout.routine),
      })),
      routine: mapName(routine),
    }
  }

  // Map a new (updated) lift name onto exercises with the old name.
  function mapName(exercises) {
    return exercises.map(exercise =>
      exercise.lift === oldName ? { ...exercise, lift: newName } : exercise
    )
  }
}

export default updateLifts
