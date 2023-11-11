import {
  faClipboard,
  faCopy,
  faEllipsis,
  faPen,
  faTrash,
} from "@fortawesome/free-solid-svg-icons"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import classNames from "classnames"
import omit from "lodash/omit"
import {nanoid} from "nanoid"
import React from "react"
import {Button, IconButton} from "~/shared/components/CTA"
import {useAlerts} from "~/shared/context/AlertContext"
import {
  getDateText,
  getLiftNameText,
  getWorkoutNameText,
} from "~/shared/functions/parsers"
import {useKeypress} from "~/shared/hooks/useKeypress"
import {useOutsideClick} from "~/shared/hooks/useOutsideClick"
import {Exercise, Session, Workout} from "~/shared/utils/models"
import {getPrintout, groupExercisesByLift} from "../workoutsFunctions"
import {View} from "../workoutsModels"

/**
 * A workout from the list view, along with a menu
 * which allows copying, editing, or deleting
 */
export function WorkoutsListItem({
  addExercise,
  deletingId,
  editingWorkout,
  handleDelete,
  handleDeleteClick,
  liftNames,
  setDeletingId,
  setEditingWorkout,
  setValues,
  updateRoutine,
  values,
  view,
  workout,
  workoutNames,
  workouts,
}: {
  addExercise: (newExercise: Exercise) => void
  deletingId: string | null
  editingWorkout: Workout | null
  handleDelete: (id: string) => void
  handleDeleteClick: (id: string) => void
  liftNames: Session["profile"]["liftNames"]
  setDeletingId: React.Dispatch<React.SetStateAction<typeof deletingId>>
  setEditingWorkout: React.Dispatch<React.SetStateAction<typeof editingWorkout>>
  setValues: React.Dispatch<React.SetStateAction<typeof values>>
  updateRoutine: (newRoutine: Array<Exercise>) => void
  values: Record<
    "date" | "liftId" | "nameId" | "reps" | "sets" | "weight",
    string
  >
  view: View
  workout: Workout
  workouts: Array<Workout>
  workoutNames: Session["profile"]["workoutNames"]
}) {
  const {showAlert} = useAlerts()
  const [open, setOpen] = React.useState(false)
  const ref = useOutsideClick(() => setOpen(false))
  useKeypress("Escape", () => setOpen(false))
  const workoutName = workoutNames.find(n => n.id === workout.id)
  return (
    <div
      key={workout.id}
      className={classNames(
        "h-min justify-between gap-6 rounded-lg bg-gray-100 p-4 dark:bg-gray-900 sm:gap-10 md:p-6",
        editingWorkout?.id === workout.id && "italic",
        view === "list" ? "flex last:mb-20" : "sm:flex",
      )}
    >
      <div>
        <div className="mb-6">
          <h1 className="text-xl leading-tight">
            <span
              className={classNames(
                view === "create" && !workoutName?.isHidden && "cursor-pointer",
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
              {getWorkoutNameText(workout.nameId, workoutNames)}
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
                  {getLiftNameText(liftId, liftNames)}:
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
                          liftId: !liftName?.isHidden ? liftId : values.liftId,
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
              <Button onClick={() => handleDelete(workout.id)} variant="danger">
                Delete
              </Button>
              <Button onClick={() => setDeletingId(null)}>Cancel</Button>
            </div>
          ) : (
            <div className="relative" {...{ref}}>
              <IconButton
                aria-label="Toggle menu"
                className="flex items-center justify-center rounded-lg border-2 border-slate-300 p-1 dark:border-slate-700"
                icon={<FontAwesomeIcon icon={faEllipsis} size="lg" />}
                onClick={() => setOpen(!open)}
              />
              {open && (
                <dialog className="absolute -left-28 top-8 z-10 flex flex-col gap-4 rounded-lg border border-slate-700 p-4">
                  <div className="flex flex-col justify-evenly gap-y-4">
                    <IconButton
                      aria-label="Duplicate this workout's name and exercises"
                      icon={<FontAwesomeIcon icon={faCopy} />}
                      onClick={() =>
                        duplicateWorkout(
                          workouts.find(({id}) => id === workout.id) ?? workout,
                        )
                      }
                      text="Duplicate"
                    />
                    {navigator?.clipboard && (
                      <IconButton
                        aria-label="Copy this workout's name and exercises to clipboard"
                        icon={<FontAwesomeIcon icon={faClipboard} />}
                        onClick={() =>
                          copyToClipboard(
                            workouts.find(({id}) => id === workout.id) ??
                              workout,
                          )
                        }
                        text="Copy"
                      />
                    )}
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
                </dialog>
              )}
            </div>
          )}
        </>
      )}
    </div>
  )

  /**
   * Copies the name and routine of a workout, also copying it to clipboard
   */
  function duplicateWorkout(workout: Workout) {
    const copiedRoutine = workout.routine.map(exercise => ({
      ...exercise,
      id: nanoid(),
    }))
    updateRoutine(copiedRoutine)
    setValues({...values, nameId: workout.nameId})
    showAlert({text: "Workout duplicated", type: "success"})
    setOpen(false)
  }

  /**
   * Copies a workout to the clipboard
   */
  function copyToClipboard(workout: Workout) {
    navigator.clipboard
      ?.writeText(
        `${getWorkoutNameText(workout.nameId, workoutNames)}
${getDateText(workout.date)}
${groupExercisesByLift(workout.routine)
  .map(
    exerciseList =>
      `${getLiftNameText(exerciseList[0].liftId, liftNames)}: ${exerciseList
        .map(exercise => getPrintout(exercise))
        .join(", ")}`,
  )
  .join("\n")}
`,
      )
      .then(() => {
        showAlert({text: "Copied to clipboard", type: "success"})
        setOpen(false)
      })
  }
}
