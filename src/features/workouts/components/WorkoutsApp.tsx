import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet"
import { ToastAction } from "@/components/ui/toast"
import { useAuth } from "@/features/auth/hooks/useAuth"
import { Session } from "@/features/session/utils/models"
import { useToast } from "@/hooks/use-toast"
import { useUpdateEvent } from "@/hooks/useUpdateEvent"
import { StorageService } from "@/services/StorageService"
import sortBy from "lodash/sortBy"
import { SidebarIcon } from "lucide-react"
import * as React from "react"
import { useWorkoutView } from "../hooks/useWorkoutView"
import { today } from "../utils/constants"
import { countAppliedFilters, eliminateRedundancy } from "../utils/functions"
import { Exercise, Workout } from "../utils/models"
import { WorkoutsCalendar } from "./WorkoutsCalendar"
import { WorkoutsFiltersApp } from "./WorkoutsFiltersApp"
import { WorkoutsForm } from "./WorkoutsForm"
import { WorkoutsHeader } from "./WorkoutsHeader"
import { WorkoutsList } from "./WorkoutsList"

/**
 * Allows the user to view, filter, and update their workouts
 */
export function WorkoutsApp({
	filters,
	exerciseNames,
	workoutNames,
	workouts,
}: Session) {
	const { user } = useAuth()
	const userId = user!.uid
	const activeWorkoutNames = sortBy(
		workoutNames.filter(n => !n.deleted),
		"text",
	)
	const activeExerciseNames = sortBy(
		exerciseNames.filter(n => !n.deleted),
		"text",
	)

	const { changeView, defaultView, view } = useWorkoutView()
	const { toast } = useToast()

	const [editingWorkout, setEditingWorkout] = React.useState<Workout | null>(
		null,
	)

	const localExercises = new StorageService(`exercises_${userId}`)
	const [exercises, setExercises] = React.useState<Array<Exercise>>(
		getLocalExercises(),
	)

	const defaultValues = {
		date: today,
		exerciseNameId: activeExerciseNames[0]?.id ?? "",
		workoutNameId: activeWorkoutNames[0]?.id ?? "",
		reps: "",
		sets: "",
		weight: "",
	}
	const [values, setValues] = React.useState(defaultValues)

	const [filteredWorkouts, setFilteredWorkouts] = React.useState(workouts)
	const [appliedFilters, setAppliedFilters] = React.useState(filters)
	const filtersToastRef = React.useRef<ReturnType<typeof toast> | null>(null)
	useUpdateEvent(() => {
		const count = countAppliedFilters(appliedFilters)
		if (count > 0) {
			filtersToastRef.current = toast({
				action: (
					<ToastAction altText="Clear Filters" onClick={clearFilters}>
						Clear Filters
					</ToastAction>
				),
				duration: Infinity,
				title: `${count} filter${count === 1 ? "" : "s"} applied`,
				...(filteredWorkouts.length === 0 && {
					description: "No results found",
					variant: "destructive",
				}),
			})
		} else {
			removeFiltersToast()
		}
	}, [appliedFilters])

	useUpdateEvent(() => {
		if (editingWorkout) {
			updateExercises(editingWorkout.exercises)
			setValues({
				...defaultValues,
				workoutNameId: editingWorkout.nameId,
				date: editingWorkout.date.split("T")[0]!,
			})
		}
	}, [editingWorkout])

	useUpdateEvent(resetState, [workouts])

	useUpdateEvent(() => {
		setExercises(getLocalExercises())
	}, [exerciseNames])

	React.useEffect(() => {
		if (editingWorkout && view !== "create") {
			setEditingWorkout(null)
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [view])

	React.useEffect(() => {
		return () => {
			clearFilters()
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	if (view === "calendar") {
		return (
			<WorkoutsCalendar
				{...{
					clearFilters,
					filteredWorkouts,
				}}
			/>
		)
	}

	if (view === "create") {
		return (
			<div className="relative h-full w-full lg:max-w-3xl lg:border-r">
				<WorkoutsHeader {...{ editingWorkout, workouts }} />
				{workouts.length > 0 && (
					<Sheet>
						<SheetTrigger asChild>
							<Button
								className="absolute right-4 top-2"
								size="icon"
								variant="ghost"
							>
								<SidebarIcon className="rotate-180" />
							</Button>
						</SheetTrigger>
						<SheetContent className="w-60 px-4">
							<SheetHeader className="border-b pb-4 text-left">
								<SheetTitle>Previous Workouts</SheetTitle>
								<SheetDescription>
									Click exercises to copy them
								</SheetDescription>
							</SheetHeader>
							<WorkoutsList
								addExercise={addExercise}
								clearFilters={clearFilters}
								editingWorkout={editingWorkout}
								filteredWorkouts={filteredWorkouts}
								exerciseNames={exerciseNames}
								resetState={resetState}
								setEditingWorkout={setEditingWorkout}
								setValues={setValues}
								updateExercises={updateExercises}
								values={values}
								view={view}
								workoutNames={workoutNames}
								workouts={workouts}
							/>
						</SheetContent>
					</Sheet>
				)}
				<ScrollArea className="flex h-full max-h-[calc(100dvh-7rem)] w-full flex-grow flex-col border-t md:max-h-[calc(100dvh-3.5rem)]">
					<div className="w-full overflow-hidden max-md:h-full">
						<div className="h-full px-4 pb-6 pt-4 sm:px-6">
							<WorkoutsForm
								activeExerciseNames={activeExerciseNames}
								activeWorkoutNames={activeWorkoutNames}
								defaultValues={defaultValues}
								editingWorkout={editingWorkout}
								exerciseNames={exerciseNames}
								resetState={resetState}
								exercises={exercises}
								setValues={setValues}
								updateExercises={updateExercises}
								userId={userId}
								values={values}
							/>
						</div>
					</div>
				</ScrollArea>
			</div>
		)
	}

	if (view === "filters") {
		return (
			<div className="min-h-screen lg:max-w-3xl lg:border-r">
				<WorkoutsHeader {...{ editingWorkout, workouts }} />
				<ScrollArea className="flex max-h-[calc(100dvh-7rem)] w-full flex-grow flex-col border-t md:max-h-[calc(100dvh-3.5rem)]">
					<div className="w-full overflow-hidden max-md:h-full">
						<div className="h-full px-4 pb-6 pt-4 sm:px-6">
							<WorkoutsFiltersApp
								appliedFilters={appliedFilters}
								clearFilters={clearFilters}
								filteredWorkouts={filteredWorkouts}
								filters={filters}
								exerciseNames={exerciseNames}
								setAppliedFilters={setAppliedFilters}
								setFilteredWorkouts={setFilteredWorkouts}
								workoutNames={workoutNames}
								workouts={workouts}
							/>
						</div>
					</div>
				</ScrollArea>
			</div>
		)
	}

	return (
		<div className="min-h-screen lg:max-w-3xl lg:border-r">
			<WorkoutsHeader {...{ editingWorkout, workouts }} />
			<ScrollArea className="mx-auto flex h-full max-h-[calc(100dvh-7rem)] w-full justify-center border-t md:max-h-[calc(100dvh-3.5rem)]">
				<WorkoutsList
					{...{
						addExercise,
						clearFilters,
						editingWorkout,
						filteredWorkouts,
						exerciseNames,
						resetState,
						setEditingWorkout,
						setValues,
						updateExercises,
						values,
						view,
						workoutNames,
						workouts,
					}}
				/>
			</ScrollArea>
		</div>
	)

	/**
	 * Handles changes to the exercises to ensure it is valid and keep data in sync
	 */
	function updateExercises(newExercises: Workout["exercises"]) {
		const exercises = eliminateRedundancy(newExercises)
		if (!editingWorkout) {
			localExercises.set(exercises)
		}
		setExercises(exercises)
		changeView("create")
	}

	/**
	 * Adds a new exercise to the exercises
	 */
	function addExercise(newExercise: Exercise) {
		updateExercises([...exercises, newExercise])
	}

	/**
	 * Clears everything to return to default state
	 */
	function resetState() {
		clearFilters()
		setExercises(getLocalExercises())
		setValues(defaultValues)
		setEditingWorkout(null)
		changeView(defaultView)
	}

	/**
	 * Gets the user's WIP exercises (if any) from local storage,
	 * filtering out any exercises whose names are hidden/deleted
	 */
	function getLocalExercises() {
		const newExercises = eliminateRedundancy(
			localExercises.get()?.filter(({ nameId }) => {
				const exerciseName = exerciseNames.find(({ id }) => id === nameId)
				return exerciseName && !exerciseName.deleted
			}) ?? [],
		)
		localExercises.set(newExercises)
		return newExercises
	}

	/**
	 * Clears all the workout filters, displaying all workouts
	 */
	function clearFilters() {
		setAppliedFilters(filters)
		setFilteredWorkouts(workouts)
		removeFiltersToast()
	}

	function removeFiltersToast() {
		filtersToastRef.current?.dismiss()
		filtersToastRef.current = null
	}
}
