import {
  faCirclePlus,
  faFilter,
  faTable,
} from "@fortawesome/free-solid-svg-icons"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {BackButton, IconButton} from "~/shared/components/CTA"
import {Workout} from "~/shared/utils/models"
import {useWorkoutView} from "../workoutsHooks"

/**
 * Displays the title of the selected view
 * and allows the user to choose a new one
 */
export function WorkoutsHeader({
  editingWorkout,
  workouts,
}: {
  editingWorkout: Workout | null
  workouts: Array<Workout>
}) {
  const {changeView, view} = useWorkoutView()
  return (
    <div className="mx-auto flex h-14 w-full items-end px-4 pb-2 sm:px-6">
      {view === "list" ? (
        <>
          <div className="flex w-full items-end justify-between md:hidden">
            <IconButton
              color="blue"
              icon={
                <FontAwesomeIcon
                  className="max-xs:text-lg"
                  icon={faCirclePlus}
                  size="lg"
                />
              }
              onClick={() => changeView("create")}
              text="Create"
            />
            {workouts.length > 0 && (
              <div className="flex gap-6">
                <IconButton
                  icon={
                    <FontAwesomeIcon
                      className="max-xs:text-lg"
                      icon={faFilter}
                      size="lg"
                    />
                  }
                  onClick={() => changeView("filters")}
                  text="Filters"
                />
                <IconButton
                  icon={
                    <FontAwesomeIcon
                      className="max-xs:text-lg"
                      icon={faTable}
                      size="lg"
                    />
                  }
                  onClick={() => changeView("table")}
                  text="Table"
                />
              </div>
            )}
          </div>
          <h1 className="text-xl font-bold max-md:hidden">Workouts</h1>
        </>
      ) : (
        <>
          {workouts.length > 0 && <BackButton />}
          <h1 className="text-xl font-bold">
            {view === "create"
              ? `${editingWorkout ? "Edit" : "New"} Workout`
              : "Filters"}
          </h1>
        </>
      )}
    </div>
  )
}
