import React from 'react';
import { formatDate } from '../../functions/helpers';

const ExerciseHistory = ({ records, lift, setExercise }) => {
  const liftRecords = records.filter(record => record.lift === lift).reverse();
  const getTitle = ({ becameRecord, surpassed }) =>
    surpassed
      ? `${formatDate(becameRecord)} - ${formatDate(surpassed)}`
      : formatDate(becameRecord);
  return (
    <div className='exercise-history'>
      {!liftRecords.length ? (
        <h4>{lift} records will be displayed here</h4>
      ) : (
        <>
          {liftRecords.map(exercise => (
            <button
              key={exercise.id}
              onClick={() => setExercise(exercise)}
              title={getTitle(exercise)}>
              {exercise.printout}
            </button>
          ))}
        </>
      )}
    </div>
  );
};

export default ExerciseHistory;
