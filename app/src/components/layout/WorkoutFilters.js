import React, { useContext } from "react"
import { formatDate } from "../../functions/helpers"
import { Checkbox } from "./UI"
import WorkoutContext from "../../context/workout/workoutContext"

const WorkoutFilters = () => {
  const {
    workoutsFilters,
    updateWorkoutsFilter,
    clearWorkoutsFilters,
    filteredWorkouts,
    appliedFilterCount,
  } = useContext(WorkoutContext)
  const EMPTY_STATE = (
    <div className="mb-6 text-left">
      Workout filters will be displayed here. You'll be able to filter by
      workout name, workout date, or exercise name.
    </div>
  )
  if (!workoutsFilters?.workoutNames?.length) {
    return EMPTY_STATE
  }
  const { workoutNames, liftNames, newestFirst, workoutDates } = workoutsFilters
  const { startDate, endDate, allDates } = workoutDates
  return (
    <>
      <h3 className="mb-6">Exercise Name</h3>
      {liftNames.map(({ name, checked }) => (
        <Checkbox
          key={name}
          label={name}
          bool={checked}
          toggle={() =>
            updateWorkoutsFilter({ type: "liftName", clicked: name })
          }
        />
      ))}
      <h3 className="mt-9 mb-6">Workout Name</h3>
      {workoutNames.map(({ name, checked }) => (
        <Checkbox
          key={name}
          label={name}
          bool={checked}
          toggle={() =>
            updateWorkoutsFilter({ type: "workoutName", clicked: name })
          }
        />
      ))}
      <h3 className="mt-9 mb-6">Workout Date</h3>
      <Checkbox
        label="Show newest first"
        bool={newestFirst}
        toggle={() => updateWorkoutsFilter({ type: "chronology" })}
      />
      <select
        className="mt-2"
        value={startDate}
        onChange={e =>
          updateWorkoutsFilter({
            type: "startDate",
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
      <h5 className="m-1">to</h5>
      <select
        value={endDate}
        onChange={e =>
          updateWorkoutsFilter({
            type: "endDate",
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
      <div className="my-6">
        {!filteredWorkouts.length && (
          <h4 className="red mb-2">No results for these filters</h4>
        )}
        {appliedFilterCount > 0 && (
          <button className="btn-2" onClick={clearWorkoutsFilters}>
            Clear Filters
          </button>
        )}
      </div>
    </>
  )
}

export default WorkoutFilters
