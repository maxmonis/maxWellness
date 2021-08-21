import React from 'react';
import organizeRoutine from '../../functions/organizeRoutine';
import { formatDate } from '../../functions/helpers';

const WorkoutTable = ({ workouts }) => {
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
        {[{}, ...sortedLifts].map(({ lift }) => (
          <div key={lift || 'Date'}>
            <h3 className='workout-table-head'>{lift || 'Date'}</h3>
            {workouts.map(({ routine, date, name, id }) => (
              <div className='workout-table-item' key={id}>
                {lift ? (
                  organizeRoutine(routine)
                    .filter(exercise => exercise.lift === lift)
                    .map(exercise => (
                      <h3 key={exercise.id} title={lift}>
                        {exercise.printout}
                      </h3>
                    ))
                ) : (
                  <h3 className='workout-table-date' title={name}>{formatDate(date)}</h3>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default WorkoutTable;
