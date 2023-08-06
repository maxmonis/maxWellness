import React from "react"
import Link from "next/link"

import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {
  faCopy,
  faFilter,
  faGear,
  faPen,
  faTable,
  faTrash,
  faX,
  faCirclePlus,
  faInfoCircle,
} from "@fortawesome/free-solid-svg-icons"
import isEqual from "lodash/isEqual"
import omit from "lodash/omit"
import sortBy from "lodash/sortBy"
import {nanoid} from "nanoid"
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "react-beautiful-dnd"

import {Checkbox} from "~/components/CTA"
import Page from "~/components/Page"
import WorkoutsTable from "~/components/WorkoutsTable"
import {useAlerts} from "~/context/AlertContext"
import useAddWorkout from "~/hooks/useAddWorkout"
import useDeleteWorkout from "~/hooks/useDeleteWorkout"
import useSession from "~/hooks/useSession"
import useUpdateEvent from "~/hooks/useUpdateEvent"
import useUpdateWorkout from "~/hooks/useUpdateWorkout"
import {Exercise, Session, Workout} from "~/resources/models"
import {getDateText} from "~/utils/parsers"
import LocalStorage from "~/utils/storage"
import {
  getPrintout,
  groupExercisesByLift,
  createNewExercise,
  eliminateRedundancy,
} from "~/utils/workout"

const now = new Date()
const year = now.getFullYear()
const month = (now.getMonth() + 1).toString().padStart(2, "0")
const day = now.getDate().toString().padStart(2, "0")
const today = [year, month, day].join("-")

/**
 * Landing page which allows user to view and manage workouts
 */
export default function HomePage() {
  const [session, loading, error] = useSession()

  return (
    <Page
      component={HomeApp}
      loadingText="Loading workouts..."
      props={session}
      title="Workouts"
      mustBeLoggedIn
      {...{error, loading}}
    />
  )
}

