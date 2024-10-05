import { Button } from "@/components/ui/button"
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog"
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"
import { Exercise, Session, Workout } from "@/utils/models"
import {
	getDateText,
	getLiftNameText,
	getWorkoutNameText,
} from "@/utils/parsers"
import {
	ClipboardCopyIcon,
	ClipboardIcon,
	HamburgerMenuIcon,
	Pencil2Icon,
	TrashIcon,
} from "@radix-ui/react-icons"
import omit from "lodash/omit"
import { nanoid } from "nanoid"
import React from "react"
import { getPrintout, groupExercisesByLift } from "../utils/functions"
import { View } from "../utils/models"

/**
 * A workout from the list view, along with a menu
 * which allows copying, editing, or deleting
 */
export function WorkoutsListItem({
	addExercise,
	editingWorkout,
	handleDelete,
	liftNames,
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
	editingWorkout: Workout | null
	handleDelete: (id: string) => void
	liftNames: Session["profile"]["liftNames"]
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
	const { toast } = useToast()
	const workoutName = workoutNames.find(n => n.id === workout.id)
	const workoutNameText = getWorkoutNameText(workout.nameId, workoutNames)
	const buttonRef = React.createRef<HTMLButtonElement>()

	return (
		<div
			key={workout.id}
			className={cn(
				"h-min justify-between gap-6 px-4 pt-4 last:mb-14 sm:gap-10 lg:px-6",
				editingWorkout?.id === workout.id && "italic",
				view === "list" ? "flex pb-6" : "pb-4 sm:flex",
			)}
		>
			<div className="w-full">
				<div className="mb-2 flex justify-between">
					<div
						className={cn(
							"flex w-full gap-x-4 gap-y-1",
							view === "list"
								? "mb-1 flex-col"
								: "mt-1 flex-wrap items-center justify-between",
						)}
					>
						<h1
							className={cn(
								"leading-tight",
								workoutNameText.split(" ").some(word => word.length >= 12) &&
									"break-all",
								view === "list" && "font-bold",
							)}
							translate="no"
						>
							{workoutNameText}
						</h1>
						<small className="leading-tight text-muted-foreground">
							{getDateText(workout.date)}
						</small>
					</div>
					{view === "list" && (
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button
									className="-mr-1.5 max-lg:-mt-1.5"
									size="icon"
									variant="ghost"
								>
									<HamburgerMenuIcon className="h-5 w-5" />
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent>
								<DropdownMenuItem
									className="gap-2"
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
										} else {
											toast({
												title: "Duplication failed",
												variant: "destructive",
											})
										}
									}}
								>
									<ClipboardCopyIcon />
									Duplicate
								</DropdownMenuItem>
								{navigator.clipboard && (
									<DropdownMenuItem
										className="gap-2"
										onClick={() => {
											navigator.clipboard
												.writeText(
													getClipboardText(
														workouts.find(({ id }) => id === workout.id) ??
															workout,
													),
												)
												.then(() => {
													toast({ title: "Copied to clipboard" })
												})
										}}
									>
										<ClipboardIcon />
										Clipboard
									</DropdownMenuItem>
								)}
								<DropdownMenuItem
									className="gap-2"
									onClick={() => {
										setEditingWorkout(
											editingWorkout?.id === workout.id
												? null
												: workouts.find(({ id }) => id === workout.id) ??
														workout,
										)
									}}
								>
									<Pencil2Icon />
									Edit
								</DropdownMenuItem>
								<Dialog
									onOpenChange={open => {
										if (!open) {
											buttonRef.current?.click()
										}
									}}
								>
									<DialogTrigger asChild>
										<Button
											className="w-full cursor-default justify-start gap-2 px-2 py-1.5 font-normal"
											variant="ghost"
										>
											<TrashIcon />
											Delete
										</Button>
									</DialogTrigger>
									<DialogContent className="gap-6">
										<DialogHeader>
											<DialogTitle>Delete workout?</DialogTitle>
											<DialogDescription>
												This action cannot be undone
											</DialogDescription>
										</DialogHeader>
										<DialogFooter className="gap-y-2">
											<DialogClose asChild>
												<Button type="button" variant="ghost">
													Cancel
												</Button>
											</DialogClose>
											<DialogClose asChild>
												<Button
													onClick={() => {
														handleDelete(workout.id)
													}}
													type="button"
													variant="destructive"
												>
													Yes, delete
												</Button>
											</DialogClose>
										</DialogFooter>
									</DialogContent>
								</Dialog>
								<DropdownMenuItem className="hidden">
									<button ref={buttonRef} />
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					)}
				</div>
				<ul>
					{view === "create"
						? workout.routine.map((exercise, i) => {
								const liftName = liftNames.find(
									({ id }) => id === exercise.liftId,
								)
								const liftNameText = getLiftNameText(exercise.liftId, liftNames)
								return (
									<li key={i} className="flex flex-wrap">
										<Button
											className="-ml-4 flex h-auto whitespace-normal text-left leading-tight"
											translate="no"
											variant="ghost"
											{...(liftName?.isHidden
												? { disabled: true }
												: {
														onClick() {
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
											{liftNameText}:&nbsp;
											{getPrintout(exercise)}
										</Button>
									</li>
								)
						  })
						: groupExercisesByLift(workout.routine).map((exerciseList, j) => {
								const [{ liftId }] = exerciseList
								const liftNameText = getLiftNameText(liftId, liftNames)
								return (
									<li key={j} className="mt-2 flex flex-wrap">
										<span
											className={cn(
												"leading-tight",
												liftNameText
													.split(" ")
													.some(word => word.length >= 12) && "break-all",
											)}
											translate="no"
										>
											{liftNameText}:
										</span>
										{exerciseList.map((exercise, k) => (
											<span key={k} className="leading-tight">
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
