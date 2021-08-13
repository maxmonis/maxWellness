import React from 'react';
import AddExercise from '../exercise/AddExercise';
import ExerciseApp from '../exercise/ExerciseApp';
import SaveWorkout from './SaveWorkout';

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
  allowLiftEditing
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
        allowLiftEditing={allowLiftEditing}
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
      />
    </>
  );
};

export default EditWorkout;