function HomeApp({filters, profile, workouts}: Session) {
  const {liftNames, userId, workoutNames} = profile
  const localRoutine = new LocalStorage<Workout["routine"]>(
    `wip-routine_${userId}`,
  )

  const {showAlert, setPersistentAlert} = useAlerts()

  const getConfig = (action: "deleted" | "saved" | "updated") => ({
    onMutate: () => setSubmitting(true),
    onSettled: () => setSubmitting(false),
    onSuccess() {
      resetState()
      showAlert({
        text: `Workout ${action}`,
        type: "success",
      })
    },
  })
  const addWorkout = useAddWorkout(getConfig("saved"))
  const deleteWorkout = useDeleteWorkout(getConfig("deleted"))
  const updateWorkout = useUpdateWorkout(getConfig("updated"))

  const defaultValues = {
    date: today,
    liftId: liftNames[0].id,
    nameId: workoutNames[0].id,
    reps: "",
    sets: "",
    weight: "",
  }
  const [values, setValues] = React.useState(defaultValues)
  const {date, liftId, nameId, reps, sets, weight} = values

  const [errorMsg, setErrorMsg] = React.useState("")
  const [workoutError, setWorkoutError] = React.useState("")

  const [routine, setRoutine] = React.useState<Workout["routine"]>(
    localRoutine.get() ?? [],
  )

  const [deletingId, setDeletingId] = React.useState<null | string>(null)

  const [submitting, setSubmitting] = React.useState(false)
  const [editingWorkout, setEditingWorkout] = React.useState<Workout | null>(
    null,
  )

  const [view, setView] = React.useState<
    "list" | "table" | "filters" | "create"
  >(workouts.length > 0 ? "list" : "create")
  const [appliedFilters, setAppliedFilters] = React.useState(filters)
  const [filteredWorkouts, setFilteredWorkouts] = React.useState(workouts)

  useUpdateEvent(() => {
    if (editingWorkout) {
      updateRoutine(editingWorkout.routine)
      setValues({
        ...defaultValues,
        nameId: editingWorkout.nameId,
        date: editingWorkout.date.split("T")[0],
      })
    } else {
      resetState()
    }
  }, [editingWorkout])

  useUpdateEvent(() => {
    clearFilters()
  }, [workouts])

  React.useEffect(() => {
    return () => {
      setPersistentAlert(null)
    }
  }, [])

  if (view === "table") {
    return (
      <WorkoutsTable
        {...{
          clearFilters,
          filteredWorkouts,
          handleFiltersClick,
          profile,
        }}
        hideWorkoutsTable={() => setView("list")}
      />
    )
  }

  return (
    <div className="flex justify-center bg-black border-slate-700">
      <div className="fixed top-0 left-0 w-screen bg-black">
        <div className="flex gap-6 items-center justify-between h-16 px-6 border-slate-700 border-b max-w-2xl mx-auto sm:border-x">
          <FontAwesomeIcon
            aria-label="Add a new workout"
            icon={faCirclePlus}
            className="text-blue-400"
            cursor="pointer"
            onClick={handleNewWorkoutClick}
            size="xl"
          />
          {workouts.length > 0 && (
            <>
              <FontAwesomeIcon
                aria-label="Show workout filters"
                cursor="pointer"
                icon={faFilter}
                onClick={handleFiltersClick}
                size="xl"
              />
              <FontAwesomeIcon
                aria-label="View workouts in a table view"
                icon={faTable}
                cursor="pointer"
                onClick={() => setView("table")}
                size="xl"
              />
            </>
          )}
          <Link aria-label="Go to the info page" href="/info">
            <FontAwesomeIcon icon={faInfoCircle} cursor="pointer" size="xl" />
          </Link>
          <Link aria-label="Go to the settings page" href="/settings">
            <FontAwesomeIcon icon={faGear} cursor="pointer" size="xl" />
          </Link>
        </div>
        <div
          className={`flex items-center justify-between border-b py-4 border-slate-700 max-w-2xl mx-auto sm:px-6 sm:border-x ${
            view !== "list" ? "px-4" : "px-6"
          }`}
        >
          <h1 className="text-xl text-center">
            {view === "create"
              ? `${editingWorkout ? "Editing" : "New"} Workout`
              : view === "filters"
              ? "Filters"
              : "Workouts"}
          </h1>
        </div>
      </div>
      <div className="flex justify-center w-screen max-w-2xl sm:border-x pt-28 border-slate-700">
        {view !== "list" && (
          <div className="flex flex-grow h-screen">
            <div className="flex flex-col border-r border-slate-700 max-w-7xl w-40 xs:w-56 sm:w-64">
              <div className="overflow-hidden">
                <div className="overflow-y-auto h-full pt-10 pb-20 px-4 sm:px-6">
                  {view === "filters" ? (
                    <div>
                      <h4 className="text-xl">Exercise Name</h4>
                      <div className="mt-4 mb-10 grid gap-4">
                        {sortBy(appliedFilters.liftIds, ({id}) =>
                          getLiftName(id),
                        ).map(({checked, id}) => (
                          <Checkbox
                            key={id}
                            onChange={e =>
                              updateWorkoutsFilter(e.target.value, "liftId")
                            }
                            text={getLiftName(id)}
                            value={id}
                            {...{checked}}
                          />
                        ))}
                      </div>
                      <h4 className="text-xl">Workout Name</h4>
                      <div className="mt-4 mb-10 grid gap-4">
                        {sortBy(appliedFilters.nameIds, ({id}) =>
                          getWorkoutName(id),
                        ).map(({checked, id}) => (
                          <Checkbox
                            key={id}
                            onChange={e =>
                              updateWorkoutsFilter(e.target.value, "nameId")
                            }
                            text={getWorkoutName(id)}
                            value={id}
                            {...{checked}}
                          />
                        ))}
                      </div>
                      <h4 className="text-xl">Workout Date</h4>
                      <div className="mt-4 mb-2">
                        <Checkbox
                          key={"chronology"}
                          checked={appliedFilters.newestFirst}
                          onChange={e =>
                            updateWorkoutsFilter(e.target.value, "chronology")
                          }
                          text={"Newest First"}
                          value={"chronology"}
                        />
                        <div className="flex flex-col gap-3 mt-3">
                          <div>
                            <label htmlFor="startDate">Start date:</label>
                            <input
                              className="mt-1"
                              min={filters.workoutDates.startDate}
                              max={
                                appliedFilters.workoutDates.endDate.split(
                                  "T",
                                )[0]
                              }
                              id="startDate"
                              type="date"
                              value={
                                appliedFilters.workoutDates.startDate.split(
                                  "T",
                                )[0]
                              }
                              onChange={e => {
                                updateWorkoutsFilter(
                                  e.target.value,
                                  "startDate",
                                )
                              }}
                            />
                          </div>
                          <div>
                            <label htmlFor="endDate">End date:</label>
                            <input
                              className="mt-1"
                              id="endDate"
                              min={
                                appliedFilters.workoutDates.startDate.split(
                                  "T",
                                )[0]
                              }
                              max={filters.workoutDates.endDate.split("T")[0]}
                              type="date"
                              value={
                                appliedFilters.workoutDates.endDate.split(
                                  "T",
                                )[0]
                              }
                              onChange={e => {
                                updateWorkoutsFilter(e.target.value, "endDate")
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <form className="flex flex-col" {...{onSubmit}}>
                        <div>
                          <label className="sr-only" htmlFor="exerciseName">
                            Exercise Name
                          </label>
                          <select
                            id="exerciseName"
                            name="liftId"
                            value={liftId}
                            {...{onChange}}
                          >
                            {sortBy(liftNames, "text").map(({text, id}) => (
                              <option key={id} value={id}>
                                {text}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="flex flex-shrink gap-1">
                          {[
                            {label: "Sets", name: "sets", value: sets},
                            {label: "Reps", name: "reps", value: reps},
                            {
                              label: "Weight",
                              name: "weight",
                              value: weight,
                            },
                          ].map(({label, ...field}, i) => (
                            <div key={i}>
                              <label className="text-sm" htmlFor={label}>
                                {label}
                              </label>
                              <input
                                autoFocus={i === 0 && routine.length === 0}
                                className="flex flex-shrink text-center xs:px-3 xs:text-left"
                                id={label}
                                inputMode="numeric"
                                pattern="\d*"
                                {...{onChange}}
                                {...field}
                              />
                            </div>
                          ))}
                        </div>
                        <div className="mt-2">
                          <div className="flex items-center gap-3 justify-between">
                            <button
                              className="flex flex-grow justify-center py-2 border rounded text-blue-300 border-blue-300"
                              type="submit"
                            >
                              Enter
                            </button>
                            {(reps || sets || weight) && (
                              <button
                                className="mx-auto text-blue-300"
                                onClick={() =>
                                  setValues({
                                    ...defaultValues,
                                    date,
                                    nameId,
                                    liftId,
                                  })
                                }
                                type="button"
                              >
                                Clear
                              </button>
                            )}
                          </div>
                          {errorMsg && (
                            <p className="text-red-500 text-sm">{errorMsg}</p>
                          )}
                        </div>
                      </form>
                      {routine.length > 0 && (
                        <div>
                          <DragDropContext onDragEnd={handleDragEnd}>
                            <Droppable droppableId="ExerciseList">
                              {({
                                droppableProps,
                                innerRef: droppableRef,
                                placeholder,
                              }) => (
                                <ul
                                  className="mt-4"
                                  ref={droppableRef}
                                  {...droppableProps}
                                >
                                  {routine.map((exercise, i) => (
                                    <Draggable
                                      draggableId={exercise.id}
                                      index={i}
                                      key={exercise.id}
                                    >
                                      {({
                                        draggableProps,
                                        dragHandleProps,
                                        innerRef: draggableRef,
                                      }) => (
                                        <li
                                          className="flex justify-between items-center py-2 gap-2"
                                          ref={draggableRef}
                                          {...draggableProps}
                                        >
                                          <span
                                            className="text-lg leading-tight"
                                            {...dragHandleProps}
                                          >
                                            {`${getLiftName(
                                              exercise.liftId,
                                            )}: ${getPrintout(
                                              omit(exercise, [
                                                "recordEndDate",
                                                "recordStartDate",
                                              ]),
                                            )}`}
                                          </span>
                                          <FontAwesomeIcon
                                            icon={faX}
                                            onClick={() =>
                                              deleteExercise(exercise.id)
                                            }
                                            cursor="pointer"
                                          />
                                        </li>
                                      )}
                                    </Draggable>
                                  ))}
                                  {placeholder}
                                </ul>
                              )}
                            </Droppable>
                          </DragDropContext>
                        </div>
                      )}
                      <div>
                        <div className="mt-6">
                          <label className="sr-only" htmlFor="workoutName">
                            Workout Name
                          </label>
                          <select
                            className="mb-2"
                            id="workoutName"
                            name="nameId"
                            value={nameId}
                            {...{onChange}}
                          >
                            {sortBy(workoutNames, "text").map(({id, text}) => (
                              <option key={id} value={id}>
                                {text}
                              </option>
                            ))}
                          </select>
                          <label className="sr-only" htmlFor="workoutDate">
                            Workout Date
                          </label>
                          <input
                            id="workoutDate"
                            name="date"
                            type="date"
                            value={date}
                            {...{onChange}}
                          />
                        </div>
                        <div className="flex items-center gap-3 mt-2 justify-between">
                          <button
                            className="flex flex-grow justify-center py-2 border rounded text-blue-300 border-blue-300"
                            onClick={handleSave}
                            type="button"
                          >
                            Save
                          </button>
                          {routine.length > 0 && (
                            <button
                              className="mx-auto text-blue-300"
                              type="button"
                              onClick={() => updateRoutine([])}
                            >
                              Reset
                            </button>
                          )}
                        </div>
                        {workoutError && (
                          <p className="text-red-500 text-sm">{workoutError}</p>
                        )}
                      </div>
                      <div className="flex justify-center w-full mt-4 text-red-500">
                        {editingWorkout ? (
                          <button onClick={resetState}>Discard Changes</button>
                        ) : (
                          <button
                            onClick={() => {
                              updateRoutine([])
                              resetState()
                            }}
                          >
                            Discard
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
        <div className="flex flex-grow h-screen w-full">
          <div className="flex flex-col flex-1 w-full">
            <div className="overflow-hidden">
              <div
                className={`overflow-y-auto overflow-x-hidden h-full pb-20 pt-4 ${
                  view !== "list" ? "px-4 sm:px-6" : "px-6"
                }`}
              >
                {filteredWorkouts.length ? (
                  filteredWorkouts.map((workout, i) => (
                    <div
                      key={i}
                      className={`py-6 border-slate-700 justify-between gap-6 ${
                        i ? "border-t-2" : ""
                      } ${editingWorkout?.id === workout.id ? "italic" : ""} ${
                        view !== "list" ? "sm:flex" : "flex"
                      }`}
                    >
                      <div>
                        <div className="mb-6">
                          <h4 className="text-xl leading-tight">
                            <span
                              className={
                                view === "create" ? "cursor-pointer" : ""
                              }
                              onClick={
                                view === "create"
                                  ? () => {
                                      setValues({
                                        ...values,
                                        nameId: workout.nameId,
                                      })
                                    }
                                  : undefined
                              }
                            >
                              {getWorkoutName(workout.nameId)}
                            </span>
                          </h4>
                          <h5 className="text-md leading-tight mt-2">
                            <span
                              className={
                                view === "create" ? "cursor-pointer" : ""
                              }
                              onClick={
                                view === "create"
                                  ? () =>
                                      setValues({
                                        ...values,
                                        date: workout.date.split("T")[0],
                                      })
                                  : undefined
                              }
                            >
                              {getDateText(workout.date)}
                            </span>
                          </h5>
                        </div>
                        <ul>
                          {groupExercisesByLift(workout.routine).map(
                            (exerciseList, j) => (
                              <li key={j} className="flex flex-wrap mt-4">
                                <span
                                  className={`leading-tight text-lg ${
                                    view === "create" ? "cursor-pointer" : ""
                                  }`}
                                  onClick={
                                    view === "create"
                                      ? () => {
                                          setValues({
                                            ...values,
                                            liftId: exerciseList[0].liftId,
                                          })
                                        }
                                      : undefined
                                  }
                                >
                                  {getLiftName(exerciseList[0].liftId)}:
                                </span>
                                {exerciseList.map((exercise, k) => (
                                  <span
                                    key={k}
                                    className={`leading-tight text-lg ${
                                      view === "create" ? "cursor-pointer" : ""
                                    }`}
                                    onClick={() =>
                                      view === "create"
                                        ? setValues({
                                            ...values,
                                            sets: exercise.sets
                                              ? exercise.sets.toString()
                                              : "",
                                            reps: exercise.reps
                                              ? exercise.reps.toString()
                                              : "",
                                            weight: exercise.weight
                                              ? exercise.weight.toString()
                                              : "",
                                          })
                                        : undefined
                                    }
                                    onDoubleClick={
                                      view === "create"
                                        ? () => {
                                            setValues({
                                              ...values,
                                              liftId: exercise.liftId,
                                            })
                                            addExercise({
                                              ...omit(exercise, [
                                                "recordStartDate",
                                                "recordEndDate",
                                              ]),
                                              id: nanoid(),
                                            })
                                          }
                                        : undefined
                                    }
                                  >
                                    &nbsp;
                                    {getPrintout(exercise)}
                                    {k !== exerciseList.length - 1 && ","}
                                  </span>
                                ))}
                              </li>
                            ),
                          )}
                        </ul>
                      </div>
                      <>
                        {deletingId === workout.id ? (
                          <div
                            className={`flex items-center justify-evenly gap-4 ${
                              view !== "list" ? "pt-6 sm:flex-col" : "flex-col"
                            }`}
                          >
                            <button
                              className="text-red-500"
                              onClick={() => handleDelete(workout.id)}
                            >
                              Delete
                            </button>
                            <button onClick={() => setDeletingId(null)}>
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <div
                            className={`flex items-center justify-evenly gap-y-4 ${
                              view !== "list"
                                ? "mt-8 mb-2 sm:flex-col sm:mt-0 sm:mb-0"
                                : "flex-col"
                            }`}
                          >
                            <FontAwesomeIcon
                              icon={faCopy}
                              cursor="pointer"
                              onClick={() =>
                                copyWorkout(
                                  workouts.find(({id}) => id === workout.id) ??
                                    workout,
                                )
                              }
                              size="lg"
                            />
                            <FontAwesomeIcon
                              className={
                                editingWorkout?.id === workout.id
                                  ? "text-blue-400"
                                  : ""
                              }
                              icon={faPen}
                              cursor="pointer"
                              onClick={() =>
                                setEditingWorkout(
                                  editingWorkout?.id === workout.id
                                    ? null
                                    : workouts.find(
                                        ({id}) => id === workout.id,
                                      ) ?? workout,
                                )
                              }
                              size="lg"
                            />
                            <FontAwesomeIcon
                              icon={faTrash}
                              cursor="pointer"
                              onClick={() => handleDeleteClick(workout.id)}
                              size="lg"
                            />
                          </div>
                        )}
                      </>
                    </div>
                  ))
                ) : (
                  <div className="my-6">
                    {workouts.length ? (
                      <div>
                        <p className="text-lg font-bold text-red-500">
                          No results
                        </p>
                        <button
                          className="py-1 px-2 mt-2 rounded-md border"
                          onClick={clearFilters}
                        >
                          Clear Filters
                        </button>
                      </div>
                    ) : (
                      <p>You haven't added any workouts yet</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  /**
   * Handles form change events, ensuring valid values
   */
  function onChange({
    target: {inputMode, name, value},
  }: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setErrorMsg("")
    if (inputMode === "numeric") {
      value = value.replace(/\D/g, "")
      if (
        (["reps", "sets"].includes(name) && value.length > 3) ||
        (name === "weight" && value.length > 4)
      ) {
        return
      }
    }
    setValues({...values, [name]: value})
  }

  /**
   * Attempts to add the current exercise to the routine
   */
  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const exercise = createNewExercise(values)
    if (exercise) {
      addExercise(exercise)
    } else {
      showError("Invalid exercise")
    }
  }

  /**
   * Shows an error for a short interval
   */
  function showError(text: string) {
    setErrorMsg(text)
    setTimeout(() => {
      setErrorMsg("")
    }, 3000)
  }

  /**
   * Handles changes to the routine to ensure it is valid and keep data in sync
   */
  function updateRoutine(newRoutine: Workout["routine"]) {
    const routine = eliminateRedundancy(newRoutine)
    if (!editingWorkout) {
      localRoutine.set(routine)
    }
    setRoutine(routine)
    setView("create")
  }

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
   * Adds a new exercise to the routine
   */
  function addExercise(newExercise: Exercise) {
    updateRoutine([...routine, newExercise])
  }

  /**
   * Removes an exercise from the routine
   */
  function deleteExercise(exerciseId: string) {
    updateRoutine(routine.filter(({id}) => id !== exerciseId))
  }

  /**
   * Handles the user dropping an exercise after dragging it
   */
  function handleDragEnd({destination, source, draggableId}: DropResult) {
    if (destination && destination.index !== source.index) {
      const exerciseIds = routine.map(({id}) => id)
      exerciseIds.splice(source.index, 1)
      exerciseIds.splice(destination.index, 0, draggableId)
      const reorderedRoutine = []
      for (const exerciseId of exerciseIds) {
        for (const exercise of routine) {
          if (exercise.id === exerciseId) {
            reorderedRoutine.push(exercise)
            break
          }
        }
      }
      updateRoutine(reorderedRoutine)
    }
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
    if (submitting) {
      return
    }
    deleteWorkout(id)
  }

  /**
   * Toggles the filters section
   */
  function handleFiltersClick() {
    if (view === "filters") {
      setView(editingWorkout ? "create" : "list")
    } else {
      setView("filters")
    }
  }

  /**
   * Toggles the new workout section
   */
  function handleNewWorkoutClick() {
    if (view === "create" && !editingWorkout) {
      setView("list")
    } else {
      setView("create")
    }
  }

  /**
   * Clears everything to return to default state
   */
  function resetState() {
    updateRoutine(localRoutine.get() ?? [])
    setValues(defaultValues)
    setEditingWorkout(null)
    setView("list")
  }

  /**
   * Copies a workout to the clipboard
   */
  function copyToClipboard(workout: Workout) {
    navigator.clipboard?.writeText(
      `${getWorkoutName(workout.nameId)}
${getDateText(workout.date)}
${groupExercisesByLift(workout.routine)
  .map(
    exerciseList =>
      `${getLiftName(exerciseList[0].liftId)}: ${exerciseList
        .map(exercise => getPrintout(exercise))
        .join(", ")}`,
  )
  .join("\n")}
`,
    )
  }

  /**
   * Gets the lift name which corresponds to an ID
   */
  function getLiftName(liftId: string) {
    return liftNames.find(({id}) => id === liftId)?.text ?? ""
  }

  /**
   * Gets the workout name which corresponds to an ID
   */
  function getWorkoutName(nameId: string) {
    return workoutNames.find(({id}) => id === nameId)?.text ?? ""
  }

  /**
   * Briefly shows an error
   */
  function showWorkoutError(text: string) {
    setWorkoutError(text)
    setTimeout(() => {
      setWorkoutError("")
    }, 3000)
  }

  /**
   * Saves the workout the user has been creating or editing
   */
  async function handleSave() {
    if (submitting) {
      return
    }
    if (!date) {
      showWorkoutError("Invalid date")
      return
    }
    if (routine.length === 0) {
      showWorkoutError("Invalid workout")
      return
    }

    const newWorkout = {
      date,
      nameId,
      routine,
      userId,
    }
    const {id, ...originalWorkout} = editingWorkout ?? {}

    if ("date" in originalWorkout) {
      originalWorkout.date = originalWorkout.date.split("T")[0]
      if (isEqual(originalWorkout, newWorkout)) {
        resetState()
        return
      }
    }

    setSubmitting(true)
    if (id) {
      updateWorkout({...newWorkout, id})
    } else {
      addWorkout(newWorkout)
    }
  }

  /**
   * Clears all the workout filters, displaying all workouts
   */
  function clearFilters() {
    setAppliedFilters(filters)
    setFilteredWorkouts(workouts)
    setPersistentAlert(null)
  }

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
