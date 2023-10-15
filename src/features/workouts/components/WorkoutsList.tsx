import {faCopy, faPen, faTrash} from "@fortawesome/free-solid-svg-icons"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import classNames from "classnames"
import {omit} from "lodash"
import {nanoid} from "nanoid"
import React from "react"
import {Button, IconButton} from "~/shared/components/CTA"
import {Menu} from "~/shared/components/Menu"
import {useAlerts} from "~/shared/context/AlertContext"
import {
  getDateText,
  getLiftName,
  getWorkoutName,
} from "~/shared/functions/parsers"
import {useDeleteWorkout} from "~/shared/hooks/useDeleteWorkout"
import {useMutating} from "~/shared/hooks/useMutating"
import {Exercise, Session, Workout} from "~/shared/utils/models"
import {getPrintout, groupExercisesByLift} from "../workoutsFunctions"

export function WorkoutsList({
  addExercise,
  clearFilters,
  editingWorkout,
  filteredWorkouts,
  liftNames,
  resetState,
  setEditingWorkout,
  setValues,
  updateRoutine,
  values,
  view,
  workoutNames,
  workouts,
}: {
  addExercise: (newExercise: Exercise) => void
  clearFilters: () => void
  resetState: () => void
  editingWorkout: Workout | null
  workouts: Workout[]
  filteredWorkouts: Workout[]
  setValues: React.Dispatch<React.SetStateAction<typeof values>>
  setEditingWorkout: React.Dispatch<React.SetStateAction<typeof editingWorkout>>
  values: Record<
    "date" | "liftId" | "nameId" | "reps" | "sets" | "weight",
    string
  >
  view: "create" | "filters" | "list"
  liftNames: Session["profile"]["liftNames"]
  updateRoutine: (newRoutine: Exercise[]) => void
  workoutNames: Session["profile"]["workoutNames"]
}) {
  const {showAlert} = useAlerts()

  const {mutate: deleteWorkout} = useDeleteWorkout({
    onSuccess() {
      resetState()
      showAlert({
        text: "Workout Deleted",
        type: "success",
      })
    },
  })
  const {mutating} = useMutating({key: "session"})

  const [deletingId, setDeletingId] = React.useState<null | string>(null)

  return (
    <div className="flex w-full flex-grow max-md:px-4">
      <div className="flex w-full flex-1 flex-col">
        <div
          className={classNames("overflow-hidden", editingWorkout && "pb-60")}
        >
          {editingWorkout && (
            <div className="border-b border-slate-700 py-6">
              <WorkoutsListItem workout={editingWorkout} />
            </div>
          )}
          <div className="grid h-full gap-4 overflow-y-auto overflow-x-hidden py-6">
            {filteredWorkouts.length ? (
              filteredWorkouts
                .filter(({id}) => id !== editingWorkout?.id)
                .map(workout => (
                  <WorkoutsListItem key={workout.id} {...{workout}} />
                ))
            ) : (
              <div className="px-4 py-6 sm:px-6">
                {workouts.length ? (
                  <div className="flex flex-wrap items-center gap-4">
                    <p className="text-lg font-bold text-red-500">No results</p>
                    <Button onClick={clearFilters} variant="secondary">
                      Clear Filters
                    </Button>
                  </div>
                ) : (
                  <p>You haven&apos;t added any workouts yet</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )

  /**
   * Copies the name and routine of a workout, also copying it to clipboard
   */
  function copyWorkout(workout: Workout) {
    const copiedRoutine = workout.routine.map(exercise => ({
      ...exercise,
      id: nanoid(),
    }))
    updateRoutine(copiedRoutine)
    setValues({...values, nameId: workout.nameId})
    copyToClipboard(workout)
  }

  /**
   * Copies a workout to the clipboard
   */
  function copyToClipboard(workout: Workout) {
    navigator.clipboard?.writeText(
      `${getWorkoutName(workout.nameId, workoutNames)}
  ${getDateText(workout.date)}
  ${groupExercisesByLift(workout.routine)
    .map(
      exerciseList =>
        `${getLiftName(exerciseList[0].liftId, liftNames)}: ${exerciseList
          .map(exercise => getPrintout(exercise))
          .join(", ")}`,
    )
    .join("\n")}
  `,
    )
  }

  /**
   * Asks the user if they're sure they'd like to delete a workout
   */
  function handleDeleteClick(id: string) {
    setDeletingId(id)
  }

  /**
   * Deletes a workout
   */
  async function handleDelete(id: string) {
    if (!mutating) deleteWorkout(id)
  }

  function WorkoutsListItem({workout}: {workout: Workout}) {
    const workoutName = workoutNames.find(n => n.id === workout.id)
    return (
      <div
        key={workout.id}
        className={classNames(
          "justify-between gap-6 rounded-lg bg-gray-100 px-4 py-6 dark:bg-gray-900 sm:gap-10",
          editingWorkout?.id === workout.id && "italic",
          view === "list" ? "flex xs:px-6" : "sm:flex sm:px-6",
        )}
      >
        <div>
          <div className="mb-6">
            <h1 className="text-xl leading-tight">
              <span
                className={classNames(
                  view === "create" &&
                    !workoutName?.isHidden &&
                    "cursor-pointer",
                )}
                {...(view === "create" &&
                  !workoutName?.isHidden && {
                    onClick: () =>
                      setValues({
                        ...values,
                        nameId: workout.nameId,
                      }),
                    title: "Click to copy",
                  })}
              >
                {getWorkoutName(workout.nameId, workoutNames)}
              </span>
            </h1>
            <h2 className="mt-2 leading-tight">
              <span
                className={classNames(
                  view === "create"
                    ? "cursor-pointer"
                    : "text-gray-600 dark:text-gray-400",
                )}
                {...(view === "create" && {
                  onClick: () =>
                    setValues({
                      ...values,
                      date: workout.date.split("T")[0],
                    }),
                  title: "Click to copy",
                })}
              >
                {getDateText(workout.date)}
              </span>
            </h2>
          </div>
          <ul>
            {groupExercisesByLift(workout.routine).map((exerciseList, j) => {
              const [{liftId}] = exerciseList
              const liftName = liftNames.find(({id}) => id === liftId)
              return (
                <li key={j} className="mt-4 flex flex-wrap">
                  <span
                    className={classNames(
                      "text-lg leading-tight",
                      view === "create" &&
                        !liftName?.isHidden &&
                        "cursor-pointer",
                    )}
                    {...(view === "create" &&
                      !liftName?.isHidden && {
                        onClick: () =>
                          setValues({
                            ...values,
                            liftId,
                          }),
                        title: "Click to copy",
                      })}
                  >
                    {getLiftName(liftId, liftNames)}:
                  </span>
                  {exerciseList.map((exercise, k) => (
                    <span
                      key={k}
                      className={classNames(
                        "text-lg leading-tight",
                        view === "create" &&
                          !liftName?.isHidden &&
                          "cursor-pointer",
                      )}
                      {...(view === "create" && {
                        onClick() {
                          setValues({
                            ...values,
                            liftId: !liftName?.isHidden
                              ? liftId
                              : values.liftId,
                            sets: exercise.sets ? exercise.sets.toString() : "",
                            reps: exercise.reps ? exercise.reps.toString() : "",
                            weight: exercise.weight
                              ? exercise.weight.toString()
                              : "",
                          })
                          addExercise({
                            ...omit(exercise, [
                              "recordStartDate",
                              "recordEndDate",
                            ]),
                            id: nanoid(),
                          })
                        },
                        title: "Click to copy",
                      })}
                    >
                      &nbsp;
                      {getPrintout(exercise)}
                      {k !== exerciseList.length - 1 && ","}
                    </span>
                  ))}
                </li>
              )
            })}
          </ul>
        </div>
        {view === "list" && (
          <>
            {deletingId === workout.id ? (
              <div className="flex flex-col items-center justify-evenly gap-4">
                <Button
                  onClick={() => handleDelete(workout.id)}
                  variant="danger"
                >
                  Delete
                </Button>
                <Button onClick={() => setDeletingId(null)}>Cancel</Button>
              </div>
            ) : (
              <Menu>
                <div className="flex flex-col justify-evenly gap-y-4">
                  <IconButton
                    aria-label="Copy this workout's name and exercises"
                    icon={<FontAwesomeIcon icon={faCopy} />}
                    onClick={() =>
                      copyWorkout(
                        workouts.find(({id}) => id === workout.id) ?? workout,
                      )
                    }
                    text="Copy"
                  />
                  <IconButton
                    aria-label="Edit this workout"
                    className="text-lg"
                    icon={<FontAwesomeIcon icon={faPen} />}
                    onClick={() =>
                      setEditingWorkout(
                        editingWorkout?.id === workout.id
                          ? null
                          : workouts.find(({id}) => id === workout.id) ??
                              workout,
                      )
                    }
                    text="Edit"
                  />
                  <IconButton
                    aria-label="Delete this workout"
                    icon={<FontAwesomeIcon icon={faTrash} />}
                    onClick={() => handleDeleteClick(workout.id)}
                    text="Delete"
                  />
                </div>
              </Menu>
            )}
          </>
        )}
      </div>
    )
  }
}
