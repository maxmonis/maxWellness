import React from "react"
import AddExercise from "../exercise/AddExercise"
import ExerciseApp from "../exercise/ExerciseApp"
import SaveWorkout from "./SaveWorkout"

const EditWorkout = ({
  exercise,
  workout,
  lifts,
  routine,
  records,
  handleChange,
  saveWorkout,
  updateRoutine,
  selectExercise,
  setExercise,
  workoutNames,
  updateWorkoutNames,
  isNewWorkout,
}) => {
  return (
    <>
      <AddExercise
        lifts={lifts}
        handleChange={handleChange}
        exercise={exercise}
        records={records}
        updateRoutine={updateRoutine}
        setExercise={setExercise}
        isNewWorkout={isNewWorkout}
      />
      <ExerciseApp
        routine={routine}
        updateRoutine={updateRoutine}
        selectExercise={selectExercise}
      />
      <SaveWorkout
        {...workout}
        routine={routine}
        handleChange={handleChange}
        saveWorkout={saveWorkout}
        updateRoutine={updateRoutine}
        workoutNames={workoutNames}
        updateWorkoutNames={updateWorkoutNames}
        isNewWorkout={isNewWorkout}
      />
    </>
  )
}

export default EditWorkout
