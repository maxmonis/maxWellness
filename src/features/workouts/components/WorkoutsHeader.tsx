import {
  faChevronCircleLeft,
  faCirclePlus,
  faFilter,
  faTable,
} from "@fortawesome/free-solid-svg-icons"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {IconButton} from "~/shared/components/CTA"
import {Workout} from "~/shared/utils/models"
import {View} from "../workoutsModels"

export function WorkoutsHeader({
  changeView,
  editingWorkout,
  view,
  workouts,
}: {
  changeView: (view: View) => void
  editingWorkout: Workout | null
  view: View
  workouts: Array<Workout>
}) {
  return (
    <div className="mx-auto flex h-14 w-full items-end justify-between px-4 pb-2 md:px-6">
      {view === "list" ? (
        <>
          <IconButton
            color="blue"
            icon={<FontAwesomeIcon icon={faCirclePlus} />}
            onClick={() => changeView("create")}
            text="Create"
          />
          <div className="flex gap-6">
            {workouts.length > 0 && (
              <>
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
              </>
            )}
          </div>
        </>
      ) : (
        <>
          <h1 className="text-xl font-bold">
            {view === "create"
              ? `${editingWorkout ? "Edit" : "New"} Workout`
              : "Filters"}
          </h1>
          {!editingWorkout && workouts.length > 0 && (
            <IconButton
              color="blue"
              icon={<FontAwesomeIcon icon={faChevronCircleLeft} />}
              onClick={() => changeView("list")}
              text="Hide"
            />
          )}
        </>
      )}
    </div>
  )
}
