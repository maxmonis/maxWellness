import { Form } from "@/components/Form"
import { Input } from "@/components/Input"
import { ResponsiveDialog } from "@/components/ReponsiveDialog"
import { Button, buttonVariants } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Label } from "@/components/ui/label"
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select"
import { useSession } from "@/features/session/hooks/useSession"
import { Session } from "@/features/session/utils/models"
import { getExerciseNameText } from "@/features/settings/utils/parsers"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"
import {
	DragDropContext,
	Draggable,
	DropResult,
	Droppable,
} from "@hello-pangea/dnd"
import { Cross1Icon } from "@radix-ui/react-icons"
import { useIsMutating } from "@tanstack/react-query"
import isEqual from "lodash/isEqual"
import omit from "lodash/omit"
import Link from "next/link"
import * as React from "react"
import { useAddWorkout } from "../hooks/useAddWorkout"
import { useUpdateWorkout } from "../hooks/useUpdateWorkout"
import { createNewExercise, getPrintout } from "../utils/functions"
import { Exercise, Workout } from "../utils/models"

/**
 * Allows the user to edit an existing workout or create a new one
 */
export function WorkoutsForm({
	activeExerciseNames,
	activeWorkoutNames,
	defaultValues,
	editingWorkout,
	exerciseNames,
	resetState,
	exercises,
	setValues,
	updateExercises,
	userId,
	values,
}: {
	activeExerciseNames: typeof exerciseNames
	activeWorkoutNames: Session["workoutNames"]
	defaultValues: typeof values
	editingWorkout: Workout | null
	exerciseNames: Session["exerciseNames"]
	resetState: () => void
	exercises: Workout["exercises"]
	updateExercises: (newExercises: typeof exercises) => void
	userId: string
	setValues: React.Dispatch<React.SetStateAction<typeof values>>
	values: Record<
		"date" | "exerciseNameId" | "workoutNameId" | "reps" | "sets" | "weight",
		string
	>
}) {
	const { date, exerciseNameId, workoutNameId, reps, sets, weight } = values
	const [dragging, setDragging] = React.useState(false)

	const { session } = useSession()
	const { toast } = useToast()
	const getConfig = (action: "saved" | "updated") => ({
		onSuccess() {
			if (action === "saved") {
				updateExercises([])
			}
			resetState()
			toast({ title: `Workout ${action}` })
		},
	})
	const { isPending: isAdding, mutate: addWorkout } = useAddWorkout(
		getConfig("saved"),
	)
	const { isPending: isUpdating, mutate: updateWorkout } = useUpdateWorkout(
		getConfig("updated"),
	)
	const mutationCount = useIsMutating()
	const mutating = mutationCount > 0

	return (
		<DragDropContext
			onDragEnd={handleDragEnd}
			onDragStart={() => {
				setDragging(true)
			}}
		>
			<Form className="flex h-44 flex-col sm:h-32" {...{ onSubmit }}>
				<Droppable droppableId="ExerciseForm">
					{(
						{ droppableProps, innerRef: droppableRef, placeholder },
						{ isDraggingOver },
					) => (
						<div ref={droppableRef} {...droppableProps}>
							{dragging ? (
								<div
									className={cn(
										"grid h-36 place-items-center rounded-lg border-2 border-dashed p-2 text-center sm:h-28",
										isDraggingOver ? "scale-105" : "mb-2",
									)}
								>
									Drop here to edit
								</div>
							) : (
								<>
									<div className="mb-4 grid gap-x-2 gap-y-1 sm:grid-cols-2">
										<div>
											<Label aria-hidden className="max-sm:hidden">
												Exercise
											</Label>
											<Select
												onValueChange={exerciseNameId => {
													setValues({ ...values, exerciseNameId })
												}}
												name="exerciseNameId"
												value={exerciseNameId}
											>
												<SelectTrigger translate="no">
													<SelectValue />
												</SelectTrigger>
												<SelectContent>
													<SelectGroup>
														<SelectLabel className="sm:sr-only">
															Exercise
														</SelectLabel>
														{activeExerciseNames.map(({ id, text }) => (
															<SelectItem key={id} translate="no" value={id}>
																{text}
															</SelectItem>
														))}
														{activeExerciseNames.length === 0 && (
															<Link
																className={cn(
																	buttonVariants({ variant: "ghost" }),
																)}
																href="/settings"
															>
																Create New Exercise Name
															</Link>
														)}
													</SelectGroup>
												</SelectContent>
											</Select>
										</div>
										<div className="flex flex-shrink gap-2">
											{[
												{
													label: "Sets",
													name: "sets",
													value: sets,
												},
												{
													label: "Reps",
													name: "reps",
													value: reps,
												},
												{
													label: "Weight",
													name: "weight",
													value: weight,
												},
											].map(({ label, ...field }) => (
												<Input
													className="w-full"
													id={label}
													inputMode="numeric"
													key={label}
													label={label}
													onChange={onChange}
													pattern="\d*"
													{...(label !== "Weight" && {
														labelProps: { translate: "no" as const },
													})}
													{...field}
												/>
											))}
										</div>
									</div>
									<div>
										<div className="flex items-center justify-between gap-4">
											<Button
												className="flex-grow"
												type="submit"
												variant="outline"
											>
												Enter
											</Button>
											{(sets || reps || weight) && (
												<Button
													className="mx-auto"
													onClick={() => {
														setValues({
															...defaultValues,
															date,
															exerciseNameId,
															workoutNameId,
														})
													}}
													variant="ghost"
												>
													Reset
												</Button>
											)}
										</div>
									</div>
								</>
							)}
							<div className="h-0 w-0">{placeholder}</div>
						</div>
					)}
				</Droppable>
			</Form>
			{exercises.length > 0 ? (
				<div>
					<Droppable droppableId="ExerciseList">
						{({ droppableProps, innerRef: droppableRef, placeholder }) => (
							<ul ref={droppableRef} {...droppableProps}>
								{exercises.map((exercise, i) => (
									<Draggable
										draggableId={exercise.id}
										index={i}
										key={exercise.id}
									>
										{(
											{
												draggableProps,
												dragHandleProps,
												innerRef: draggableRef,
											},
											{ draggingOver },
										) => (
											<li
												className={cn(
													"flex items-center justify-between gap-2",
													draggingOver === "ExerciseForm" &&
														"rounded-lg border bg-foreground px-2 text-background",
												)}
												ref={draggableRef}
												{...draggableProps}
											>
												<span
													className="overflow-hidden text-ellipsis leading-tight"
													{...dragHandleProps}
													translate="no"
												>
													{`${getExerciseNameText(
														exercise.nameId,
														exerciseNames,
													)}: ${getPrintout(
														omit(exercise, [
															"recordEndDate",
															"recordStartDate",
														]),
													)}`}
												</span>
												{draggingOver !== "ExerciseForm" && (
													<Button
														className="rounded-full"
														onClick={() => {
															deleteExercise(exercise.id)
														}}
														size="icon"
														variant="ghost"
													>
														<Cross1Icon />
													</Button>
												)}
											</li>
										)}
									</Draggable>
								))}
								{placeholder}
							</ul>
						)}
					</Droppable>
					<div className="mt-4 flex items-center justify-between gap-4">
						<ResponsiveDialog
							body={
								<>
									<Select
										name="workoutNameId"
										onValueChange={workoutNameId => {
											setValues({ ...values, workoutNameId })
										}}
										value={workoutNameId}
									>
										<SelectTrigger translate="no">
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											<SelectGroup>
												<SelectLabel>Workout Name</SelectLabel>
												{activeWorkoutNames.map(({ id, text }) => (
													<SelectItem key={id} translate="no" value={id}>
														{text}
													</SelectItem>
												))}
												{activeWorkoutNames.length === 0 && (
													<Link
														className={cn(buttonVariants({ variant: "ghost" }))}
														href="/settings?view=workouts"
													>
														Create New Workout Name
													</Link>
												)}
											</SelectGroup>
										</SelectContent>
									</Select>
									<Label className="sr-only" htmlFor="workoutDate">
										Workout Date
									</Label>
									<Calendar
										className="mx-auto mt-4 w-min"
										id="workoutDate"
										mode="single"
										selected={new Date(date.split("T")[0] + "T00:00:00")}
										onSelect={newDate => {
											if (newDate) {
												setValues({
													...values,
													date: newDate.toISOString(),
												})
											}
										}}
									/>
								</>
							}
							buttons={[
								{
									children: "Save",
									key: "save",
									onClick: handleSave,
								},
								{
									children: "Continue Editing",
									key: "continue",
									variant: "ghost",
								},
							]}
							description="Please select the name and date of this workout"
							title="Save Workout"
							trigger={
								<Button className="flex-grow" loading={isAdding || isUpdating}>
									Save
								</Button>
							}
						/>
						{Boolean(session?.workouts.length) && (
							<Button
								onClick={() => {
									if (!editingWorkout) updateExercises([])
									resetState()
								}}
								variant="ghost"
							>
								Discard
							</Button>
						)}
					</div>
				</div>
			) : (
				<>
					<p className="mt-2">
						Each exercise must include either a weight or at least one rep. You
						can drag and drop to edit.
					</p>
					{session?.workouts.length === 0 && (
						<>
							<p className="my-4">
								Visit the Settings page if you&apos;d like to update the names
								you&apos;ll use for your exercises and workouts. The About page
								contains an overview of the site with helpful videos. Additional
								features will become available once you&apos;ve added at least
								one workout.
							</p>
							<p>Thanks for signing up and welcome to maxWellness!</p>
						</>
					)}
				</>
			)}
		</DragDropContext>
	)

	/**
	 * Attempts to add the current exercise to the exercises
	 */
	function onSubmit() {
		const exercise = createNewExercise({ ...values, nameId: exerciseNameId })
		if (exercise) {
			addExercise(exercise)
		}
	}

	/**
	 * Handles form change events, ensuring valid values
	 */
	function onChange({
		target: { inputMode, name, value },
	}: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
		if (inputMode === "numeric") {
			value = value.replace(/\D/g, "")
			if (
				(["reps", "sets"].includes(name) && value.length > 3) ||
				(name === "weight" && value.length > 4)
			) {
				return
			}
		}
		setValues({ ...values, [name]: value })
	}

	/**
	 * Adds a new exercise to the exercises
	 */
	function addExercise(newExercise: Exercise) {
		updateExercises([...exercises, newExercise])
	}

	/**
	 * Removes an exercise from the exercises
	 */
	function deleteExercise(exerciseNameId: string) {
		updateExercises(exercises.filter(({ id }) => id !== exerciseNameId))
	}

	/**
	 * Handles the user dropping an exercise after dragging it
	 */
	function handleDragEnd({ destination, source, draggableId }: DropResult) {
		setDragging(false)
		const exerciseNameIds = exercises.map(({ id }) => id)
		if (destination?.droppableId === "ExerciseForm") {
			const exercise = exercises[source.index]!
			exerciseNameIds.splice(source.index, 1)
			setValues({
				...values,
				exerciseNameId: exercise.nameId ?? activeExerciseNames[0]!.id,
				sets: exercise.sets ? exercise.sets.toString() : "",
				reps: exercise.reps ? exercise.reps.toString() : "",
				weight: exercise.weight ? exercise.weight.toString() : "",
			})
		} else if (destination && destination.index !== source.index) {
			exerciseNameIds.splice(source.index, 1)
			exerciseNameIds.splice(destination.index, 0, draggableId)
		}
		const reorderedExercises: Array<Exercise> = []
		for (const exerciseNameId of exerciseNameIds) {
			for (const exercise of exercises) {
				if (exercise.id === exerciseNameId) {
					reorderedExercises.push(exercise)
					break
				}
			}
		}
		updateExercises(reorderedExercises)
	}

	/**
	 * Saves the workout the user has been creating or editing
	 */
	async function handleSave() {
		if (mutating) {
			return
		}
		const newWorkout = {
			date: date.split("T")[0]!,
			nameId: workoutNameId,
			exercises,
			userId,
		}
		const { id, ...originalWorkout } = editingWorkout ?? {}
		if ("date" in originalWorkout) {
			originalWorkout.date = originalWorkout.date.split("T")[0]!
			if (isEqual(originalWorkout, newWorkout)) {
				resetState()
				return
			}
		}
		if (id) {
			updateWorkout({ ...newWorkout, id })
		} else {
			addWorkout(newWorkout)
		}
	}
}
