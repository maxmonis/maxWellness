import React from "react"
import {Button} from "~/shared/components/CTA"
import {useAlerts} from "~/shared/context/AlertContext"
import {useDeleteWorkout} from "~/shared/hooks/useDeleteWorkout"
import {useMutating} from "~/shared/hooks/useMutating"
import {Exercise, Session, Workout} from "~/shared/utils/models"
import {WorkoutsEmptyState} from "./WorkoutsEmptyState"
import {WorkoutsListItem} from "./WorkoutsListItem"

/**
 * Displays a list of the user's workouts, each of which
 * includes a menu for copying, editing, or deleting
 */
export function WorkoutsList({
  clearFilters,
  editingWorkout,
  filteredWorkouts,
  resetState,
  workouts,
  ...props
}: {
  addExercise: (newExercise: Exercise) => void
  clearFilters: () => void
  editingWorkout: Workout | null
  filteredWorkouts: Workout[]
  liftNames: Session["profile"]["liftNames"]
  resetState: () => void
  setEditingWorkout: React.Dispatch<React.SetStateAction<typeof editingWorkout>>
  setValues: React.Dispatch<React.SetStateAction<typeof props.values>>
  updateRoutine: (newRoutine: Exercise[]) => void
  values: Record<
    "date" | "liftId" | "nameId" | "reps" | "sets" | "weight",
    string
  >
  view: "create" | "filters" | "list"
  workouts: Workout[]
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
    <div className="flex w-full flex-grow">
      <div className="flex w-full flex-1 flex-col">
        <div className="h-screen overflow-hidden">
          {editingWorkout ? (
            <div className="py-6">
              <WorkoutsListItem
                {...{
                  deletingId,
                  editingWorkout,
                  handleDelete,
                  handleDeleteClick,
                  setDeletingId,
                  workouts,
                }}
                {...props}
                workout={editingWorkout}
              />
            </div>
          ) : (
            <div className="flex h-full flex-col gap-4 overflow-y-auto overflow-x-hidden py-4 md:py-6">
              {filteredWorkouts.length ? (
                filteredWorkouts.map(workout => (
                  <WorkoutsListItem
                    key={workout.id}
                    {...{
                      deletingId,
                      editingWorkout,
                      handleDelete,
                      handleDeleteClick,
                      setDeletingId,
                      workout,
                      workouts,
                    }}
                    {...props}
                  />
                ))
              ) : (
                <>
                  {workouts.length ? (
                    <div className="px-4 py-6 md:px-6">
                      <div className="flex flex-wrap items-center gap-4">
                        <p className="text-lg font-bold text-red-500">
                          No results
                        </p>
                        <Button onClick={clearFilters} variant="secondary">
                          Clear Filters
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <WorkoutsEmptyState />
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )

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
}
