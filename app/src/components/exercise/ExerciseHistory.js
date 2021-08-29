import React from 'react';
import organizeRoutine from '../../functions/organizeRoutine';
import { formatDate } from '../../functions/helpers';
import useToggle from '../../hooks/useToggle';

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
  const [sortByDate, toggleSort] = useToggle(true);
  return (
    <div className='exercise-history'>
      <div>
        <h2 className='pointer' onClick={toggleSort}>
          Exercise History
        </h2>
      </div>
      {sortByDate ? (
        <div>
          {[{}, ...workouts].map(({ routine, date, id }) => (
            <div key={id || 'id'}>
              <div className='exercise-history-head'>
                {date ? <h3>{formatDate(date)}</h3> : null}
              </div>
              {sortedLifts.map(({ lift }) => (
                <div className='exercise-history-item' key={lift}>
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
      ) : (
        <div>
          {[{}, ...sortedLifts].map(({ lift }) => (
            <div key={lift || 'id'}>
              <div className='exercise-history-head'>
                {lift ? <h3>{lift}</h3> : null}
              </div>
              {workouts.map(({ routine, date, name, id }) => (
                <div className='exercise-history-item' key={id}>
                  {lift ? (
                    organizeRoutine(
                      routine.filter(exercise => exercise.lift === lift)
                    ).map(exercise => (
                      <h3 key={exercise.id} title={lift}>
                        {exercise.printout}
                      </h3>
                    ))
                  ) : (
                    <h3 title={name}>{formatDate(date)}</h3>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ExerciseHistory;
