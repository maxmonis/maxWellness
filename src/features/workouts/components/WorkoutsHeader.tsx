import {
  faArrowLeft,
  faCirclePlus,
  faFilter,
  faTable,
} from "@fortawesome/free-solid-svg-icons"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {useRouter} from "next/router"
import {IconButton} from "~/shared/components/CTA"
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
  const router = useRouter()
  return (
    <div className="mx-auto flex h-14 w-full items-end px-4 pb-2 sm:px-6">
      {view === "list" ? (
        <>
          <div className="flex w-full items-end justify-between md:hidden">
            <IconButton
              color="blue"
              icon={<FontAwesomeIcon icon={faCirclePlus} />}
              onClick={() => changeView("create")}
              text="Create"
            />
            {workouts.length > 0 && (
              <div className="flex gap-6">
                <IconButton
                  icon={<FontAwesomeIcon icon={faFilter} />}
                  onClick={() => changeView("filters")}
                  text="Filters"
                />
                <IconButton
                  icon={<FontAwesomeIcon icon={faTable} />}
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
          {!editingWorkout && workouts.length > 0 && (
            <IconButton
              aria-label="go back"
              className="mr-3 grid h-7 w-7 place-items-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
              icon={<FontAwesomeIcon icon={faArrowLeft} />}
              onClick={() => {
                if (history.length > 1) router.back()
                else router.replace("/")
              }}
            />
          )}
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
