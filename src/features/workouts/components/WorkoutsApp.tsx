import {
  faChevronCircleLeft,
  faCirclePlus,
  faCopy,
  faFilter,
  faPen,
  faTable,
  faTrash,
  faX,
} from "@fortawesome/free-solid-svg-icons"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import classNames from "classnames"
import isEqual from "lodash/isEqual"
import omit from "lodash/omit"
import sortBy from "lodash/sortBy"
import {nanoid} from "nanoid"
import React from "react"
import {
  DragDropContext,
  Draggable,
  DropResult,
  Droppable,
} from "react-beautiful-dnd"
import {WorkoutsTable} from "~/features/workouts/components/WorkoutsTable"
import {Button, Checkbox, IconButton} from "~/shared/components/CTA"
import Navbar from "~/shared/components/Navbar"
import {useAlerts} from "~/shared/context/AlertContext"
import {
  getDateText,
  getLiftName,
  getWorkoutName,
} from "~/shared/functions/parsers"
import {useAddWorkout} from "~/shared/hooks/useAddWorkout"
import {useDeleteWorkout} from "~/shared/hooks/useDeleteWorkout"
import {useMutating} from "~/shared/hooks/useMutating"
import {useUpdateEvent} from "~/shared/hooks/useUpdateEvent"
import {useUpdateWorkout} from "~/shared/hooks/useUpdateWorkout"
import {StorageService} from "~/shared/services/StorageService"
import {Exercise, Session, Workout} from "~/shared/utils/models"
import {today} from "../constants"
import {
  createNewExercise,
  eliminateRedundancy,
  getPrintout,
  groupExercisesByLift,
} from "../functions"

/**
 * Allows the user to view, filter, and update their workouts
 */
