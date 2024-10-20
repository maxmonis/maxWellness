import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Session } from "@/features/session/utils/models"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"
import { useIsMutating } from "@tanstack/react-query"
import * as React from "react"
import { useDeleteWorkout } from "../hooks/useDeleteWorkout"
import { Exercise, View, Workout } from "../utils/models"
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
	view,
	workouts,
	...props
}: {
	addExercise: (newExercise: Exercise) => void
	clearFilters: () => void
	editingWorkout: Workout | null
	filteredWorkouts: Array<Workout>
	exerciseNames: Session["exerciseNames"]
	resetState: () => void
	setEditingWorkout: React.Dispatch<React.SetStateAction<typeof editingWorkout>>
	setValues: React.Dispatch<React.SetStateAction<typeof props.values>>
	updateExercises: (newExercises: Array<Exercise>) => void
	values: Record<
		"date" | "exerciseNameId" | "workoutNameId" | "reps" | "sets" | "weight",
		string
	>
	view: Exclude<View, "calendar">
	workouts: Array<Workout>
	workoutNames: Session["workoutNames"]
}) {
	const { toast } = useToast()

	const { mutate: deleteWorkout } = useDeleteWorkout({
		onSuccess() {
			resetState()
			toast({ title: "Workout Deleted" })
		},
	})
	const mutationCount = useIsMutating()
	const mutating = mutationCount > 0

	return (
		<div className="relative flex flex-shrink flex-grow">
			<div className="flex w-full flex-1 flex-col">
				<div className="h-screen overflow-hidden">
					<ScrollArea
						className={cn(
							view === "list"
								? "h-[calc(100dvh-7rem)] md:h-[calc(100dvh-3.5rem)]"
								: "h-[calc(100dvh-6rem)] pb-2",
						)}
					>
						{filteredWorkouts.length ? (
							filteredWorkouts.map(workout => (
								<WorkoutsListItem
									key={workout.id}
									{...{
										editingWorkout,
										handleDelete,
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
											<p>No results</p>
											<Button onClick={clearFilters} variant="outline">
												Clear Filters
											</Button>
										</div>
									</div>
								) : (
									<WorkoutsEmptyState />
								)}
							</>
						)}
					</ScrollArea>
				</div>
			</div>
		</div>
	)

	/**
	 * Deletes a workout
	 */
	async function handleDelete(id: string) {
		if (!mutating) deleteWorkout(id)
	}
}
