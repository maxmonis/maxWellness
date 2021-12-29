import React, { useContext } from 'react'
import { formatDate } from '../../functions/helpers'
import { Checkbox } from './UI'
import WorkoutContext from '../../context/workout/workoutContext'

const WorkoutFilters = () => {
  const {
    workoutsFilters,
    updateWorkoutsFilter,
    clearWorkoutsFilters,
    filteredWorkouts,
  } = useContext(WorkoutContext)
  const { workoutNames, liftNames, newestFirst, workoutDates } = workoutsFilters
  const { startDate, endDate, allDates } = workoutDates
  return workoutsFilters.workoutNames.length ? (
    <>
      <h3 className='m-8'>Exercise Name</h3>
      {liftNames.map(({ name, checked }) => (
        <Checkbox
          key={name}
          label={name}
          bool={checked}
          toggle={() =>
            updateWorkoutsFilter({ type: 'liftName', clicked: name })
          }
        />
      ))}
      <h3 className='mt-24 mb-8'>Workout Name</h3>
      {workoutNames.map(({ name, checked }) => (
        <Checkbox
          key={name}
          label={name}
          bool={checked}
          toggle={() =>
            updateWorkoutsFilter({ type: 'workoutName', clicked: name })
          }
        />
      ))}
      <h3 className='mt-24 mb-8'>Workout Date</h3>
      <Checkbox
        label='Show newest first'
        bool={newestFirst}
        toggle={() => updateWorkoutsFilter({ type: 'chronology' })}
      />
      <select
        className='mt-8'
        value={startDate}
        onChange={e =>
          updateWorkoutsFilter({
            type: 'startDate',
            clicked: e.target.value,
          })
        }>
        {allDates
          .filter(date => date <= endDate)
          .map(date => (
            <option key={date} value={date}>
              {formatDate(date)}
            </option>
          ))}
      </select>
      <h5 className='m-4'>to</h5>
      <select
        value={endDate}
        onChange={e =>
          updateWorkoutsFilter({
            type: 'endDate',
            clicked: e.target.value,
          })
        }>
        {allDates
          .filter(date => date >= startDate)
          .map(date => (
            <option key={date} value={date}>
              {formatDate(date)}
            </option>
          ))}
      </select>
      <div className='mt-24 mb-48'>
        {!filteredWorkouts.length && (
          <h4 className='red mb-8'>No results for these filters</h4>
        )}
        <button className='btn-2' onClick={clearWorkoutsFilters}>
          Reset Filters
        </button>
      </div>
    </>
  ) : (
    <h4 className='mt-24 mb-24'>
      Workout filters will be displayed here. You'll be able to filter by
      workout name, workout date, or exercise name.
    </h4>
  )
}

export default WorkoutFilters
