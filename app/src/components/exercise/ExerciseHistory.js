import React from 'react';
import Button from '@material-ui/core/Button';

const ExerciseHistory = ({ workouts, lift, setExercise }) => {
  const exercises = [];
  for (let i = workouts.length - 1; i >= 0; i--) {
    for (const exercise of workouts[i].routine) {
      if (
        exercise.lift === lift &&
        !exercises.some((item) => item.printout === exercise.printout)
      )
        exercises.push(exercise);
    }
  }
  return (
    <div className='exercise-history'>
      {!exercises.length ? (
        <h4>{lift} history will be displayed here</h4>
      ) : (
        <div>
          {exercises.map((exercise) => (
            <Button
              style={{ textTransform: 'lowercase' }}
              key={exercise.id}
              color='primary'
              onClick={() => setExercise(exercise)}
            >
              {exercise.printout}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ExerciseHistory;