export function WorkoutsApp({filters, profile, workouts}: Session) {
  const {liftNames, userId, workoutNames} = profile
  const activeWorkoutNames = sortBy(
    workoutNames.filter(n => !n.isHidden),
    "text",
  )
  const activeLiftNames = sortBy(
    liftNames.filter(n => !n.isHidden),
    "text",
  )
  const localRoutine = new StorageService(`wip-routine_${userId}`)

  const {showAlert, setPersistentAlert} = useAlerts()

  const getConfig = (action: "deleted" | "saved" | "updated") => ({
    onSuccess() {
      if (action === "saved") {
        updateRoutine([])
      }
      resetState()
      showAlert({
        text: `Workout ${action}`,
        type: "success",
      })
    },
  })
  const {mutate: addWorkout} = useAddWorkout(getConfig("saved"))
  const {mutate: deleteWorkout} = useDeleteWorkout(getConfig("deleted"))
  const {mutate: updateWorkout} = useUpdateWorkout(getConfig("updated"))
  const {mutating} = useMutating({key: "session"})

  const defaultValues = {
    date: today,
    liftId: activeLiftNames[0].id,
    nameId: activeWorkoutNames[0].id,
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

  const [editingWorkout, setEditingWorkout] = React.useState<Workout | null>(
    null,
  )

  const [view, setView] = React.useState<
    "list" | "table" | "filters" | "create"
  >(workouts.length > 0 ? "list" : "create")
  const [appliedFilters, setAppliedFilters] = React.useState(filters)
  const [filteredWorkouts, setFilteredWorkouts] = React.useState(workouts)

  const [previousFilters, setPreviousFilters] = React.useState(filters)
  if (previousFilters !== filters) {
    setPreviousFilters(filters)
    setAppliedFilters(filters)
  }

  const [dragging, setDragging] = React.useState(false)

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (view === "table") {
    return (
      <WorkoutsTable
        {...{
          clearFilters,
          filteredWorkouts,
          profile,
        }}
        hideWorkoutsTable={() => setView("list")}
      />
    )
  }

  return (
    <div className="flex min-h-screen flex-col justify-between lg:flex-row-reverse lg:justify-end">
      <div className="w-full lg:flex lg:flex-col">
        <div
          className={classNames(
            "mx-auto flex w-full items-center justify-between px-4 pt-6 pb-2 text-lg md:max-w-2xl",
            view === "list" ? "xs:px-6" : "sm:px-6",
          )}
        >
          {view === "list" ? (
            <>
              <IconButton
                className="text-blue-600 dark:text-blue-400"
                icon={<FontAwesomeIcon icon={faCirclePlus} />}
                onClick={handleNewWorkoutClick}
                text="Create"
              />
              <div className="flex gap-10">
                {workouts.length > 0 && (
                  <>
                    <IconButton
                      icon={<FontAwesomeIcon icon={faFilter} />}
                      onClick={handleFiltersClick}
                      text="Filters"
                    />
                    <IconButton
                      icon={<FontAwesomeIcon icon={faTable} />}
                      onClick={() => setView("table")}
                      text="Table"
                    />
                  </>
                )}
              </div>
            </>
          ) : (
            <>
              <h1 className="text-lg">
                {view === "create"
                  ? `${editingWorkout ? "Edit" : "New"} Workout`
                  : "Filters"}
              </h1>
              {editingWorkout ? (
                <Button onClick={resetState} variant="danger">
                  Discard Changes
                </Button>
              ) : (
                <IconButton
                  icon={<FontAwesomeIcon icon={faChevronCircleLeft} />}
                  onClick={() => setView("list")}
                  text="Hide"
                />
              )}
            </>
          )}
        </div>
        <div className="mx-auto flex h-full max-h-[calc(100dvh-116px)] w-screen justify-center border-t border-slate-700 md:max-h-[calc(100dvh-148px)] md:max-w-2xl md:rounded-lg md:border lg:max-h-[calc(100dvh-96px)]">
          {view !== "list" && (
            <div className="flex flex-grow border-r border-slate-700">
              <div className="flex w-40 max-w-7xl flex-col xs:w-56 sm:w-64 md:w-72">
                <div className="overflow-hidden">
                  <div className="h-full overflow-y-auto py-6 px-4 sm:px-6">
                    {view === "filters" ? (
                      <div>
                        <h4 className="text-xl">Exercise Name</h4>
                        <div className="mt-4 mb-10 grid gap-4">
                          {sortBy(appliedFilters.liftIds, ({id}) =>
                            getLiftName(id, liftNames),
                          ).map(({checked, id}) => (
                            <Checkbox
                              key={id}
                              onChange={e =>
                                updateWorkoutsFilter(e.target.value, "liftId")
                              }
                              text={getLiftName(id, liftNames)}
                              value={id}
                              {...{checked}}
                            />
                          ))}
                        </div>
                        <h4 className="text-xl">Workout Name</h4>
                        <div className="mt-4 mb-10 grid gap-4">
                          {sortBy(appliedFilters.nameIds, ({id}) =>
                            getWorkoutName(id, workoutNames),
                          ).map(({checked, id}) => (
                            <Checkbox
                              key={id}
                              onChange={e =>
                                updateWorkoutsFilter(e.target.value, "nameId")
                              }
                              text={getWorkoutName(id, workoutNames)}
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
                          <div className="mt-3 flex flex-col gap-3">
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
                                  updateWorkoutsFilter(
                                    e.target.value,
                                    "endDate",
                                  )
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <DragDropContext
                        onDragEnd={handleDragEnd}
                        onDragStart={() => setDragging(true)}
                      >
                        <form className="flex h-40 flex-col" {...{onSubmit}}>
                          <Droppable droppableId="ExerciseForm">
                            {(
                              {
                                droppableProps,
                                innerRef: droppableRef,
                                placeholder,
                              },
                              {isDraggingOver},
                            ) => (
                              <div ref={droppableRef} {...droppableProps}>
                                {dragging ? (
                                  <div
                                    className={classNames(
                                      "grid h-36 place-items-center rounded-lg border-2 border-dashed border-blue-700 p-2 text-center text-blue-700",
                                      isDraggingOver
                                        ? "scale-105 border-blue-800 bg-blue-50 text-blue-800"
                                        : "mb-2 bg-white",
                                    )}
                                  >
                                    Drop here to edit
                                  </div>
                                ) : (
                                  <>
                                    <div>
                                      <label
                                        className="sr-only"
                                        htmlFor="exerciseName"
                                      >
                                        Exercise Name
                                      </label>
                                      <select
                                        id="exerciseName"
                                        name="liftId"
                                        value={liftId}
                                        {...{onChange}}
                                      >
                                        {activeLiftNames.map(({text, id}) => (
                                          <option key={id} value={id}>
                                            {text}
                                          </option>
                                        ))}
                                      </select>
                                    </div>
                                    <div className="flex flex-shrink gap-1">
                                      {[
                                        {
                                          label: "Sets",
                                          name: "sets",
                                          value: sets,
                                        },
                                        {
                                          label: "Reps",
                                          name: "reps",
                                          value: reps,
                                        },
                                        {
                                          label: "Weight",
                                          name: "weight",
                                          value: weight,
                                        },
                                      ].map(({label, ...field}, i) => (
                                        <div key={i}>
                                          <label
                                            className="text-sm"
                                            htmlFor={label}
                                          >
                                            {label}
                                          </label>
                                          <input
                                            autoFocus={
                                              i === 0 && routine.length === 0
                                            }
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
                                      <div className="flex items-center justify-between gap-3">
                                        <Button
                                          className="flex-grow"
                                          type="submit"
                                          variant="secondary"
                                        >
                                          Enter
                                        </Button>
                                        {(sets || reps || weight) && (
                                          <Button
                                            className="mx-auto"
                                            onClick={() =>
                                              setValues({
                                                ...defaultValues,
                                                date,
                                                nameId,
                                                liftId,
                                              })
                                            }
                                          >
                                            Clear
                                          </Button>
                                        )}
                                      </div>
                                      {errorMsg && (
                                        <p className="text-center text-sm text-red-500">
                                          {errorMsg}
                                        </p>
                                      )}
                                    </div>
                                  </>
                                )}
                                <div className="h-0 w-0">{placeholder}</div>
                              </div>
                            )}
                          </Droppable>
                        </form>
                        {routine.length > 0 && (
                          <div>
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
                                      {(
                                        {
                                          draggableProps,
                                          dragHandleProps,
                                          innerRef: draggableRef,
                                        },
                                        {draggingOver},
                                      ) => (
                                        <li
                                          className={classNames(
                                            "flex items-center justify-between gap-2 py-2",
                                            draggingOver === "ExerciseForm" &&
                                              "rounded-lg border border-blue-900 bg-white px-2 text-blue-900",
                                          )}
                                          ref={draggableRef}
                                          {...draggableProps}
                                        >
                                          <span
                                            className="text-lg leading-tight"
                                            {...dragHandleProps}
                                          >
                                            {`${getLiftName(
                                              exercise.liftId,
                                              liftNames,
                                            )}: ${getPrintout(
                                              omit(exercise, [
                                                "recordEndDate",
                                                "recordStartDate",
                                              ]),
                                            )}`}
                                          </span>
                                          {draggingOver !== "ExerciseForm" && (
                                            <IconButton
                                              icon={
                                                <FontAwesomeIcon icon={faX} />
                                              }
                                              onClick={() =>
                                                deleteExercise(exercise.id)
                                              }
                                            />
                                          )}
                                        </li>
                                      )}
                                    </Draggable>
                                  ))}
                                  {placeholder}
                                </ul>
                              )}
                            </Droppable>
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
                              {activeWorkoutNames.map(({id, text}) => (
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
                          <div className="mt-2 flex items-center justify-between gap-3">
                            <Button
                              className="flex-grow"
                              onClick={handleSave}
                              variant="primary"
                            >
                              Save
                            </Button>
                            {routine.length > 0 && (
                              <Button
                                className="mx-auto"
                                type="button"
                                onClick={() => updateRoutine([])}
                              >
                                Reset
                              </Button>
                            )}
                          </div>
                          {workoutError && (
                            <p className="text-center text-sm text-red-500">
                              {workoutError}
                            </p>
                          )}
                        </div>
                        <div className="mt-4 flex w-full justify-center">
                          {editingWorkout ? (
                            <Button onClick={resetState} variant="danger">
                              Discard Changes
                            </Button>
                          ) : (
                            <Button
                              onClick={() => {
                                updateRoutine([])
                                resetState()
                              }}
                              variant="danger"
                            >
                              Discard
                            </Button>
                          )}
                        </div>
                      </DragDropContext>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
          <div className="flex w-full flex-grow">
            <div className="flex w-full flex-1 flex-col">
              <div className="overflow-hidden">
                <div
                  className={classNames(
                    "h-full overflow-y-auto overflow-x-hidden  px-4",
                    view === "list" ? "xs:px-6" : "sm:px-6",
                  )}
                >
                  {filteredWorkouts.length ? (
                    filteredWorkouts.map((workout, i) => {
                      const workoutName = workoutNames.find(
                        n => n.id === workout.id,
                      )
                      return (
                        <div
                          key={workout.id}
                          className={classNames(
                            "justify-between gap-6 border-slate-700 py-6 sm:gap-10",
                            i > 0 && "border-t",
                            editingWorkout?.id === workout.id && "italic",
                            view === "list" ? "flex" : "sm:flex",
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
                                  onClick={
                                    view === "create" && !workoutName?.isHidden
                                      ? () => {
                                          setValues({
                                            ...values,
                                            nameId: workout.nameId,
                                          })
                                        }
                                      : undefined
                                  }
                                >
                                  {getWorkoutName(workout.nameId, workoutNames)}
                                </span>
                              </h1>
                              <h2 className="text-md mt-2 leading-tight">
                                <span
                                  className={classNames(
                                    view === "create" && "cursor-pointer",
                                  )}
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
                              </h2>
                            </div>
                            <ul>
                              {groupExercisesByLift(workout.routine).map(
                                (exerciseList, j) => {
                                  const [{liftId}] = exerciseList
                                  const liftName = liftNames.find(
                                    ({id}) => id === liftId,
                                  )
                                  return (
                                    <li key={j} className="mt-4 flex flex-wrap">
                                      <span
                                        className={classNames(
                                          "text-lg leading-tight",
                                          view === "create" &&
                                            !liftName?.isHidden &&
                                            "cursor-pointer",
                                        )}
                                        onClick={
                                          view === "create" &&
                                          !liftName?.isHidden
                                            ? () => {
                                                setValues({
                                                  ...values,
                                                  liftId,
                                                })
                                              }
                                            : undefined
                                        }
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
                                            view === "create" &&
                                            !liftName?.isHidden
                                              ? () => {
                                                  setValues({
                                                    ...values,
                                                    liftId,
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
                                  )
                                },
                              )}
                            </ul>
                          </div>
                          {view !== "filters" && (
                            <>
                              {deletingId === workout.id ? (
                                <div
                                  className={classNames(
                                    "flex items-center justify-evenly gap-4",
                                    view === "create"
                                      ? "flex-col"
                                      : "pt-6 sm:flex-col",
                                  )}
                                >
                                  <Button
                                    onClick={() => handleDelete(workout.id)}
                                    variant="danger"
                                  >
                                    Delete
                                  </Button>
                                  <Button onClick={() => setDeletingId(null)}>
                                    Cancel
                                  </Button>
                                </div>
                              ) : (
                                <div
                                  className={classNames(
                                    "flex justify-evenly gap-y-4",
                                    view === "create"
                                      ? "mt-8 mb-2 items-center sm:mt-0 sm:mb-0 sm:flex-col sm:items-end"
                                      : "flex-col items-end",
                                  )}
                                >
                                  <IconButton
                                    aria-label="Copy this workout's name and exercises"
                                    icon={<FontAwesomeIcon icon={faCopy} />}
                                    onClick={() =>
                                      copyWorkout(
                                        workouts.find(
                                          ({id}) => id === workout.id,
                                        ) ?? workout,
                                      )
                                    }
                                    side="left"
                                    text="Copy"
                                    textClass={
                                      view === "create" ? "max-sm:sr-only" : ""
                                    }
                                  />
                                  <IconButton
                                    aria-label="Edit this workout"
                                    className={classNames(
                                      editingWorkout?.id === workout.id &&
                                        "text-lg text-blue-600 dark:text-blue-400",
                                    )}
                                    icon={<FontAwesomeIcon icon={faPen} />}
                                    onClick={() =>
                                      setEditingWorkout(
                                        editingWorkout?.id === workout.id
                                          ? null
                                          : workouts.find(
                                              ({id}) => id === workout.id,
                                            ) ?? workout,
                                      )
                                    }
                                    side="left"
                                    text="Edit"
                                    textClass={
                                      view === "create" ? "max-sm:sr-only" : ""
                                    }
                                  />
                                  <IconButton
                                    aria-label="Delete this workout"
                                    icon={<FontAwesomeIcon icon={faTrash} />}
                                    onClick={() =>
                                      handleDeleteClick(workout.id)
                                    }
                                    side="left"
                                    text="Delete"
                                    textClass={
                                      view === "create" ? "max-sm:sr-only" : ""
                                    }
                                  />
                                </div>
                              )}
                            </>
                          )}
                        </div>
                      )
                    })
                  ) : (
                    <div className="my-6">
                      {workouts.length ? (
                        <div className="flex flex-wrap items-center gap-4">
                          <p className="text-lg font-bold text-red-500">
                            No results
                          </p>
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
        </div>
      </div>
      <Navbar />
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
    setDragging(false)
    const exerciseIds = routine.map(({id}) => id)
    if (destination?.droppableId === "ExerciseForm") {
      const exercise = routine[source.index]
      exerciseIds.splice(source.index, 1)
      setValues({
        ...values,
        liftId: exercise.liftId ?? activeLiftNames[0].id,
        sets: exercise.sets ? exercise.sets.toString() : "",
        reps: exercise.reps ? exercise.reps.toString() : "",
        weight: exercise.weight ? exercise.weight.toString() : "",
      })
    } else if (destination && destination.index !== source.index) {
      exerciseIds.splice(source.index, 1)
      exerciseIds.splice(destination.index, 0, draggableId)
    }
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
    if (mutating) {
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
    if (mutating) {
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
