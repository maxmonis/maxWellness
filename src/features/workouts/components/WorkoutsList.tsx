import { Button, IconButton } from "@/components/CTA"
import { useAlerts } from "@/context/AlertContext"
import { Exercise, Session, Workout } from "@/utils/models"
import {
	faChevronCircleLeft,
	faChevronCircleRight,
} from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useIsMutating } from "@tanstack/react-query"
import classNames from "classnames"
import React from "react"
import { useDeleteWorkout } from "../hooks/useDeleteWorkout"
import { View } from "../utils/models"
import { WorkoutsEmptyState } from "./WorkoutsEmptyState"
import { WorkoutsListItem } from "./WorkoutsListItem"

/**
 * Displays a list of the user's workouts, each of which
 * includes a menu for copying, editing, or deleting
 */
export function WorkoutsList({
	clearFilters,
	editingWorkout,
	filteredWorkouts,
	resetState,
	showList,
	toggleHideList,
	view,
	workouts,
	...props
}: {
	addExercise: (newExercise: Exercise) => void
	clearFilters: () => void
	editingWorkout: Workout | null
	filteredWorkouts: Array<Workout>
	liftNames: Session["profile"]["liftNames"]
	resetState: () => void
	setEditingWorkout: React.Dispatch<React.SetStateAction<typeof editingWorkout>>
	setValues: React.Dispatch<React.SetStateAction<typeof props.values>>
	showList: boolean
	toggleHideList?: () => void
	updateRoutine: (newRoutine: Array<Exercise>) => void
	values: Record<
		"date" | "liftId" | "nameId" | "reps" | "sets" | "weight",
		string
	>
	view: Exclude<View, "calendar">
	workouts: Array<Workout>
	workoutNames: Session["profile"]["workoutNames"]
}) {
	const { showAlert } = useAlerts()

	const { mutate: deleteWorkout } = useDeleteWorkout({
		onSuccess() {
			resetState()
			showAlert({
				text: "Workout Deleted",
				type: "success",
			})
		},
	})
	const mutationCount = useIsMutating()
	const mutating = mutationCount > 0

	const [deletingId, setDeletingId] = React.useState<null | string>(null)

	return (
		<div
			className={classNames(
				"relative flex flex-shrink flex-grow",
				showList && "w-full",
			)}
		>
			{showList ? (
				<div className="flex w-full flex-1 flex-col">
					<div className="h-screen overflow-hidden">
						{editingWorkout ? (
							<div>
								<WorkoutsListItem
									{...{
										deletingId,
										editingWorkout,
										handleDelete,
										handleDeleteClick,
										setDeletingId,
										view,
										workouts,
									}}
									{...props}
									workout={editingWorkout}
								/>
							</div>
						) : (
							<div className="flex h-full flex-col divide-y divide-slate-700 overflow-y-auto overflow-x-hidden">
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
												view,
												workout,
												workouts,
											}}
											{...props}
										/>
									))
								) : (
									<>
										{workouts.length ? (
											<div className="p-4 sm:p-6">
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
			) : (
				<div className="h-screen max-h-full w-4" />
			)}
			{toggleHideList && (
				<IconButton
					className="absolute -left-3 top-4"
					icon={
						<FontAwesomeIcon
							className="bg-white text-slate-700 dark:bg-black dark:text-white"
							icon={showList ? faChevronCircleRight : faChevronCircleLeft}
							size="lg"
						/>
					}
					onClick={toggleHideList}
					title={`${showList ? "Hide" : "Show"} workouts`}
				/>
			)}
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
