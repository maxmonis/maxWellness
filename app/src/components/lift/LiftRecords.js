import React, { useState, useEffect } from 'react'
import { formatDate } from '../../functions/helpers'

const LiftRecords = ({ records, lift, setExercise }) => {
  const liftRecords = records.filter(record => record.lift === lift)
  const getTitle = ({ becameRecord, surpassed }) =>
    surpassed
      ? `${formatDate(becameRecord)} - ${formatDate(surpassed)}`
      : formatDate(becameRecord)
  const [horizontalIndex, setHorizontalIndex] = useState(2)
  const increment = () =>
    horizontalIndex < liftRecords.length &&
    setHorizontalIndex(horizontalIndex + 2)
  const decrement = () => setHorizontalIndex(horizontalIndex - 2 || 2)
  useEffect(() => {
    setHorizontalIndex(2)
  }, [lift])
  return (
    <div className='lift-records'>
      {!liftRecords.length ? (
        <h4>{lift} records will be displayed here</h4>
      ) : (
        <>
          <button
            className={
              horizontalIndex > 2 ? 'mr-12' : 'mr-12 opacity-0 cursor-default'
            }
            onClick={decrement}>
            <h3>{'<-'}</h3>
          </button>
          <div>
            {liftRecords
              .slice(horizontalIndex - 2, horizontalIndex)
              .map(exercise => (
                <button
                  key={exercise.id}
                  onClick={() => setExercise(exercise)}
                  title={getTitle(exercise)}>
                  <h3 className='m-8'>{exercise.printout}</h3>
                </button>
              ))}
          </div>
          <button
            className={
              horizontalIndex < liftRecords.length
                ? 'ml-12'
                : 'ml-12 opacity-0 cursor-default'
            }
            onClick={increment}>
            <h3>{'->'}</h3>
          </button>
        </>
      )}
    </div>
  )
}

export default LiftRecords
