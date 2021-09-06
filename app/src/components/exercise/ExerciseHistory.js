import React, { useState, useEffect } from 'react';
import organizeRoutine from '../../functions/organizeRoutine';
import { formatDate } from '../../functions/helpers';
import useToggle from '../../hooks/useToggle';

const ExerciseHistory = ({ workouts, toggleExerciseHistory }) => {
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
  const [displayedRows, setDisplayedRows] = useState(10);
  const getMaxColumns = () => {
    const canFit = Math.floor(window.innerWidth / 150) - 2;
    return canFit < 2 ? 1 : canFit < 5 ? canFit : 5;
  };
  const [maxColumns, setMaxColumns] = useState(
    typeof window !== 'undefined' && getMaxColumns()
  );
  const handleResize = () => {
    setMaxColumns(getMaxColumns());
    setHorizontalIndex(0);
  };
  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  });
  const [horizontalIndex, setHorizontalIndex] = useState(0);
  useEffect(() => {
    setHorizontalIndex(0);
  }, [sortByDate]);
  const [canIncrement, setCanIncrement] = useState(false);
  useEffect(() => {
    setCanIncrement(
      sortByDate
        ? horizontalIndex < workouts.length - maxColumns
        : horizontalIndex < liftArray.length - maxColumns
    );
    // eslint-disable-next-line
  }, [workouts, liftArray, horizontalIndex]);
  const increment = () =>
    canIncrement && setHorizontalIndex(horizontalIndex + 1);
  const decrement = () =>
    horizontalIndex && setHorizontalIndex(horizontalIndex - 1);
  return (
    <div className='exercise-history'>
      <div>
        <button
          className={horizontalIndex > 0 ? '' : 'opacity-0 cursor-default'}
          onClick={decrement}>
          <h3>{'<-'}</h3>
        </button>
        <h3 className='pointer mr-20 ml-20' onClick={toggleExerciseHistory}>
          Workouts
        </h3>
        <button
          className={canIncrement ? '' : 'opacity-0 cursor-default'}
          onClick={increment}>
          <h3>{'->'}</h3>
        </button>
      </div>
      {sortByDate ? (
        <div>
          {[
            {},
            ...workouts.slice(horizontalIndex, horizontalIndex + maxColumns),
          ].map(({ routine, date, id }) => (
            <div key={id || 'id'}>
              <div className='exercise-history-head'>
                {date ? <h3 onClick={toggleSort}>{formatDate(date)}</h3> : null}
              </div>
              {sortedLifts.map(({ lift }) => (
                <div className='exercise-history-item' key={lift}>
                  {id ? (
                    organizeRoutine(
                      routine.filter(exercise => exercise.lift === lift)
                    ).map(exercise => (
                      <h3 key={exercise.id}>
                        {exercise.printout.split(' ').map((printout, i) => (
                          <span key={printout + i}>{printout}</span>
                        ))}
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
          <div onClick={toggleSort}>
            {[
              {},
              ...sortedLifts.slice(
                horizontalIndex,
                horizontalIndex + maxColumns
              ),
            ].map(({ lift }) => (
              <div key={lift || 'id'}>
                <div onClick={toggleSort} className='exercise-history-head'>
                  {lift ? <h3>{lift}</h3> : null}
                </div>
                {workouts
                  .slice(0, displayedRows)
                  .map(({ routine, date, name, id }) => (
                    <div className='exercise-history-item' key={id}>
                      {lift ? (
                        organizeRoutine(
                          routine.filter(exercise => exercise.lift === lift)
                        ).map(exercise => (
                          <h3 key={exercise.id}>
                            {exercise.printout.split(' ').map((printout, i) => (
                              <span key={printout + i}>{printout}</span>
                            ))}
                          </h3>
                        ))
                      ) : (
                        <h3>{formatDate(date)}</h3>
                      )}
                    </div>
                  ))}
              </div>
            ))}
          </div>
          {workouts.length > displayedRows && (
            <div>
              <button
                className='btn-3 m-20'
                onClick={() => setDisplayedRows(displayedRows + 10)}>
                Load More
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ExerciseHistory;
