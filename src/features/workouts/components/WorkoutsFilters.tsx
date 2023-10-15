import sortBy from "lodash/sortBy"
import React from "react"
import {Checkbox} from "~/shared/components/CTA"
import {useAlerts} from "~/shared/context/AlertContext"
import {getLiftName, getWorkoutName} from "~/shared/functions/parsers"
import {Session} from "~/shared/utils/models"

export function WorkoutsFilters({
  appliedFilters,
  clearFilters,
  filters,
  liftNames,
  resetState,
  setAppliedFilters,
  setFilteredWorkouts,
  workoutNames,
  workouts,
}: {
  appliedFilters: typeof filters
  clearFilters: () => void
  filters: Session["filters"]
  liftNames: Session["profile"]["liftNames"]
  resetState: () => void
  setAppliedFilters: React.Dispatch<React.SetStateAction<typeof filters>>
  setFilteredWorkouts: React.Dispatch<React.SetStateAction<typeof workouts>>
  workoutNames: Session["profile"]["workoutNames"]
  workouts: Session["workouts"]
}) {
  const {setPersistentAlert} = useAlerts()

  return (
    <div>
      <h2 className="text-lg font-bold">Exercise Name</h2>
      <div className="mb-10 mt-4 grid gap-4">
        {sortBy(appliedFilters.liftIds, ({id}) =>
          getLiftName(id, liftNames),
        ).map(({checked, id}) => (
          <Checkbox
            key={id}
            onChange={e => updateWorkoutsFilter(e.target.value, "liftId")}
            text={getLiftName(id, liftNames)}
            value={id}
            {...{checked}}
          />
        ))}
      </div>
      <h2 className="text-lg font-bold">Workout Name</h2>
      <div className="mb-10 mt-4 grid gap-4">
        {sortBy(appliedFilters.nameIds, ({id}) =>
          getWorkoutName(id, workoutNames),
        ).map(({checked, id}) => (
          <Checkbox
            key={id}
            onChange={e => updateWorkoutsFilter(e.target.value, "nameId")}
            text={getWorkoutName(id, workoutNames)}
            value={id}
            {...{checked}}
          />
        ))}
      </div>
      <h2 className="text-lg font-bold">Workout Date</h2>
      <div className="mb-2 mt-4">
        <Checkbox
          key={"chronology"}
          checked={appliedFilters.newestFirst}
          onChange={e => updateWorkoutsFilter(e.target.value, "chronology")}
          text={"Newest First"}
          value={"chronology"}
        />
        <div className="mt-3 flex flex-col gap-3">
          <div>
            <label htmlFor="startDate">Start date:</label>
            <input
              className="mt-1"
              min={filters.workoutDates.startDate}
              max={appliedFilters.workoutDates.endDate.split("T")[0]}
              id="startDate"
              type="date"
              value={appliedFilters.workoutDates.startDate.split("T")[0]}
              onChange={e => {
                updateWorkoutsFilter(e.target.value, "startDate")
              }}
            />
          </div>
          <div>
            <label htmlFor="endDate">End date:</label>
            <input
              className="mt-1"
              id="endDate"
              min={appliedFilters.workoutDates.startDate.split("T")[0]}
              max={filters.workoutDates.endDate.split("T")[0]}
              type="date"
              value={appliedFilters.workoutDates.endDate.split("T")[0]}
              onChange={e => {
                updateWorkoutsFilter(e.target.value, "endDate")
              }}
            />
          </div>
        </div>
      </div>
    </div>
  )

  /**
   * Toggles or updates the value of a workouts filter after a user event
   */
  function updateWorkoutsFilter(
    clickedFilter: string,
    filterType: "nameId" | "liftId" | "startDate" | "endDate" | "chronology",
  ) {
    const updatedFilters = updateFilters()
    setAppliedFilters(updatedFilters)
    const updatedWorkouts = filterWorkouts()
    setFilteredWorkouts(updatedWorkouts)

    const updatedFilterCount = countAppliedFilters()
    if (updatedFilterCount === 0) {
      setPersistentAlert(null)
    } else {
      setPersistentAlert({
        actions: [
          {
            onClick: clearFilters,
            text: "Clear Filters",
          },
        ],
        text:
          updatedWorkouts.length === 0
            ? "No results"
            : `${updatedFilterCount} filter${
                updatedFilterCount === 1 ? "" : "s"
              } applied`,
        type: updatedWorkouts.length === 0 ? "danger" : "success",
      })
    }

    /**
     * Updates the workout filters based on a user action
     */
    function updateFilters() {
      const {nameIds, workoutDates, liftIds, newestFirst} = appliedFilters
      switch (filterType) {
        case "nameId":
          return {
            ...appliedFilters,
            nameIds: nameIds.map(nameId =>
              nameId.id === clickedFilter
                ? {...nameId, checked: !nameId.checked}
                : nameId,
            ),
          }
        case "liftId":
          return {
            ...appliedFilters,
            liftIds: liftIds.map(liftId =>
              liftId.id === clickedFilter
                ? {...liftId, checked: !liftId.checked}
                : liftId,
            ),
          }
        case "startDate":
          return {
            ...appliedFilters,
            workoutDates: {
              ...workoutDates,
              startDate: clickedFilter,
            },
          }
        case "endDate":
          return {
            ...appliedFilters,
            workoutDates: {
              ...workoutDates,
              endDate: clickedFilter,
            },
          }
        case "chronology":
          return {
            ...appliedFilters,
            newestFirst: !newestFirst,
          }
        default:
          return appliedFilters
      }
    }

    /**
     * @returns the number of filters which the user has applied
     */
    function countAppliedFilters() {
      let count = 0
      if (updatedFilters.workoutDates.allDates.length === 0) {
        return count
      }
      const {
        liftIds,
        nameIds,
        workoutDates: {allDates, startDate, endDate},
      } = updatedFilters
      if (startDate !== allDates[0]) {
        count++
      }
      if (endDate !== allDates.at(-1)) {
        count++
      }
      count += [...liftIds, ...nameIds].filter(id => id.checked).length
      return count
    }

    /**
     * @returns a list of workouts which reflect the current filters (if any)
     */
    function filterWorkouts() {
      const {workoutDates, nameIds, liftIds, newestFirst} = updatedFilters
      const filteredWorkouts = workouts
        .flatMap(workout =>
          workout.date >= workoutDates.startDate &&
          workout.date <= workoutDates.endDate &&
          (!nameIds.some(({checked}) => checked) ||
            nameIds.find(({id}) => id === workout.nameId)?.checked)
            ? [
                {
                  ...workout,
                  routine: !liftIds.some(({checked}) => checked)
                    ? workout.routine
                    : workout.routine.filter(
                        ({liftId}) =>
                          liftIds.find(({id}) => id === liftId)?.checked,
                      ),
                },
              ]
            : [],
        )
        .filter(workout => workout.routine.length > 0)
      return newestFirst ? filteredWorkouts : filteredWorkouts.reverse()
    }
  }
}
