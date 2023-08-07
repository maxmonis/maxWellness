import React from "react"
import Link from "next/link"

import {
  faArrowLeft,
  faArrowRight,
  faFilter,
  faGear,
  faInfoCircle,
  faList,
  faRotate,
} from "@fortawesome/free-solid-svg-icons"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"

import useViewport from "~/shared/hooks/useViewport"
import {Profile, Workout} from "~/shared/resources/models"
import {getDateText} from "~/shared/utils/parsers"
import {getPrintout, groupExercisesByLift} from "~/shared/utils/workout"
import {Button, UserMenu} from "./CTA"

/**
 * Displays workout exercises and dates in a table view
 * which can be filtered and/or have its axes toggled
 */
export default function WorkoutsTable({
  filteredWorkouts,
  clearFilters,
  handleFiltersClick,
  hideWorkoutsTable,
  profile,
}: {
  filteredWorkouts: Workout[]
  profile: Profile
} & {
  [key in
    | "clearFilters"
    | "handleFiltersClick"
    | "hideWorkoutsTable"]: () => void
}) {
  const width = useViewport()

  const canFit = Math.floor(width / 150) - 1
  const maxColumns = canFit < 2 ? 1 : canFit < 3 ? canFit : 3

  const liftIds: Record<string, number> = {}
  for (const {routine} of filteredWorkouts) {
    for (const {liftId} of routine) {
      liftIds[liftId] = liftIds[liftId] + 1 || 1
    }
  }
  const liftArray = []
  for (const liftId in liftIds) {
    liftArray.push({liftId, total: liftIds[liftId]})
  }
  const sortedLifts = liftArray.sort((a, b) => b.total - a.total)

  const [sortByDate, setSortByDate] = React.useState(false)
  const [horizontalIndex, setHorizontalIndex] = React.useState(0)
  const [canIncrement, setCanIncrement] = React.useState(false)

  React.useEffect(() => {
    setHorizontalIndex(0)
  }, [maxColumns, sortByDate])

  React.useEffect(() => {
    setCanIncrement(
      sortByDate
        ? horizontalIndex < filteredWorkouts.length - maxColumns
        : horizontalIndex < liftArray.length - maxColumns,
    )
    // eslint-disable-next-line
  }, [liftArray, horizontalIndex])

  return (
    <div className="flex justify-center border-slate-700 h-screen overflow-hidden">
      <div className="fixed top-0 left-0 w-screen z-10">
        <div className="flex gap-6 items-center justify-between h-16 px-6 max-w-2xl mx-auto border-slate-700 border-b sm:border-x">
          <FontAwesomeIcon
            aria-label="View workouts list"
            icon={faList}
            cursor="pointer"
            onClick={hideWorkoutsTable}
            size="xl"
          />
          <FontAwesomeIcon
            aria-label="Show workout filters"
            cursor="pointer"
            icon={faFilter}
            onClick={handleFiltersClick}
            size="xl"
          />
          <FontAwesomeIcon
            aria-label="Reverse x and y axes of table"
            cursor="pointer"
            icon={faRotate}
            onClick={() => setSortByDate(!sortByDate)}
            size="xl"
          />
          <Link aria-label="Go to settings page" href="/settings">
            <FontAwesomeIcon icon={faGear} cursor="pointer" size="xl" />
          </Link>
          <UserMenu />
        </div>
      </div>
      <div className="divide-x divide-slate-700 border-slate-700 pt-20 w-screen max-w-2xl sm:border-x max-h-screen overflow-hidden">
        <div className="flex flex-col flex-1 items-center w-full border-b border-slate-700">
          <div className="w-full">
            <div className="gap-5 flex items-center justify-center pb-4 w-full border-b border-slate-700">
              <FontAwesomeIcon
                className={
                  horizontalIndex
                    ? "cursor-pointer"
                    : "cursor-default opacity-0"
                }
                onClick={() =>
                  horizontalIndex && setHorizontalIndex(horizontalIndex - 1)
                }
                icon={faArrowLeft}
                size="lg"
              />
              <div>
                <h1 className="text-xl text-center">
                  {sortByDate ? "Dates" : "Exercises"}
                </h1>
              </div>
              <FontAwesomeIcon
                className={
                  canIncrement ? "cursor-pointer" : "cursor-default opacity-0"
                }
                onClick={() =>
                  canIncrement && setHorizontalIndex(horizontalIndex + 1)
                }
                icon={faArrowRight}
                size="lg"
              />
            </div>
          </div>
          <div className="w-full">
            <div className="w-full overflow-y-auto h-[calc(100vh-124px)] pb-20">
              {filteredWorkouts.length > 0 ? (
                <table className="table-fixed w-full border-b border-slate-700 text-center">
                  <thead className="bg-slate-50 dark:bg-black sticky top-0 divide-x divide-slate-700 shadow-sm shadow-slate-700">
                    <tr className="divide-x divide-slate-700 shadow-sm shadow-slate-700">
                      <th className="text-lg py-2 px-4 shadow-sm shadow-slate-700">
                        {sortByDate ? "Exercise" : "Date"}
                      </th>
                      {sortByDate
                        ? filteredWorkouts
                            .slice(
                              horizontalIndex,
                              horizontalIndex + maxColumns,
                            )
                            .map(workout => (
                              <th
                                className="text-lg py-2 px-4 shadow-sm shadow-slate-700 whitespace-nowrap"
                                key={workout.id}
                              >
                                {getDateText(workout.date)}
                              </th>
                            ))
                        : sortedLifts
                            .slice(
                              horizontalIndex,
                              horizontalIndex + maxColumns,
                            )
                            .map(({liftId}) => (
                              <th
                                className="text-lg py-2 px-4 shadow-sm shadow-slate-700"
                                key={liftId}
                              >
                                {getLiftName(liftId)}
                              </th>
                            ))}
                    </tr>
                  </thead>
                  <tbody>
                    {sortByDate
                      ? sortedLifts.map(({liftId}) => (
                          <tr
                            className="divide-x divide-slate-700 border-t border-slate-700"
                            key={liftId}
                          >
                            <td className="text-lg py-2 px-4">
                              {getLiftName(liftId)}
                            </td>
                            {filteredWorkouts
                              .slice(
                                horizontalIndex,
                                horizontalIndex + maxColumns,
                              )
                              .map(workout => (
                                <td
                                  className="text-lg py-2 px-4"
                                  key={liftId + workout.id}
                                >
                                  {groupExercisesByLift(
                                    workout.routine.filter(
                                      exercise => exercise.liftId === liftId,
                                    ),
                                  ).map(exerciseList =>
                                    exerciseList.map((exercise, i) =>
                                      getPrintout(exercise)
                                        .split(" ")
                                        .map(
                                          printout =>
                                            printout +
                                            (i !== exerciseList.length - 1
                                              ? ", "
                                              : ""),
                                        ),
                                    ),
                                  )}
                                </td>
                              ))}
                          </tr>
                        ))
                      : filteredWorkouts.map(workout => (
                          <tr
                            className="divide-x divide-slate-700 border-t border-slate-700"
                            key={workout.id}
                          >
                            <td className="text-lg py-2 px-4 whitespace-nowrap">
                              {getDateText(workout.date)}
                            </td>
                            {sortedLifts
                              .slice(
                                horizontalIndex,
                                horizontalIndex + maxColumns,
                              )
                              .map(({liftId}) => (
                                <td
                                  className="text-lg py-2 px-4"
                                  key={liftId + workout.id}
                                >
                                  {groupExercisesByLift(
                                    workout.routine.filter(
                                      exercise => exercise.liftId === liftId,
                                    ),
                                  ).map(exerciseList =>
                                    exerciseList.map((exercise, i) =>
                                      getPrintout(exercise)
                                        .split(" ")
                                        .map(
                                          printout =>
                                            printout +
                                            (i !== exerciseList.length - 1
                                              ? ", "
                                              : ""),
                                        ),
                                    ),
                                  )}
                                </td>
                              ))}
                          </tr>
                        ))}
                  </tbody>
                </table>
              ) : (
                <div className="flex flex-col gap-6 w-full p-6">
                  <div>
                    <p className="text-lg font-bold text-red-500">No results</p>
                    <Button
                      className="mt-2"
                      onClick={clearFilters}
                      variant="danger"
                    >
                      Clear Filters
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  /**
   * Gets the text which corresponds to a lift ID
   */
  function getLiftName(liftId: string) {
    return profile.liftNames.find(({id}) => id === liftId)?.text ?? ""
  }
}
