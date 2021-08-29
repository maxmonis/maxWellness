import { alphabetize } from '../../functions/helpers';

export default (state, action) => {
  const { type, payload } = action;
  switch (type) {
    case 'GET_WORKOUTS':
      return {
        ...state,
        workouts: payload,
        loading: false,
      };
    case 'ADD_WORKOUT':
      return {
        ...state,
        workouts: [...state.workouts, payload],
        loading: false,
      };
    case 'UPDATE_WORKOUT':
      return {
        ...state,
        workouts: state.workouts.map(workout =>
          workout._id === payload._id ? payload : workout
        ),
        loading: false,
      };
    case 'DELETE_WORKOUT':
      return {
        ...state,
        workouts: state.workouts.filter(workout => workout._id !== payload),
        loading: false,
      };
    case 'CLEAR_WORKOUTS':
      return {
        ...state,
        workouts: [],
        filteredWorkouts: [],
        error: null,
      };
    case 'SET_EDITING_WORKOUT':
      return {
        ...state,
        editingWorkout: payload,
      };
    case 'CLEAR_EDITING_WORKOUT':
      return {
        ...state,
        editingWorkout: null,
      };
    case 'CLEAR_FILTERED_WORKOUTS':
      return {
        ...state,
        filteredWorkouts: [],
      };
    case 'WORKOUT_ERROR':
      return {
        ...state,
        error: payload,
      };
    case 'SET_ALL_WORKOUTS':
      return {
        ...state,
        workoutsFilters: generateWorkoutsFilters(payload),
        allWorkouts: payload,
        filteredWorkouts: payload,
      };
    case 'UPDATE_WORKOUTS_FILTER':
      const updatedFilters = updateWorkoutsFilter(payload);
      return {
        ...state,
        workoutsFilters: updatedFilters,
        filteredWorkouts: filterWorkouts(updatedFilters),
      };
    case 'CLEAR_WORKOUTS_FILTERS':
      return {
        ...state,
        filteredWorkouts: state.allWorkouts,
        workoutsFilters: generateWorkoutsFilters(state.allWorkouts),
      };
    default:
      return state;
  }

  function generateWorkoutsFilters(workouts) {
    const workoutNames = new Set();
    const workoutDates = new Set();
    const liftNames = new Set();
    for (const { name, date, routine } of workouts) {
      workoutNames.add(name);
      workoutDates.add(date);
      for (const { lift } of routine) {
        liftNames.add(lift);
      }
    }
    const allDates = [...workoutDates];
    return {
      workoutNames: alphabetize([...workoutNames]).map(name => ({
        name,
        checked: true,
      })),
      workoutDates: {
        allDates,
        startDate: allDates[0],
        endDate: allDates[allDates.length - 1],
      },
      liftNames: alphabetize([...liftNames]).map(name => ({
        name,
        checked: true,
      })),
      newestFirst: true,
    };
  }

  function updateWorkoutsFilter({ type, clicked }) {
    switch (type) {
      case 'workoutName':
        return {
          ...state.workoutsFilters,
          workoutNames: state.workoutsFilters.workoutNames.map(workout =>
            workout.name === clicked
              ? { ...workout, checked: !workout.checked }
              : workout
          ),
        };
      case 'liftName':
        return {
          ...state.workoutsFilters,
          liftNames: state.workoutsFilters.liftNames.map(lift =>
            lift.name === clicked ? { ...lift, checked: !lift.checked } : lift
          ),
        };
      case 'startDate':
        return {
          ...state.workoutsFilters,
          workoutDates: {
            ...state.workoutsFilters.workoutDates,
            startDate: clicked,
          },
        };
      case 'endDate':
        return {
          ...state.workoutsFilters,
          workoutDates: {
            ...state.workoutsFilters.workoutDates,
            endDate: clicked,
          },
        };
      case 'chronology':
        return {
          ...state.workoutsFilters,
          newestFirst: !state.workoutsFilters.newestFirst, 
        }
      default:
        return state.workoutsFilters;
    }
  }

  function filterWorkouts(filters) {
    const updatedState = state.allWorkouts
      .filter(
        workout =>
          workout.date >= filters.workoutDates.startDate &&
          workout.date <= filters.workoutDates.endDate &&
          filters.workoutNames.find(({ name }) => name === workout.name).checked
      )
      .map(workout => ({
        ...workout,
        routine: workout.routine.filter(
          ({ lift }) =>
            filters.liftNames.find(({ name }) => name === lift).checked
        ),
      }));
    return filters.newestFirst ? updatedState : updatedState.reverse();
  }
};
