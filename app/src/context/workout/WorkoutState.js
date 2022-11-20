import React, { useReducer } from "react"
import WorkoutContext from "./workoutContext"
import workoutReducer from "./workoutReducer"
import request from "../../functions/request"

const WorkoutState = ({ children }) => {
  const INITIAL_STATE = {
    workouts: [],
    workoutsFilters: null,
    editingWorkout: null,
    allWorkouts: null,
    filteredWorkouts: [],
    records: [],
    filteredRecords: [],
    appliedFilterCount: 0,
    loading: true,
    error: null,
  }
  const [state, dispatch] = useReducer(workoutReducer, INITIAL_STATE)
  const {
    workouts,
    workoutsFilters,
    editingWorkout,
    allWorkouts,
    filteredWorkouts,
    records,
    filteredRecords,
    appliedFilterCount,
    loading,
    error,
  } = state
  const getWorkouts = async () => {
    try {
      const payload = await request("/api/workouts")
      dispatch({ type: "GET_WORKOUTS", payload })
    } catch ({ message }) {
      dispatch({ type: "WORKOUT_ERROR", payload: message })
    }
  }
  const addWorkout = async body => {
    try {
      const payload = await request("/api/workouts", { body })
      dispatch({ type: "ADD_WORKOUT", payload })
    } catch ({ message }) {
      dispatch({ type: "WORKOUT_ERROR", payload: message })
    }
  }
  const updateWorkout = async body => {
    try {
      const config = { body, method: "PUT" }
      const payload = request(`/api/workouts/${body._id}`, config)
      dispatch({ type: "UPDATE_WORKOUT", payload })
    } catch ({ message }) {
      dispatch({ type: "WORKOUT_ERROR", payload: message })
    }
  }
  const deleteWorkout = async id => {
    try {
      await request(`/api/workouts/${id}`, { method: "DELETE" })
      dispatch({ type: "DELETE_WORKOUT", payload: id })
    } catch ({ message }) {
      dispatch({ type: "WORKOUT_ERROR", payload: message })
    }
  }
  const clearWorkouts = () => {
    dispatch({ type: "CLEAR_WORKOUTS" })
  }
  const setEditingWorkout = payload => {
    dispatch({ type: "SET_EDITING_WORKOUT", payload })
  }
  const clearEditingWorkout = () => {
    dispatch({ type: "CLEAR_EDITING_WORKOUT" })
  }
  const filterWorkouts = payload => {
    dispatch({ type: "FILTER_WORKOUTS", payload })
  }
  const clearFilteredWorkouts = () => {
    dispatch({ type: "CLEAR_FILTERED_WORKOUTS" })
  }
  const setAllWorkouts = payload => {
    dispatch({ type: "SET_ALL_WORKOUTS", payload })
  }
  const updateWorkoutsFilter = payload => {
    dispatch({ type: "UPDATE_WORKOUTS_FILTER", payload })
  }
  const clearWorkoutsFilters = () => {
    dispatch({ type: "CLEAR_WORKOUTS_FILTERS" })
  }
  return (
    <WorkoutContext.Provider
      value={{
        workouts,
        workoutsFilters,
        editingWorkout,
        allWorkouts,
        filteredWorkouts,
        records,
        filteredRecords,
        appliedFilterCount,
        loading,
        error,
        getWorkouts,
        addWorkout,
        deleteWorkout,
        updateWorkout,
        clearWorkouts,
        setEditingWorkout,
        clearEditingWorkout,
        filterWorkouts,
        clearFilteredWorkouts,
        setAllWorkouts,
        updateWorkoutsFilter,
        clearWorkoutsFilters,
      }}>
      {children}
    </WorkoutContext.Provider>
  )
}

export default WorkoutState
