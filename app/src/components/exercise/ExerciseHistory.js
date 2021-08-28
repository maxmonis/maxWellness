import React from 'react';
import organizeRoutine from '../../functions/organizeRoutine';
import { formatDate } from '../../functions/helpers';

const ExerciseHistory = ({ workouts }) => {
  const lifts = {};
  for (const { routine } of workouts) {
    for (const { lift } of routine) {
      lifts[lift] = lifts[lift] + 1 || 1;
    }
  }
  const liftArray = [];
  for (const lift in lifts) {
    liftArray.push({ lift, total: lifts[lift] });
  }
  const sortedLifts = liftArray.sort((a, b) => b.total - a.total);
  return (
    <div className='workout-table'>
      <h2>Exercise History</h2>
      <div>
        {[{}, ...workouts].map(({ routine, date, id }) => (
          <div key={id || 'id'}>
            <div className='workout-table-head'>
              {date ? <h3>{formatDate(date)}</h3> : null}
            </div>
            {sortedLifts.map(({ lift }) => (
              <div className='workout-table-item' key={lift}>
                {id ? (
                  organizeRoutine(
                    routine.filter(exercise => exercise.lift === lift)
                  ).map(exercise => (
                    <h3 key={exercise.id} title={lift}>
                      {exercise.printout}
                    </h3>
                  ))
                ) : (
                  <h3>{lift}</h3>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExerciseHistory;
