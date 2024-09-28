import {
	faClipboard,
	faCopy,
	faEllipsis,
	faPen,
	faTrash,
} from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import classNames from "classnames"
import omit from "lodash/omit"
import { nanoid } from "nanoid"
import React from "react"
import { Button, IconButton } from "~/components/CTA"
import { useAlerts } from "~/context/AlertContext"
import { useKeypress } from "~/hooks/useKeypress"
import { useOutsideClick } from "~/hooks/useOutsideClick"
import { Exercise, Session, Workout } from "~/utils/models"
import {
	getDateText,
	getLiftNameText,
	getWorkoutNameText,
} from "~/utils/parsers"
import { getPrintout, groupExercisesByLift } from "../utils/functions"
import { View } from "../utils/models"

/**
 * A workout from the list view, along with a menu
 * which allows copying, editing, or deleting
 */
export function WorkoutsListItem({
	addExercise,
	deletingId,
	editingWorkout,
	handleDelete,
	handleDeleteClick,
	liftNames,
	setDeletingId,
	setEditingWorkout,
	setValues,
	updateRoutine,
	values,
	view,
	workout,
	workoutNames,
	workouts,
}: {
	addExercise: (newExercise: Exercise) => void
	deletingId: string | null
	editingWorkout: Workout | null
	handleDelete: (id: string) => void
	handleDeleteClick: (id: string) => void
	liftNames: Session["profile"]["liftNames"]
	setDeletingId: React.Dispatch<React.SetStateAction<typeof deletingId>>
	setEditingWorkout: React.Dispatch<React.SetStateAction<typeof editingWorkout>>
	setValues: React.Dispatch<React.SetStateAction<typeof values>>
	updateRoutine: (newRoutine: Array<Exercise>) => void
	values: Record<
		"date" | "liftId" | "nameId" | "reps" | "sets" | "weight",
		string
	>
	view: View
	workout: Workout
	workouts: Array<Workout>
	workoutNames: Session["profile"]["workoutNames"]
}) {
	const { showAlert } = useAlerts()
	const [open, setOpen] = React.useState(false)
	const ref = useOutsideClick(() => setOpen(false))
	useKeypress("Escape", () => setOpen(false))
	const workoutName = workoutNames.find(n => n.id === workout.id)
	const workoutNameText = getWorkoutNameText(workout.nameId, workoutNames)
	return (
		<div
			key={workout.id}
			className={classNames(
				"h-min justify-between gap-6 p-4 pb-6 last:mb-2 sm:gap-10 sm:p-6",
				editingWorkout?.id === workout.id && "italic",
				view === "list" ? "flex" : "sm:flex",
			)}
		>
			<div className="w-full">
				<div className="mb-4 flex justify-between">
					<div>
						<h1 className="text-lg leading-tight sm:text-xl">
							<span
								className={classNames(
									workoutNameText.split(" ").some(word => word.length > 9) &&
										"break-all",
									view === "create" &&
										!workoutName?.isHidden &&
										"cursor-pointer",
								)}
								{...(view === "create" &&
									!workoutName?.isHidden && {
										onClick: () =>
											setValues({
												...values,
												nameId: workout.nameId,
											}),
										title: "Click to copy",
									})}
							>
								{workoutNameText}
							</span>
						</h1>
						<h2 className="mt-2 leading-tight">
							<span
								className={classNames(
									view === "create"
										? "cursor-pointer"
										: "text-gray-600 dark:text-gray-400",
								)}
								{...(view === "create" && {
									onClick: () =>
										setValues({
											...values,
											date: workout.date.split("T")[0],
										}),
									title: "Click to copy",
								})}
							>
								{getDateText(workout.date)}
							</span>
						</h2>
					</div>
					{view === "list" && deletingId !== workout.id && (
						<div className="relative" {...{ ref }}>
							<IconButton
								aria-label="Toggle menu"
								className={classNames(
									"flex items-center justify-center rounded-lg border-2 p-1 hover:border-slate-300 dark:hover:border-slate-700",
									open
										? "border-slate-300 dark:border-slate-700"
										: "border-transparent",
								)}
								icon={<FontAwesomeIcon icon={faEllipsis} size="lg" />}
								onClick={() => setOpen(!open)}
							/>
							{open && (
								<dialog className="absolute -left-28 top-8 z-10 flex flex-col gap-4 rounded-lg border border-slate-700 p-4">
									<div className="flex flex-col justify-evenly gap-y-4">
										<IconButton
											aria-label="Duplicate this workout's name and exercises"
											icon={<FontAwesomeIcon icon={faCopy} />}
											onClick={() => {
												const copiedRoutine = workouts
													.find(({ id }) => id === workout.id)
													?.routine.map(exercise => ({
														...exercise,
														id: nanoid(),
													}))
												if (copiedRoutine) {
													updateRoutine(copiedRoutine)
													setValues({ ...values, nameId: workout.nameId })
													setOpen(false)
												} else {
													showAlert({
														text: "Duplication failed",
														type: "danger",
													})
												}
											}}
											text="Duplicate"
										/>
										{navigator?.clipboard && (
											<IconButton
												aria-label="Copy this workout's name and exercises to clipboard"
												icon={<FontAwesomeIcon icon={faClipboard} />}
												onClick={() => {
													navigator.clipboard
														.writeText(
															getClipboardText(
																workouts.find(({ id }) => id === workout.id) ??
																	workout,
															),
														)
														.then(() => {
															showAlert({
																text: "Copied to clipboard",
																type: "success",
															})
															setOpen(false)
														})
												}}
												text="Clipboard"
											/>
										)}
										<IconButton
											aria-label="Edit this workout"
											className="text-lg"
											icon={<FontAwesomeIcon icon={faPen} />}
											onClick={() =>
												setEditingWorkout(
													editingWorkout?.id === workout.id
														? null
														: workouts.find(({ id }) => id === workout.id) ??
																workout,
												)
											}
											text="Edit"
										/>
										<IconButton
											aria-label="Delete this workout"
											icon={<FontAwesomeIcon icon={faTrash} />}
											onClick={() => handleDeleteClick(workout.id)}
											text="Delete"
										/>
									</div>
								</dialog>
							)}
						</div>
					)}
				</div>
				<ul>
					{groupExercisesByLift(workout.routine).map((exerciseList, j) => {
						const [{ liftId }] = exerciseList
						const liftName = liftNames.find(({ id }) => id === liftId)
						const liftNameText = getLiftNameText(liftId, liftNames)
						return (
							<li key={j} className="mt-2 flex flex-wrap">
								<span
									className={classNames(
										"leading-tight sm:text-lg",
										liftNameText.split(" ").some(word => word.length > 9) &&
											"break-all",
										view === "create" &&
											!liftName?.isHidden &&
											"cursor-pointer",
									)}
									{...(view === "create" &&
										!liftName?.isHidden && {
											onClick: () =>
												setValues({
													...values,
													liftId,
												}),
											title: "Click to copy",
										})}
								>
									{liftNameText}:
								</span>
								{exerciseList.map((exercise, k) => (
									<span
										key={k}
										className={classNames(
											"leading-tight sm:text-lg",
											view === "create" &&
												!liftName?.isHidden &&
												"cursor-pointer",
										)}
										{...(view === "create" && {
											onClick() {
												setValues({
													...values,
													liftId: !liftName?.isHidden ? liftId : values.liftId,
													sets: exercise.sets ? exercise.sets.toString() : "",
													reps: exercise.reps ? exercise.reps.toString() : "",
													weight: exercise.weight
														? exercise.weight.toString()
														: "",
												})
												addExercise({
													...omit(exercise, [
														"recordStartDate",
														"recordEndDate",
													]),
													id: nanoid(),
												})
											},
											title: "Click to copy",
										})}
									>
										&nbsp;
										{getPrintout(exercise)}
										{k !== exerciseList.length - 1 && ","}
									</span>
								))}
							</li>
						)
					})}
				</ul>
			</div>
			{view === "list" && deletingId === workout.id && (
				<div className="flex flex-col items-center justify-evenly gap-4">
					<Button onClick={() => handleDelete(workout.id)} variant="danger">
						Delete
					</Button>
					<Button onClick={() => setDeletingId(null)}>Cancel</Button>
				</div>
			)}
		</div>
	)

	/**
	 * Gets workout text we will copy to clipboard
	 */
	function getClipboardText(workout: Workout) {
		return `${getWorkoutNameText(workout.nameId, workoutNames)}
${getDateText(workout.date)}
${groupExercisesByLift(workout.routine)
	.map(
		exerciseList =>
			`${getLiftNameText(exerciseList[0].liftId, liftNames)}: ${exerciseList
				.map(getPrintout)
				.join(", ")}`,
	)
	.join("\n")}`
	}
}
