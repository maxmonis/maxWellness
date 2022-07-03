import React, { useState } from 'react'
import { formatDate, getDate } from '../../functions/helpers'

const RecordList = ({ records, selectExercise, recordsIndex }) => {
  const [showExamples, setShowExamples] = useState(false)
  const EXAMPLE_RECORDS = [
    {
      becameRecord: getDate(),
      lift: 'Bench Press',
      printout: '3(12x135)',
    },
    {
      becameRecord: getDate(-2),
      lift: 'Deadlift',
      printout: '3(10x235)',
    },
    {
      becameRecord: getDate(-4),
      lift: 'Bench Press',
      printout: '3(10x135)',
      surpassed: getDate(),
    },
    {
      becameRecord: getDate(-4),
      lift: 'Deadlift',
      printout: '3(10x225)',
      surpassed: getDate(-2),
    },
  ]
  return records.length ? (
    <div>
      {records.slice(recordsIndex, recordsIndex + 5).map(exercise => {
        const { id, lift, printout, becameRecord, surpassed } = exercise
        return (
          <section className='mb-5' key={id}>
            <h4 className='record' onClick={() => selectExercise(exercise)}>
              {lift}: {printout}
            </h4>
            <span>
              {formatDate(becameRecord)}
              {surpassed && ` - ${formatDate(surpassed)}`}
            </span>
          </section>
        )
      })}
    </div>
  ) : (
    <div className='intro-text'>
      <p>
        Personal records will be displayed here. When you set a new one, any
        previous records which it surpassed will be updated to reflect your
        progress. You can break a record by increasing the weight and/or reps
        and/or sets without decreasing any other field.{' '}
        {showExamples ? 'For example:' : ''}
      </p>
      {!showExamples ? (
        <button className='btn-3 mt-6' onClick={() => setShowExamples(true)}>
          See Examples
        </button>
      ) : (
        <>
          {EXAMPLE_RECORDS.map(
            ({ lift, printout, becameRecord, surpassed }, i) => (
              <div key={i}>
                <h4>
                  {lift}: {printout}
                </h4>
                <span className='mb-3'>
                  {becameRecord}
                  {surpassed ? ` - ${surpassed}` : null}
                </span>
              </div>
            )
          )}
        </>
      )}
    </div>
  )
}

export default RecordList
