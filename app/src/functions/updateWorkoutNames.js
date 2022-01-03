import { alphabetize } from './helpers'

const updateWorkoutNames = (newName, oldName, client) => {
  const { workoutNames, workouts } = client
  // Return early if a name has been deleted but another workout has that name
  if (oldName && !newName && workouts.find(({ name }) => name === oldName))
    return null
  // If a name has been replaced with an empty string and there are at least two names left...
  return oldName && !newName && workoutNames.length > 1
    ? // ...we delete the name.
      workoutNames.filter(name => name !== oldName)
    : // If we were passed a new name which is not a duplicate...
    newName && !oldName && !workoutNames.includes(newName)
    ? // ...we add it to the names.
      alphabetize([...workoutNames, newName])
    : // Otherwise a name has been updated.
      updateName()

  // Update the name of a workout everywhere it appears.
  function updateName() {
    return {
      workoutNames: alphabetize(
        workoutNames.map(name => (name === oldName ? newName : name))
      ),
      workouts: workouts.map(workout =>
        workout.name === oldName
          ? {
              ...workout,
              name: newName,
            }
          : workout
      ),
    }
  }
}

export default updateWorkoutNames
