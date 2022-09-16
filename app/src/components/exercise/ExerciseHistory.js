import React, { useState, useEffect } from 'react'
import organizeRoutine from '../../functions/organizeRoutine'
import { formatDate } from '../../functions/helpers'
import useToggle from '../../hooks/useToggle'

const ExerciseHistory = ({ workouts, appliedFilterCount }) => {
  const lifts = {}
  for (const { routine } of workouts) {
    for (const { lift } of routine) {
      lifts[lift] = lifts[lift] + 1 || 1
    }
  }
  const liftArray = []
  for (const lift in lifts) {
    liftArray.push({ lift, total: lifts[lift] })
  }
  const sortedLifts = liftArray.sort((a, b) => b.total - a.total)
  const [sortByDate, toggleSort] = useToggle(true)
  const [displayedRows, setDisplayedRows] = useState(10)
  const getMaxColumns = () => {
    const canFit = Math.floor(window.innerWidth / 160) - 2
    return canFit < 2 ? 1 : canFit < 4 ? canFit : 4
  }
  const [maxColumns, setMaxColumns] = useState(
    typeof window !== 'undefined' && getMaxColumns()
  )
  const handleResize = () => {
    setMaxColumns(getMaxColumns())
    setHorizontalIndex(0)
  }
  useEffect(() => {
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  })
  const [horizontalIndex, setHorizontalIndex] = useState(0)
  useEffect(() => {
    setHorizontalIndex(0)
  }, [sortByDate, appliedFilterCount])
  const [canIncrement, setCanIncrement] = useState(false)
  useEffect(() => {
    setCanIncrement(
      sortByDate
        ? horizontalIndex < workouts.length - maxColumns
        : horizontalIndex < liftArray.length - maxColumns
    )
    // eslint-disable-next-line
  }, [workouts, liftArray, horizontalIndex])
  const increment = () =>
    canIncrement && setHorizontalIndex(horizontalIndex + 1)
  const decrement = () =>
    horizontalIndex && setHorizontalIndex(horizontalIndex - 1)
  return (
    <div className='exercise-history'>
      {workouts.length > 0 && (
        <div className='mb-3'>
          <button
            className={horizontalIndex ? '' : 'opacity-0 cursor-default'}
            onClick={decrement}>
            <h3>{'<-'}</h3>
          </button>
          <h3 className='mx-5 cursor-pointer' onClick={toggleSort}>
            Exercise History
          </h3>
          <button
            className={canIncrement ? '' : 'opacity-0 cursor-default'}
            onClick={increment}>
            <h3>{'->'}</h3>
          </button>
        </div>
      )}
      {sortByDate ? (
        <div>
          {[
            {},
            ...workouts.slice(horizontalIndex, horizontalIndex + maxColumns),
          ].map(({ routine, date, id }) => (
            <div key={id || 'id'}>
              <div className='exercise-history-head'>
                {date ? <span>{formatDate(date)}</span> : null}
              </div>
              {sortedLifts.map(({ lift }) => (
                <div className='exercise-history-item' key={lift}>
                  {id ? (
                    organizeRoutine(
                      routine.filter(exercise => exercise.lift === lift)
                    ).map(exercise => (
                      <span key={exercise.id}>
                        {exercise.printout.split(' ').map((printout, i) => (
                          <span key={printout + i}>{printout}</span>
                        ))}
                      </span>
                    ))
                  ) : (
                    <span>{lift}</span>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      ) : (
        <>
          <div>
            {[
              {},
              ...sortedLifts.slice(
                horizontalIndex,
                horizontalIndex + maxColumns
              ),
            ].map(({ lift }) => (
              <div key={lift || 'id'}>
                <div className='exercise-history-head'>
                  {lift ? <span>{lift}</span> : null}
                </div>
                {workouts
                  .slice(0, displayedRows)
                  .map(({ routine, date, id }) => (
                    <div className='exercise-history-item' key={id}>
                      {lift ? (
                        organizeRoutine(
                          routine.filter(exercise => exercise.lift === lift)
                        ).map(exercise => (
                          <span key={exercise.id}>
                            {exercise.printout.split(' ').map((printout, i) => (
                              <span key={printout + i}>{printout}</span>
                            ))}
                          </span>
                        ))
                      ) : (
                        <span>{formatDate(date)}</span>
                      )}
                    </div>
                  ))}
              </div>
            ))}
          </div>
          {workouts.length > displayedRows && (
            <div>
              <button
                className='btn-3 m-5'
                onClick={() => setDisplayedRows(displayedRows + 10)}>
                Load More
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default ExerciseHistory
