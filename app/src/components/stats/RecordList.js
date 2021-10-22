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
          <section className='mb-20' key={id}>
            <h3 className='record' onClick={() => selectExercise(exercise)}>
              {lift}: {printout}
            </h3>
            <h4>
              {formatDate(becameRecord)}
              {surpassed && ` - ${formatDate(surpassed)}`}
            </h4>
          </section>
        )
      })}
    </div>
  ) : (
    <div className='intro-text'>
      <p>
        The dates of your personal records will be displayed here. When you set
        a new one, any previous records which it surpassed will be updated to
        reflect your progress. You can break a record by increasing the weight
        and/or reps and/or sets without decreasing any other field.{' '}
        {showExamples ? 'For example:' : null}
      </p>
      {!showExamples ? (
        <button className='btn-3 mt-12' onClick={() => setShowExamples(true)}>
          See Examples
        </button>
      ) : (
        <>
          {EXAMPLE_RECORDS.map(
            ({ lift, printout, becameRecord, surpassed }, i) => (
              <div key={i}>
                <h3>
                  {lift}: {printout}
                </h3>
                <h4 className='mb-12'>
                  {becameRecord}
                  {surpassed ? ` - ${surpassed}` : null}
                </h4>
              </div>
            )
          )}
        </>
      )}
    </div>
  )
}

export default RecordList
