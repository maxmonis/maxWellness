import React, { useState } from 'react'
import { getDate } from '../../functions/helpers'
import WorkoutListItem from './WorkoutListItem'

const WorkoutList = ({
  workouts,
  updateWorkouts,
  editWorkout,
  updateRoutine,
  workoutsIndex,
}) => {
  const [menuID, setMenuID] = useState(null)
  const [showExamples, setShowExamples] = useState(false)
  const toggleMenu = id => (id === menuID ? setMenuID(null) : setMenuID(id))
  const EXAMPLE_WORKOUTS = [
    {
      date: getDate(),
      bench: '3(12x135)*',
      deadlift: '3(10x235)',
    },
    {
      date: getDate(-2),
      bench: '3(10x135)',
      deadlift: '3(10x235)*',
    },
    {
      date: getDate(-4),
      bench: '3(10x135)*',
      deadlift: '3(10x225)*',
    },
  ]
  return (
    <>
      {workouts.length ? (
        <>
          <div>
            {workouts
              .slice(workoutsIndex, workoutsIndex + 3)
              .map((workout, i) => (
                <WorkoutListItem
                  key={i}
                  workout={workout}
                  selected={workouts}
                  menuID={menuID}
                  toggleMenu={toggleMenu}
                  editWorkout={editWorkout}
                  updateWorkouts={updateWorkouts}
                  updateRoutine={updateRoutine}
                />
              ))}
          </div>
        </>
      ) : (
        <div className='intro-text'>
          <p>
            Workouts will be displayed here. We recommend giving them names
            which describe the focus of that routine (eg. full body, chest and
            back, legs, etc.) since you'll then be able to filter your workouts
            by name. New personal records will be flagged with an asterisk.{' '}
            {showExamples ? 'For example:' : ''}
          </p>
          {showExamples ? (
            <>
              {EXAMPLE_WORKOUTS.map(({ date, bench, deadlift }, i) => (
                <div key={i}>
                  <h4>Chest and Back - {date}</h4>
                  <ul>
                    <li>Bench Press: {bench}</li>
                    <li>Deadlift: {deadlift}</li>
                  </ul>
                </div>
              ))}
            </>
          ) : (
            <button
              className='btn-3 mt-24'
              onClick={() => setShowExamples(true)}>
              See Examples
            </button>
          )}
        </div>
      )}
    </>
  )
}

export default WorkoutList
