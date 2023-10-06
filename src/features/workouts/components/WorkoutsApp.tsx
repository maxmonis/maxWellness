import {
  faChevronCircleLeft,
  faCirclePlus,
  faFilter,
  faTable,
} from "@fortawesome/free-solid-svg-icons"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import classNames from "classnames"
import sortBy from "lodash/sortBy"
import React from "react"
import {IconButton} from "~/shared/components/CTA"
import {useAlerts} from "~/shared/context/AlertContext"
import {StorageService} from "~/shared/services/StorageService"
import {Exercise, Session, Workout} from "~/shared/utils/models"
import {today} from "../constants"
import {eliminateRedundancy} from "../functions"
import {WorkoutsFilters} from "./WorkoutsFilters"
import {WorkoutsForm} from "./WorkoutsForm"
import {WorkoutsList} from "./WorkoutsList"
import {WorkoutsTable} from "./WorkoutsTable"

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

  const {setPersistentAlert} = useAlerts()

  const [editingWorkout, setEditingWorkout] = React.useState<Workout | null>(
    null,
  )

  const localRoutine = new StorageService(`wip-routine_${userId}`)
  const [routine, setRoutine] = React.useState<Workout["routine"]>(
    localRoutine.get() ?? [],
  )

  const defaultValues = {
    date: today,
    liftId: activeLiftNames[0].id,
    nameId: activeWorkoutNames[0].id,
    reps: "",
    sets: "",
    weight: "",
  }
  const [values, setValues] = React.useState(defaultValues)

  const [view, setView] = React.useState<
    "list" | "table" | "filters" | "create"
  >(workouts.length > 0 ? "list" : "create")
  const [appliedFilters, setAppliedFilters] = React.useState(filters)
  const [filteredWorkouts, setFilteredWorkouts] = React.useState(workouts)

  React.useEffect(() => {
    clearFilters()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workouts])

  React.useEffect(() => {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editingWorkout])

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
    <div className="min-h-screen">
      <div
        className={classNames(
          "mx-auto flex h-14 w-full items-end justify-between border-b border-slate-700 px-4 pb-2 text-lg md:max-w-2xl md:rounded-b-lg md:border-x",
          view === "list" ? "xs:px-6" : "sm:px-6 md:hidden",
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
            <h1 className="text-xl">
              {view === "create"
                ? `${editingWorkout ? "Edit" : "New"} Workout`
                : "Filters"}
            </h1>
            {!editingWorkout && (
              <IconButton
                icon={<FontAwesomeIcon icon={faChevronCircleLeft} />}
                onClick={() => setView("list")}
                text="Hide"
              />
            )}
          </>
        )}
      </div>
      <div
        className={classNames(
          "mx-auto flex h-full max-h-[calc(100dvh-112px)] w-screen justify-center md:max-w-2xl md:px-6",
          view === "list"
            ? "lg:max-h-[calc(100dvh-56px)]"
            : "md:max-h-[calc(100dvh-56px)] lg:max-h-screen",
        )}
      >
        {view !== "list" && (
          <div className="flex w-full flex-grow overflow-x-hidden border-slate-700 md:mr-6">
            <div className="flex w-full max-w-7xl flex-grow flex-col">
              <div className="w-full overflow-hidden max-md:h-full md:my-6">
                <div className="h-full overflow-y-auto border-slate-700 px-4 py-6 max-md:border-r sm:px-6 md:rounded-lg md:border">
                  {view === "filters" ? (
                    <WorkoutsFilters
                      {...{
                        appliedFilters,
                        clearFilters,
                        filters,
                        liftNames,
                        resetState,
                        setAppliedFilters,
                        setFilteredWorkouts,
                        workoutNames,
                        workouts,
                      }}
                    />
                  ) : (
                    <WorkoutsForm
                      {...{
                        activeLiftNames,
                        activeWorkoutNames,
                        defaultValues,
                        editingWorkout,
                        liftNames,
                        resetState,
                        routine,
                        setValues,
                        updateRoutine,
                        userId,
                        values,
                      }}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
        <WorkoutsList
          {...{
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
          }}
        />
      </div>
    </div>
  )

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
   * Adds a new exercise to the routine
   */
  function addExercise(newExercise: Exercise) {
    updateRoutine([...routine, newExercise])
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
   * Clears all the workout filters, displaying all workouts
   */
  function clearFilters() {
    setAppliedFilters(filters)
    setFilteredWorkouts(workouts)
    setPersistentAlert(null)
  }
}
