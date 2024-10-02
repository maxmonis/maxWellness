import { Button, IconButton } from "@/components/CTA"
import { useAlerts } from "@/context/AlertContext"
import { useSession } from "@/hooks/useSession"
import { Exercise, Session, Workout } from "@/utils/models"
import { getLiftNameText } from "@/utils/parsers"
import { faX } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useIsMutating } from "@tanstack/react-query"
import classNames from "classnames"
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
	const [errorMsg, setErrorMsg] = React.useState("")
	const [workoutError, setWorkoutError] = React.useState("")

	const { session } = useSession()
	const { showAlert } = useAlerts()
	const getConfig = (action: "saved" | "updated") => ({
		onSuccess() {
			if (action === "saved") {
				updateRoutine([])
			}
			resetState()
			showAlert({
				text: `Workout ${action}`,
				type: "success",
			})
		},
	})
	const { mutate: addWorkout } = useAddWorkout(getConfig("saved"))
	const { mutate: updateWorkout } = useUpdateWorkout(getConfig("updated"))
	const mutationCount = useIsMutating()
	const mutating = mutationCount > 0

	return (
		<DragDropContext
			onDragEnd={handleDragEnd}
			onDragStart={() => {
				setDragging(true)
			}}
		>
			<form className="flex h-40 flex-col" {...{ onSubmit }}>
				<Droppable droppableId="ExerciseForm">
					{(
						{ droppableProps, innerRef: droppableRef, placeholder },
						{ isDraggingOver },
					) => (
						<div ref={droppableRef} {...droppableProps}>
							{dragging ? (
								<div
									className={classNames(
										"grid h-36 place-items-center rounded-lg border-2 border-dashed border-blue-700 p-2 text-center text-blue-700",
										isDraggingOver
											? "scale-105 border-blue-800 bg-blue-50 text-blue-800"
											: "mb-2 bg-white",
									)}
								>
									Drop here to edit
								</div>
							) : (
								<>
									<div>
										<label className="sr-only" htmlFor="exerciseName">
											Exercise Name
										</label>
										<select
											id="exerciseName"
											name="liftId"
											value={liftId}
											{...{ onChange }}
										>
											{activeLiftNames.map(({ text, id }) => (
												<option key={id} translate="no" value={id}>
													{text}
												</option>
											))}
										</select>
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
											<div key={i}>
												<label
													className="text-sm"
													htmlFor={label}
													{...(label !== "Weight" && { translate: "no" })}
												>
													{label}
												</label>
												<input
													autoFocus={i === 0 && routine.length === 0}
													className={classNames(
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
												>
													Clear
												</Button>
											)}
										</div>
										{errorMsg && (
											<p className="text-center text-sm text-red-500">
												{errorMsg}
											</p>
										)}
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
												className={classNames(
													"flex items-center justify-between gap-2 py-2",
													draggingOver === "ExerciseForm" &&
														"rounded-lg border border-blue-900 bg-white px-2 text-blue-900",
												)}
												ref={draggableRef}
												{...draggableProps}
											>
												<span
													className="overflow-hidden text-ellipsis leading-tight sm:text-lg"
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
													<IconButton
														icon={<FontAwesomeIcon icon={faX} size="sm" />}
														onClick={() => {
															deleteExercise(exercise.id)
														}}
													/>
												)}
											</li>
										)}
									</Draggable>
								))}
								{placeholder}
							</ul>
						)}
					</Droppable>
				</div>
			) : (
				<p className="pt-4">
					Create your workout using the form above
					{session?.workouts.length
						? " and/or by clicking exercises in the list to the right. " +
						  "You can also copy the name or date of an existing workout"
						: ". Valid exercises must include either a weight or at least " +
						  "one rep. You can drag and drop to reorder the list"}
					.
				</p>
			)}
			<div>
				<div className="mt-6">
					<label className="sr-only" htmlFor="workoutName">
						Workout Name
					</label>
					<select
						className="mb-2"
						id="workoutName"
						name="nameId"
						value={nameId}
						{...{ onChange }}
					>
						{activeWorkoutNames.map(({ id, text }) => (
							<option key={id} translate="no" value={id}>
								{text}
							</option>
						))}
					</select>
					<label className="sr-only" htmlFor="workoutDate">
						Workout Date
					</label>
					<input
						id="workoutDate"
						name="date"
						type="date"
						value={date}
						{...{ onChange }}
					/>
				</div>
				<div className="mt-2 flex items-center justify-between gap-3">
					<Button
						className="flex-grow"
						loading={mutating}
						onClick={handleSave}
						variant="primary"
					>
						Save
					</Button>
					{routine.length > 0 && (
						<Button
							className="mx-auto"
							type="button"
							onClick={() => {
								updateRoutine([])
							}}
						>
							Reset
						</Button>
					)}
				</div>
				{workoutError && (
					<p className="text-center text-sm text-red-500">{workoutError}</p>
				)}
			</div>
			<div className="mt-4 flex w-full justify-center">
				{editingWorkout ? (
					<Button onClick={resetState} variant="danger">
						Discard Changes
					</Button>
				) : (
					Boolean(session?.workouts.length) && (
						<Button
							onClick={() => {
								updateRoutine([])
								resetState()
							}}
							variant="danger"
						>
							Discard
						</Button>
					)
				)}
			</div>
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
		} else {
			showError("Invalid exercise")
		}
	}

	/**
	 * Handles form change events, ensuring valid values
	 */
	function onChange({
		target: { inputMode, name, value },
	}: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
		setErrorMsg("")
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
	 * Shows an error for a short interval
	 */
	function showError(text: string) {
		setErrorMsg(text)
		setTimeout(() => {
			setErrorMsg("")
		}, 3000)
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
	 * Briefly shows an error
	 */
	function showWorkoutError(text: string) {
		setWorkoutError(text)
		setTimeout(() => {
			setWorkoutError("")
		}, 3000)
	}

	/**
	 * Saves the workout the user has been creating or editing
	 */
	async function handleSave() {
		if (mutating) {
			return
		}
		if (!date) {
			showWorkoutError("Invalid date")
			return
		}
		if (routine.length === 0) {
			showWorkoutError("Invalid workout")
			return
		}
		const newWorkout = {
			date,
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
