import { BackButton, IconButton } from "@/components/CTA"
import { Workout } from "@/utils/models"
import {
	faCirclePlus,
	faFilter,
	faTable,
} from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useWorkoutView } from "../hooks/useWorkoutView"

/**
 * Displays the title of the selected view
 * and allows the user to choose a new one
 */
export function WorkoutsHeader({
	editingWorkout,
	loading,
	workouts,
}:
	| {
			editingWorkout: Workout | null
			loading?: never
			workouts: Array<Workout>
	  }
	| {
			editingWorkout?: never
			loading: true
			workouts?: never
	  }) {
	const { changeView, view } = useWorkoutView()
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
						{(loading || workouts.length > 0) && (
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
									onClick={() => changeView("calendar")}
									text="Calendar"
								/>
							</div>
						)}
					</div>
					<h1 className="text-xl font-bold max-md:hidden">Workouts</h1>
				</>
			) : (
				<>
					{(loading || workouts.length > 0) && <BackButton />}
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
