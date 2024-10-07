import { ResponsiveDialog } from "@/components/ReponsiveDialog"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
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
import { useToast } from "@/hooks/use-toast"
import { useSession } from "@/hooks/useSession"
import { cn } from "@/lib/utils"
import { Exercise, Session, Workout } from "@/utils/models"
import { getLiftNameText } from "@/utils/parsers"
import { Cross1Icon } from "@radix-ui/react-icons"
import { useIsMutating } from "@tanstack/react-query"
import isEqual from "lodash/isEqual"
import omit from "lodash/omit"
import React from "react"
import {
	DragDropContext,
	Draggable,
	DropResult,
	Droppable,
} from "react-beautiful-dnd"
import { useAddWorkout } from "../hooks/useAddWorkout"
import { useUpdateWorkout } from "../hooks/useUpdateWorkout"
import { createNewExercise, getPrintout } from "../utils/functions"

/**
 * Allows the user to edit an existing workout or create a new one
 */
export function WorkoutsForm({
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
}: {
	activeLiftNames: typeof liftNames
	activeWorkoutNames: Session["profile"]["workoutNames"]
	defaultValues: typeof values
	editingWorkout: Workout | null
	liftNames: Session["profile"]["liftNames"]
	resetState: () => void
	routine: Workout["routine"]
	updateRoutine: (newRoutine: typeof routine) => void
	userId: string
	setValues: React.Dispatch<React.SetStateAction<typeof values>>
	values: Record<
		"date" | "liftId" | "nameId" | "reps" | "sets" | "weight",
		string
	>
}) {
	const { date, liftId, nameId, reps, sets, weight } = values
	const [dragging, setDragging] = React.useState(false)

	const { session } = useSession()
	const { toast } = useToast()
	const getConfig = (action: "saved" | "updated") => ({
		onSuccess() {
			if (action === "saved") {
				updateRoutine([])
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
			<form className="mt-1 flex h-40 flex-col" {...{ onSubmit }}>
				<Droppable droppableId="ExerciseForm">
					{(
						{ droppableProps, innerRef: droppableRef, placeholder },
						{ isDraggingOver },
					) => (
						<div ref={droppableRef} {...droppableProps}>
							{dragging ? (
								<div
									className={cn(
										"grid h-36 place-items-center rounded-lg border-2 border-dashed p-2 text-center",
										isDraggingOver ? "scale-105" : "mb-2",
									)}
								>
									Drop here to edit
								</div>
							) : (
								<>
									<div className="mb-1">
										<Select
											onValueChange={liftId => {
												setValues({ ...values, liftId })
											}}
											name="liftId"
											value={liftId}
										>
											<SelectTrigger translate="no">
												<SelectValue />
											</SelectTrigger>
											<SelectContent>
												<SelectGroup>
													<SelectLabel>Exercise Name</SelectLabel>
													{activeLiftNames.map(({ id, text }) => (
														<SelectItem key={id} translate="no" value={id}>
															{text}
														</SelectItem>
													))}
												</SelectGroup>
											</SelectContent>
										</Select>
									</div>
									<div className="flex flex-shrink gap-1">
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
										].map(({ label, ...field }, i) => (
											<div className="w-full" key={i}>
												<Label
													className="text-sm"
													htmlFor={label}
													{...(label !== "Weight" && { translate: "no" })}
												>
													{label}
												</Label>
												<Input
													autoFocus={i === 0 && routine.length === 0}
													className={cn(
														"flex flex-shrink xs:pl-3",
														field.value.length < 3 ? "pl-2" : "pl-1",
													)}
													id={label}
													inputMode="numeric"
													pattern="\d*"
													{...{ onChange }}
													{...field}
												/>
											</div>
										))}
									</div>
									<div className="mt-2">
										<div className="flex items-center justify-between gap-3">
											<Button
												className="flex-grow"
												type="submit"
												variant="secondary"
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
															nameId,
															liftId,
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
			</form>
			{routine.length > 0 ? (
				<div>
					<Droppable droppableId="ExerciseList">
						{({ droppableProps, innerRef: droppableRef, placeholder }) => (
							<ul className="mt-4" ref={droppableRef} {...droppableProps}>
								{routine.map((exercise, i) => (
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
													"flex items-center justify-between gap-2 py-2",
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
													{`${getLiftNameText(
														exercise.liftId,
														liftNames,
													)}: ${getPrintout(
														omit(exercise, [
															"recordEndDate",
															"recordStartDate",
														]),
													)}`}
												</span>
												{draggingOver !== "ExerciseForm" && (
													<Button
														className="h-5 w-5 rounded-full"
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
					<ResponsiveDialog
						body={
							<>
								<Select
									name="nameId"
									onValueChange={nameId => {
										setValues({ ...values, nameId })
									}}
									value={nameId}
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
							<Button className="w-min" key="cancel" variant="ghost">
								Cancel
							</Button>,
							<Button className="max-sm:w-full" key="save" onClick={handleSave}>
								Save
							</Button>,
						]}
						description="Please select the name and date of this workout"
						title="Save Workout"
						trigger={
							<Button className="mt-6 w-full" loading={isAdding || isUpdating}>
								Save
							</Button>
						}
					/>
					<div className="mx-auto mt-4 flex justify-center">
						{editingWorkout ? (
							<Button onClick={resetState} variant="ghost">
								Discard Changes
							</Button>
						) : (
							Boolean(session?.workouts.length) && (
								<Button
									onClick={() => {
										updateRoutine([])
										resetState()
									}}
									variant="ghost"
								>
									Discard
								</Button>
							)
						)}
					</div>
				</div>
			) : (
				<p className="pt-2 text-sm">
					Add exercises using the form above
					{Boolean(session?.workouts.length) &&
						" or by clicking existing ones in the list to the right"}
					. Each exercise must include either a weight or at least one rep. You
					can drag and drop to edit the list.
				</p>
			)}
		</DragDropContext>
	)

	/**
	 * Attempts to add the current exercise to the routine
	 */
	function onSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault()
		const exercise = createNewExercise(values)
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
	 * Adds a new exercise to the routine
	 */
	function addExercise(newExercise: Exercise) {
		updateRoutine([...routine, newExercise])
	}

	/**
	 * Removes an exercise from the routine
	 */
	function deleteExercise(exerciseId: string) {
		updateRoutine(routine.filter(({ id }) => id !== exerciseId))
	}

	/**
	 * Handles the user dropping an exercise after dragging it
	 */
	function handleDragEnd({ destination, source, draggableId }: DropResult) {
		setDragging(false)
		const exerciseIds = routine.map(({ id }) => id)
		if (destination?.droppableId === "ExerciseForm") {
			const exercise = routine[source.index]
			exerciseIds.splice(source.index, 1)
			setValues({
				...values,
				liftId: exercise.liftId ?? activeLiftNames[0].id,
				sets: exercise.sets ? exercise.sets.toString() : "",
				reps: exercise.reps ? exercise.reps.toString() : "",
				weight: exercise.weight ? exercise.weight.toString() : "",
			})
		} else if (destination && destination.index !== source.index) {
			exerciseIds.splice(source.index, 1)
			exerciseIds.splice(destination.index, 0, draggableId)
		}
		const reorderedRoutine: Array<Exercise> = []
		for (const exerciseId of exerciseIds) {
			for (const exercise of routine) {
				if (exercise.id === exerciseId) {
					reorderedRoutine.push(exercise)
					break
				}
			}
		}
		updateRoutine(reorderedRoutine)
	}

	/**
	 * Saves the workout the user has been creating or editing
	 */
	async function handleSave() {
		if (mutating) {
			return
		}
		const newWorkout = {
			date: date.split("T")[0],
			nameId,
			routine,
			userId,
		}
		const { id, ...originalWorkout } = editingWorkout ?? {}
		if ("date" in originalWorkout) {
			originalWorkout.date = originalWorkout.date.split("T")[0]
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
