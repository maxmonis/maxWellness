import {
  faArrowLeft,
  faArrowRight,
  faRotate,
} from "@fortawesome/free-solid-svg-icons"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import classNames from "classnames"
import React from "react"
import {getDateText, getLiftNameText} from "~/functions/parsers"
import {useSession} from "~/hooks/useSession"
import {useViewport} from "~/hooks/useViewport"
import {Workout} from "~/utils/models"
import {BackButton, Button, IconButton} from "../../../components/CTA"
import {getPrintout, groupExercisesByLift} from "../workoutsFunctions"
import {WorkoutsEmptyState} from "./WorkoutsEmptyState"

/**
 * Displays workout exercises and dates in a table view
 * which can be filtered and/or have its axes toggled
 */
export function WorkoutsTable({
  clearFilters,
  filteredWorkouts,
}: {
  clearFilters: () => void
  filteredWorkouts: Array<Workout>
}) {
  const width = useViewport()
  const {data: session, isLoading} = useSession()

  const maxColumns = width < 550 ? 1 : width < 1000 ? 2 : width < 1200 ? 3 : 4

  const liftIds: Record<string, number> = {}
  for (const {routine} of filteredWorkouts) {
    for (const {liftId} of routine) {
      liftIds[liftId] = liftIds[liftId] + 1 || 1
    }
  }
  const liftArray: Array<{
    liftId: string
    total: number
  }> = []
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

  if (!isLoading && session?.workouts.length === 0) {
    return (
      <div className="p-6">
        <WorkoutsEmptyState />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen w-full justify-center border-slate-700 xl:max-w-5xl xl:border-r">
      <div className="w-full flex-col divide-x divide-slate-700 overflow-hidden">
        <div className="flex w-full flex-1 flex-col items-center border-slate-700">
          <div className="flex h-14 w-full items-end justify-between border-b border-slate-700 px-4 pb-2 sm:px-6 sm:text-lg">
            <div className="flex">
              <BackButton />
              <h1 className="text-xl font-bold">
                {sortByDate ? "Dates" : "Exercises"}
              </h1>
            </div>
            <div className="flex items-center justify-center gap-5">
              <FontAwesomeIcon
                aria-label="View previous column"
                className={classNames(
                  horizontalIndex
                    ? "cursor-pointer"
                    : "cursor-default opacity-0",
                )}
                onClick={() =>
                  horizontalIndex && setHorizontalIndex(horizontalIndex - 1)
                }
                icon={faArrowLeft}
                size="lg"
              />
              <IconButton
                aria-label="Reverse x and y axes of table"
                icon={<FontAwesomeIcon icon={faRotate} size="lg" />}
                onClick={() => setSortByDate(!sortByDate)}
              />
              <FontAwesomeIcon
                aria-label="View next column"
                className={classNames(
                  canIncrement ? "cursor-pointer" : "cursor-default opacity-0",
                )}
                onClick={() =>
                  canIncrement && setHorizontalIndex(horizontalIndex + 1)
                }
                icon={faArrowRight}
                size="lg"
              />
            </div>
          </div>
          <div className="h-full w-full">
            <div className="max-h-[calc(100dvh-7rem)] w-full overflow-y-auto border-slate-700 md:max-h-[calc(100dvh-3.5rem)]">
              {filteredWorkouts.length > 0 ? (
                <table className="w-full table-fixed border-b border-slate-700 bg-white text-center dark:bg-black">
                  <thead className="sticky top-0 divide-x divide-slate-700 bg-white text-gray-900 shadow-sm shadow-slate-700 dark:bg-black dark:text-white">
                    <tr className="divide-x divide-slate-700 shadow-sm shadow-slate-700">
                      <th className="px-4 py-2 text-lg shadow-sm shadow-slate-700">
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
                                className="px-4 py-2 text-lg shadow-sm shadow-slate-700"
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
                            .map(({liftId}) => {
                              const liftNameText = getLiftNameText(
                                liftId,
                                session?.profile.liftNames ?? [],
                              )
                              return (
                                <th
                                  className={classNames(
                                    "px-4 py-2 text-lg leading-tight shadow-sm shadow-slate-700",
                                    liftNameText
                                      .split(" ")
                                      .some(word => word.length > 9) &&
                                      "break-all",
                                  )}
                                  key={liftId}
                                >
                                  {liftNameText}
                                </th>
                              )
                            })}
                    </tr>
                  </thead>
                  <tbody>
                    {sortByDate
                      ? sortedLifts.map(({liftId}) => {
                          const liftNameText = getLiftNameText(
                            liftId,
                            session?.profile.liftNames ?? [],
                          )
                          return (
                            <tr
                              className={classNames(
                                "divide-x divide-slate-700 border-t border-slate-700",
                                liftNameText
                                  .split(" ")
                                  .some(word => word.length > 9) && "break-all",
                              )}
                              key={liftId}
                            >
                              <td className="px-4 py-2 leading-tight sm:text-lg">
                                {liftNameText}
                              </td>
                              {filteredWorkouts
                                .slice(
                                  horizontalIndex,
                                  horizontalIndex + maxColumns,
                                )
                                .map(workout => (
                                  <td
                                    className="px-4 py-2 sm:text-lg"
                                    key={liftId + workout.id}
                                  >
                                    {groupExercisesByLift(
                                      workout.routine.filter(
                                        exercise => exercise.liftId === liftId,
                                      ),
                                    ).map(exerciseList =>
                                      exerciseList
                                        .map(exercise =>
                                          getPrintout(exercise).split(" "),
                                        )
                                        .join(", "),
                                    )}
                                  </td>
                                ))}
                            </tr>
                          )
                        })
                      : filteredWorkouts.map(workout => (
                          <tr
                            className="divide-x divide-slate-700 border-t border-slate-700"
                            key={workout.id}
                          >
                            <td className="px-4 py-2 sm:text-lg">
                              {getDateText(workout.date)}
                            </td>
                            {sortedLifts
                              .slice(
                                horizontalIndex,
                                horizontalIndex + maxColumns,
                              )
                              .map(({liftId}) => (
                                <td
                                  className="px-4 py-2 sm:text-lg"
                                  key={liftId + workout.id}
                                >
                                  {groupExercisesByLift(
                                    workout.routine.filter(
                                      exercise => exercise.liftId === liftId,
                                    ),
                                  ).map(exerciseList =>
                                    exerciseList
                                      .map(exercise =>
                                        getPrintout(exercise).split(" "),
                                      )
                                      .join(", "),
                                  )}
                                </td>
                              ))}
                          </tr>
                        ))}
                  </tbody>
                </table>
              ) : (
                <div className="flex items-center justify-center gap-4 p-6">
                  <p className="font-bold text-red-500 sm:text-lg">
                    No results
                  </p>
                  <Button onClick={clearFilters} variant="secondary">
                    Clear Filters
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
