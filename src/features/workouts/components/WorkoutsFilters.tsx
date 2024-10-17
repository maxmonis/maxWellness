import { Checkbox } from "@/components/Checkbox"
import { Label } from "@/components/ui/label"
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select"
import { Session } from "@/features/session/utils/models"
import {
	getExerciseNameText,
	getWorkoutNameText,
} from "@/features/settings/utils/parsers"
import { getDateText } from "@/utils/parsers"
import sortBy from "lodash/sortBy"
import * as React from "react"

/**
 * Allows the user to filter workouts by name, date, etc.
 */
export function WorkoutsFilters({
	appliedFilters,
	filters,
	exerciseNames,
	setAppliedFilters,
	setFilteredWorkouts,
	workoutNames,
	workouts,
}: {
	appliedFilters: typeof filters
	clearFilters: () => void
	filters: Session["filters"]
	exerciseNames: Session["exerciseNames"]
	setAppliedFilters: React.Dispatch<React.SetStateAction<typeof filters>>
	setFilteredWorkouts: React.Dispatch<React.SetStateAction<typeof workouts>>
	workoutNames: Session["workoutNames"]
	workouts: Session["workouts"]
}) {
	if (workouts.length === 0) {
		return (
			<div>
				<h2 className="font-bold">No filters available</h2>
			</div>
		)
	}

	return (
		<div>
			<h2 className="font-bold">Exercise Name</h2>
			<ul className="mb-8 mt-3 flex flex-col gap-3">
				{sortBy(appliedFilters.liftIds, ({ id }) =>
					getExerciseNameText(id, exerciseNames),
				).map(({ checked, id }) => (
					<li key={id} translate="no">
						<Checkbox
							label={getExerciseNameText(id, exerciseNames)}
							onCheckedChange={() => {
								updateWorkoutsFilter(id, "nameId")
							}}
							{...{ checked }}
						/>
					</li>
				))}
			</ul>
			<h2 className="font-bold">Workout Name</h2>
			<ul className="mb-8 mt-3 flex flex-col gap-3">
				{sortBy(appliedFilters.nameIds, ({ id }) =>
					getWorkoutNameText(id, workoutNames),
				).map(({ checked, id }) => (
					<li key={id} translate="no">
						<Checkbox
							label={getWorkoutNameText(id, workoutNames)}
							onCheckedChange={() => {
								updateWorkoutsFilter(id, "nameId")
							}}
							{...{ checked }}
						/>
					</li>
				))}
			</ul>
			<h2 className="font-bold">Workout Date</h2>
			<div className="mb-2 mt-4">
				<Checkbox
					checked={appliedFilters.newestFirst}
					key="newestFirst"
					label="Newest First"
					onCheckedChange={() => {
						updateWorkoutsFilter("newestFirst", "newestFirst")
					}}
				/>
				<div className="mt-3 flex flex-col gap-3">
					<div>
						<Label htmlFor="startDate">Start date:</Label>
						<Select
							name="startDate"
							onValueChange={startDate => {
								updateWorkoutsFilter(startDate, "startDate")
							}}
							value={appliedFilters.workoutDates.startDate}
						>
							<SelectTrigger>
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								{filters.workoutDates.allDates
									.filter(d => d <= appliedFilters.workoutDates.endDate!)
									.map(date => (
										<SelectItem key={date} value={date}>
											{getDateText(date)}
										</SelectItem>
									))}
							</SelectContent>
						</Select>
					</div>
					<div>
						<Label htmlFor="endDate">End date:</Label>
						<Select
							name="endDate"
							onValueChange={endDate => {
								updateWorkoutsFilter(endDate, "endDate")
							}}
							value={appliedFilters.workoutDates.endDate}
						>
							<SelectTrigger>
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								{filters.workoutDates.allDates
									.filter(d => d >= appliedFilters.workoutDates.startDate!)
									.map(date => (
										<SelectItem key={date} value={date}>
											{getDateText(date)}
										</SelectItem>
									))}
							</SelectContent>
						</Select>
					</div>
				</div>
			</div>
		</div>
	)

	/**
	 * Toggles or updates the value of a workouts filter after a user event
	 */
	function updateWorkoutsFilter(
		clickedFilter: string,
		filterType: "nameId" | "nameId" | "startDate" | "endDate" | "newestFirst",
	) {
		const updatedFilters = updateFilters()
		setAppliedFilters(updatedFilters)
		const updatedWorkouts = filterWorkouts()
		setFilteredWorkouts(updatedWorkouts)

		/**
		 * Updates the workout filters based on a user action
		 */
		function updateFilters() {
			const { nameIds, workoutDates, liftIds, newestFirst } = appliedFilters
			switch (filterType) {
				case "nameId":
					return {
						...appliedFilters,
						nameIds: nameIds.map(nameId =>
							nameId.id === clickedFilter
								? { ...nameId, checked: !nameId.checked }
								: nameId,
						),
					}
				case "nameId":
					return {
						...appliedFilters,
						liftIds: liftIds.map(nameId =>
							nameId.id === clickedFilter
								? { ...nameId, checked: !nameId.checked }
								: nameId,
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
				case "newestFirst":
					return {
						...appliedFilters,
						newestFirst: !newestFirst,
					}
				default:
					return appliedFilters
			}
		}

		/**
		 * @returns a list of workouts which reflect the current filters (if any)
		 */
		function filterWorkouts() {
			const { workoutDates, nameIds, liftIds, newestFirst } = updatedFilters
			const filteredWorkouts = workouts
				.flatMap(workout =>
					workout.date >= workoutDates.startDate! &&
					workout.date <= workoutDates.endDate! &&
					(!nameIds.some(({ checked }) => checked) ||
						nameIds.find(({ id }) => id === workout.nameId)?.checked)
						? {
								...workout,
								routine: !liftIds.some(({ checked }) => checked)
									? workout.routine
									: workout.routine.filter(
											({ nameId }) =>
												liftIds.find(({ id }) => id === nameId)?.checked,
									  ),
						  }
						: [],
				)
				.filter(workout => workout.routine.length > 0)
			return newestFirst ? filteredWorkouts : filteredWorkouts.reverse()
		}
	}
}
