import sortBy from "lodash/sortBy"
import React from "react"
import { useAlerts } from "~/context/AlertContext"
import { useUpdateEvent } from "~/hooks/useUpdateEvent"
import { StorageService } from "~/services/StorageService"
import { Exercise, Session, Workout } from "~/utils/models"
import { useWorkoutView } from "../hooks/useWorkoutView"
import { today } from "../utils/constants"
import { eliminateRedundancy } from "../utils/functions"
import { WorkoutsFilters } from "./WorkoutsFilters"
import { WorkoutsForm } from "./WorkoutsForm"
import { WorkoutsHeader } from "./WorkoutsHeader"
import { WorkoutsList } from "./WorkoutsList"
import { WorkoutsTable } from "./WorkoutsTable"

/**
 * Allows the user to view, filter, and update their workouts
 */
export function WorkoutsApp({ filters, profile, workouts }: Session) {
	const { liftNames, userId, workoutNames } = profile
	const activeWorkoutNames = sortBy(
		workoutNames.filter(n => !n.isHidden),
		"text",
	)
	const activeLiftNames = sortBy(
		liftNames.filter(n => !n.isHidden),
		"text",
	)

	const { changeView, defaultView, view } = useWorkoutView()
	const { setPersistentAlert } = useAlerts()

	const [editingWorkout, setEditingWorkout] = React.useState<Workout | null>(
		null,
	)

	const localRoutine = new StorageService(`wip-routine_${userId}`)
	const [routine, setRoutine] = React.useState<Workout["routine"]>(
		getLocalRoutine(),
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

	const [appliedFilters, setAppliedFilters] = React.useState(filters)
	const [filteredWorkouts, setFilteredWorkouts] = React.useState(workouts)

	useUpdateEvent(() => {
		if (editingWorkout) {
			updateRoutine(editingWorkout.routine)
			setValues({
				...defaultValues,
				nameId: editingWorkout.nameId,
				date: editingWorkout.date.split("T")[0],
			})
		}
	}, [editingWorkout])

	useUpdateEvent(resetState, [workouts])

	useUpdateEvent(() => {
		setRoutine(getLocalRoutine())
	}, [liftNames])

	React.useEffect(() => {
		if (editingWorkout && view !== "create") {
			setEditingWorkout(null)
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [view])

	// eslint-disable-next-line react-hooks/exhaustive-deps
	React.useEffect(() => () => setPersistentAlert(null), [])

	if (view === "table") {
		return (
			<WorkoutsTable
				{...{
					clearFilters,
					filteredWorkouts,
				}}
			/>
		)
	}

	return (
		<div className="min-h-screen">
			<WorkoutsHeader {...{ editingWorkout, workouts }} />
			<div className="mx-auto flex h-full max-h-[calc(100dvh-7rem)] w-full flex-grow justify-center divide-x divide-slate-700 border-t border-slate-700 md:max-h-[calc(100dvh-3.5rem)]">
				{view !== "list" && (
					<div className="flex w-full min-w-[10rem] max-w-xs flex-grow overflow-x-hidden">
						<div className="flex w-full flex-grow flex-col">
							<div className="w-full overflow-hidden max-md:h-full">
								<div className="h-full overflow-y-auto overflow-x-hidden p-4 sm:p-6">
									{view === "filters" ? (
										<WorkoutsFilters
											{...{
												appliedFilters,
												clearFilters,
												filters,
												liftNames,
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
		setRoutine(getLocalRoutine())
		setValues(defaultValues)
		setEditingWorkout(null)
		changeView(defaultView)
	}

	/**
	 * Gets the user's WIP routine (if any) from local storage,
	 * filtering out any exercises whose names are hidden/deleted
	 */
	function getLocalRoutine() {
		const newRoutine = eliminateRedundancy(
			localRoutine.get()?.filter(({ liftId }) => {
				const liftName = liftNames.find(({ id }) => id === liftId)
				return liftName && !liftName.isHidden
			}) ?? [],
		)
		localRoutine.set(newRoutine)
		return newRoutine
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
