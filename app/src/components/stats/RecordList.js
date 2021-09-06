import React from 'react';
import { formatDate, getDate } from '../../functions/helpers';

const RecordList = ({ records, selectExercise, recordsIndex }) => {
  return records.length ? (
    <div>
      {records.slice(recordsIndex, recordsIndex + 5).map(exercise => {
        const { id, lift, printout, becameRecord, surpassed } = exercise;
        return (
          <section className='mb-20' key={id}>
            <h3 className='record' onClick={() => selectExercise(exercise)}>
              {lift}: {printout}
            </h3>
            <h4>
              {formatDate(becameRecord)}
              {surpassed && ` - ${formatDate(surpassed)}`}
            </h4>
          </section>
        );
      })}
    </div>
  ) : (
    <div className='intro-text'>
      <p>
        The dates of your personal records will be displayed here. When you set
        a new one, any previous records which it surpassed will be updated to
        reflect your progress:
      </p>
      <h3>Bench Press: 3(12x135)</h3>
      <h4 className='mb-12'>{getDate()}</h4>
      <h3>Bench Press: 3(10x135)</h3>
      <h4 className='mb-12'>
        {getDate(-4)}-{getDate()}
      </h4>
      <p>
        You can break a record by increasing the weight and/or reps and/or sets
        without decreasing any other field.
      </p>
      <p>
        Personal records will also be displayed in the New Workout widget to
        help you plan your routines.
      </p>
    </div>
  );
};

export default RecordList;
