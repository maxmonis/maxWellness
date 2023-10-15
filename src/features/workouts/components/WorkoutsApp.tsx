import sortBy from "lodash/sortBy"
import {useRouter} from "next/router"
import React from "react"
import {useAlerts} from "~/shared/context/AlertContext"
import {useUpdateEvent} from "~/shared/hooks/useUpdateEvent"
import {StorageService} from "~/shared/services/StorageService"
import {Exercise, Session, Workout} from "~/shared/utils/models"
import {today} from "../workoutsConstants"
import {eliminateRedundancy, isValidView} from "../workoutsFunctions"
import {View} from "../workoutsModels"
import {WorkoutsFilters} from "./WorkoutsFilters"
import {WorkoutsForm} from "./WorkoutsForm"
import {WorkoutsHeader} from "./WorkoutsHeader"
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

  const router = useRouter()
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

  const defaultView = workouts.length > 0 ? "list" : "create"
  const [view, setView] = React.useState<View>(defaultView)
  const [appliedFilters, setAppliedFilters] = React.useState(filters)
  const [filteredWorkouts, setFilteredWorkouts] = React.useState(workouts)

  React.useEffect(() => {
    if (isValidView(router.query.view)) {
      setView(router.query.view)
    } else {
      changeView(defaultView)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.query])

  React.useEffect(() => {
    resetState()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workouts])

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
        hideWorkoutsTable={() => changeView("list")}
      />
    )
  }

  return (
    <div className="min-h-screen">
      <WorkoutsHeader {...{changeView, editingWorkout, view, workouts}} />
      <div className="mx-auto flex h-full max-h-[calc(100dvh-112px)] w-full flex-grow justify-center border-t border-slate-700 md:max-h-[calc(100dvh-56px)] md:px-6">
        {view !== "list" && (
          <div className="flex w-full max-w-xs flex-grow overflow-x-hidden border-slate-700 bg-slate-100 dark:bg-slate-800 max-md:border-r md:my-6 md:mr-6 md:rounded-lg md:border">
            <div className="flex w-full flex-grow flex-col">
              <div className="w-full overflow-hidden max-md:h-full">
                <div className="h-full overflow-y-auto px-4 py-6 sm:px-6">
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
    changeView("create")
  }

  /**
   * Adds a new exercise to the routine
   */
  function addExercise(newExercise: Exercise) {
    updateRoutine([...routine, newExercise])
  }

  /**
   * Clears everything to return to default state
   */
  function resetState() {
    clearFilters()
    updateRoutine(localRoutine.get() ?? [])
    setValues(defaultValues)
    setEditingWorkout(null)
    changeView(defaultView)
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
   * Updates the view
   */
  function changeView(newView: View) {
    router.push(`/?view=${newView}`, undefined, {shallow: true})
    setView(newView)
  }
}
