import { alphabetize } from "../../functions/helpers"

export default (state, action) => {
  const { type, payload } = action
  switch (type) {
    case "GET_WORKOUTS":
      return {
        ...state,
        workouts: payload,
        loading: false,
      }
    case "ADD_WORKOUT":
      return {
        ...state,
        workouts: [...state.workouts, payload],
        loading: false,
      }
    case "UPDATE_WORKOUT":
      return {
        ...state,
        workouts: state.workouts.map(workout =>
          workout._id === payload._id ? payload : workout,
        ),
        loading: false,
      }
    case "DELETE_WORKOUT":
      return {
        ...state,
        workouts: state.workouts.filter(workout => workout._id !== payload),
        loading: false,
      }
    case "CLEAR_WORKOUTS":
      return {
        ...state,
        workouts: [],
        filteredWorkouts: [],
        error: null,
      }
    case "SET_EDITING_WORKOUT":
      return {
        ...state,
        editingWorkout: payload,
      }
    case "CLEAR_EDITING_WORKOUT":
      return {
        ...state,
        editingWorkout: null,
      }
    case "CLEAR_FILTERED_WORKOUTS":
      return {
        ...state,
        filteredWorkouts: [],
      }
    case "WORKOUT_ERROR":
      return {
        ...state,
        error: payload,
      }
    case "SET_ALL_WORKOUTS":
      const records = getRecords(payload)
      return {
        ...state,
        workoutsFilters: generateWorkoutsFilters(payload),
        allWorkouts: payload,
        filteredWorkouts: [...payload].reverse(),
        records,
        filteredRecords: records,
        appliedFilterCount: 0,
      }
    case "UPDATE_WORKOUTS_FILTER":
      const updatedFilters = updateWorkoutsFilter(payload)
      const filteredWorkouts = filterWorkouts(updatedFilters)
      return {
        ...state,
        workoutsFilters: updatedFilters,
        filteredWorkouts,
        filteredRecords: [...getRecords(filteredWorkouts)].reverse(),
        appliedFilterCount: getFilterCount(updatedFilters),
      }
    case "CLEAR_WORKOUTS_FILTERS":
      return {
        ...state,
        filteredWorkouts: [...state.allWorkouts].reverse(),
        filteredRecords: state.records,
        workoutsFilters: generateWorkoutsFilters(state.allWorkouts),
        appliedFilterCount: 0,
      }
    default:
      return state
  }

  function generateWorkoutsFilters(workouts) {
    const workoutNames = new Set()
    const workoutDates = new Set()
    const liftNames = new Set()
    for (const { name, date, routine } of workouts) {
      workoutNames.add(name)
      workoutDates.add(date)
      for (const { lift } of routine) {
        liftNames.add(lift)
      }
    }
    const allDates = [...workoutDates]
    return {
      workoutNames: alphabetize([...workoutNames]).map(name => ({
        name,
        checked: false,
      })),
      workoutDates: {
        allDates,
        startDate: allDates[0],
        endDate: allDates[allDates.length - 1],
      },
      liftNames: alphabetize([...liftNames]).map(name => ({
        name,
        checked: false,
      })),
      newestFirst: true,
    }
  }

  function updateWorkoutsFilter({ type, clicked }) {
    const { workoutsFilters } = state
    const { workoutNames, workoutDates, liftNames, newestFirst } =
      workoutsFilters
    switch (type) {
      case "workoutName":
        return {
          ...workoutsFilters,
          workoutNames: workoutNames.map(workout =>
            workout.name === clicked
              ? { ...workout, checked: !workout.checked }
              : workout,
          ),
        }
      case "liftName":
        return {
          ...workoutsFilters,
          liftNames: liftNames.map(lift =>
            lift.name === clicked ? { ...lift, checked: !lift.checked } : lift,
          ),
        }
      case "startDate":
        return {
          ...workoutsFilters,
          workoutDates: {
            ...workoutDates,
            startDate: clicked,
          },
        }
      case "endDate":
        return {
          ...workoutsFilters,
          workoutDates: {
            ...workoutDates,
            endDate: clicked,
          },
        }
      case "chronology":
        return {
          ...workoutsFilters,
          newestFirst: !newestFirst,
        }
      default:
        return workoutsFilters
    }
  }

  function filterWorkouts({
    workoutDates,
    workoutNames,
    liftNames,
    newestFirst,
  }) {
    const workoutFilterApplied = workoutNames.some(({ checked }) => checked)
    const liftFilterApplied = liftNames.some(({ checked }) => checked)
    const filteredWorkouts = state.allWorkouts
      .map(workout =>
        // If the workout is between the selected start and end dates...
        workout.date >= workoutDates.startDate &&
        workout.date <= workoutDates.endDate &&
        // ...and no workout name filter has been selected...
        (!workoutFilterApplied ||
          // ...or this workout's name is among the selected names...
          workoutNames.find(({ name }) => name === workout.name).checked)
          ? // ...we filter its routine to only include the selected lifts
            // (or all lifts of no lift name filter has been selected).
            {
              ...workout,
              routine: !liftFilterApplied
                ? workout.routine
                : workout.routine.filter(
                    ({ lift }) =>
                      liftNames.find(({ name }) => name === lift).checked,
                  ),
            }
          : // Otherwise we map this workout to null to filter it out.
            null,
      )
      // Then we filter out any workouts whose routines are now empty...
      .filter(workout => workout?.routine?.length)
    // ...and factor the user's chronology preference into our return value.
    return newestFirst ? filteredWorkouts.reverse() : filteredWorkouts
  }

  function getRecords(workouts) {
    const records = []
    for (const { routine } of workouts) {
      for (const exercise of routine) {
        if (exercise.becameRecord) records.unshift(exercise)
      }
    }
    return records
  }

  function getFilterCount(filters) {
    let count = 0
    if (!filters?.workoutDates?.allDates?.length) return count
    const { liftNames, workoutNames, workoutDates } = filters
    const { allDates, startDate, endDate } = workoutDates
    if (startDate !== allDates[0]) count++
    if (endDate !== allDates[allDates.length - 1]) count++
    for (const { checked } of [...liftNames, ...workoutNames]) {
      if (checked) count++
    }
    return count
  }
}
