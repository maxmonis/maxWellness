import React, { useState } from 'react';
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
  const [horizontalIndex, setHorizontalIndex] = useState(1);
  const increment = () => setHorizontalIndex(horizontalIndex + 1);
  const decrement = () => setHorizontalIndex(horizontalIndex - 1 || 1);
  const [displayedDates, setDisplayedDates] = useState(10);
  return (
    <div className='exercise-history'>
      <div>
        <button
          className={horizontalIndex > 1 ? '' : 'opacity-0 cursor-default'}
          onClick={decrement}>
          {'<-'}
        </button>
        <h2 className='pointer' onClick={toggleSort}>
          Exercise History
        </h2>
        <button onClick={increment}>{'->'}</button>
      </div>
      {sortByDate ? (
        <div>
          {[{}, ...workouts].map(({ routine, date, id }, i) => (
            <div
              className={i && i < horizontalIndex ? 'display-none' : ''}
              key={id || 'id'}>
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
        <>
          <div>
            {[{}, ...sortedLifts].map(({ lift }, i) => (
              <div
                className={i && i < horizontalIndex ? 'display-none' : ''}
                key={lift || 'id'}>
                <div className='exercise-history-head'>
                  {lift ? <h3>{lift}</h3> : null}
                </div>
                {workouts
                  .slice(0, displayedDates)
                  .map(({ routine, date, name, id }) => (
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
          {workouts.length > displayedDates && (
            <div>
              <button className='outline m-20' onClick={() => setDisplayedDates(displayedDates + 10)}>
                More Workouts
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ExerciseHistory;
