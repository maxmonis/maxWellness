import { ResponsiveDialog } from "@/components/ReponsiveDialog"
import { Textarea } from "@/components/ui/Textarea"
import { Button } from "@/components/ui/button"
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Session } from "@/features/session/utils/models"
import {
	getExerciseNameText,
	getWorkoutNameText,
} from "@/features/settings/utils/parsers"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"
import { getDateText } from "@/utils/parsers"
import {
	ClipboardCopyIcon,
	ClipboardIcon,
	DotsHorizontalIcon,
	FileTextIcon,
	Pencil1Icon,
	Pencil2Icon,
	TrashIcon,
} from "@radix-ui/react-icons"
import omit from "lodash/omit"
import { nanoid } from "nanoid"
import * as React from "react"
import { useUpdateWorkout } from "../hooks/useUpdateWorkout"
import { getPrintout, groupExercisesByLift } from "../utils/functions"
import { Exercise, View, Workout } from "../utils/models"

/**
 * A workout from the list view, along with a menu
 * which allows copying, editing, or deleting
 */
export function WorkoutsListItem({
	addExercise,
	editingWorkout,
	handleDelete,
	exerciseNames,
	setEditingWorkout,
	setValues,
	updateExercises,
	values,
	view,
	workout,
	workoutNames,
	workouts,
}: {
	addExercise: (newExercise: Exercise) => void
	editingWorkout: Workout | null
	handleDelete: (id: string) => void
	exerciseNames: Session["exerciseNames"]
	setEditingWorkout: React.Dispatch<React.SetStateAction<typeof editingWorkout>>
	setValues: React.Dispatch<React.SetStateAction<typeof values>>
	updateExercises: (newExercises: Array<Exercise>) => void
	values: Record<
		"date" | "exerciseNameId" | "workoutNameId" | "reps" | "sets" | "weight",
		string
	>
	view: View
	workout: Workout
	workouts: Array<Workout>
	workoutNames: Session["workoutNames"]
}) {
	const { toast } = useToast()
	const [deleting, setDeleting] = React.useState(false)
	const workoutNameText = getWorkoutNameText(workout.nameId, workoutNames)
	const [isEditingNotes, setIsEditingNotes] = React.useState(false)
	const [notes, setNotes] = React.useState(workout.notes || "")
	const { isPending: isUpdatingWorkout, mutate: updateWorkout } =
		useUpdateWorkout({
			onSuccess() {
				const trimmedNotes = notes.trim()
				workout.notes = trimmedNotes
				setNotes(trimmedNotes)
				setIsEditingNotes(false)
				toast({ title: "Workout notes saved" })
			},
		})

	return (
		<div
			key={workout.id}
			className={cn(
				"h-min justify-between gap-6 border-t first:border-t-0 sm:gap-10",
				view === "list" ? "flex px-4 pb-6 pt-4 sm:px-6" : "py-2 sm:flex",
			)}
		>
			<div className="w-full">
				<div className="mb-2 flex justify-between">
					<div
						className={cn(
							"flex w-full flex-col gap-x-4 gap-y-1",
							view === "list" ? "mb-1" : "mt-1",
						)}
					>
						<h1
							className={cn(
								"leading-tight",
								workoutNameText.split(" ").some(word => word.length >= 15) &&
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
									<span className="sr-only">Open workout menu</span>
									<DotsHorizontalIcon className="h-5 w-5" />
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent>
								<DropdownMenuItem
									className="gap-2"
									onClick={() => {
										const copiedExercises = workouts
											.find(({ id }) => id === workout.id)
											?.exercises.map(exercise => ({
												...exercise,
												id: nanoid(),
											}))
										if (copiedExercises) {
											updateExercises(copiedExercises)
											setValues({ ...values, workoutNameId: workout.nameId })
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
										setIsEditingNotes(true)
									}}
								>
									<FileTextIcon />
									Notes
								</DropdownMenuItem>
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
								<DropdownMenuItem
									className="gap-2"
									onClick={() => {
										setDeleting(true)
									}}
								>
									<TrashIcon />
									Delete
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					)}
				</div>
				<ul>
					{view === "create"
						? workout.exercises.map((exercise, i) => {
								const exerciseName = exerciseNames.find(
									({ id }) => id === exercise.nameId,
								)
								const exerciseNameText = getExerciseNameText(
									exercise.nameId,
									exerciseNames,
								)
								return (
									<li key={i} className="flex flex-wrap">
										<Button
											className="ml-px mr-3 flex h-auto whitespace-normal px-2 text-left leading-tight"
											translate="no"
											variant="ghost"
											{...(exerciseName?.deleted
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
												  })}
										>
											{exerciseNameText}:&nbsp;
											{getPrintout(exercise)}
										</Button>
									</li>
								)
						  })
						: groupExercisesByLift(workout.exercises).map((exerciseList, j) => {
								const { nameId } = exerciseList[0]!
								const exerciseNameText = getExerciseNameText(
									nameId,
									exerciseNames,
								)
								return (
									<li key={j} className="mt-2 flex flex-wrap">
										<span
											className={cn(
												"leading-tight",
												exerciseNameText
													.split(" ")
													.some(word => word.length >= 15) && "break-all",
											)}
											translate="no"
										>
											{exerciseNameText}:
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
				{view === "list" && workout.notes && (
					<div className="mt-4 flex items-start gap-1">
						<button
							onClick={() => {
								setIsEditingNotes(true)
							}}
						>
							<Pencil1Icon className="h-7 w-7 p-1" />
							<span className="sr-only">Edit Notes</span>
						</button>
						<p className="text-muted-foreground">
							{workout.notes.split("\n").map((line, i) => (
								<span className="block" key={i}>
									{line.trim()}
								</span>
							))}
						</p>
					</div>
				)}
			</div>
			<ResponsiveDialog
				buttons={[
					{
						children: "Yes, delete",
						key: "delete",
						onClick() {
							handleDelete(workout.id)
						},
						variant: "destructive",
					},
					{
						children: "Cancel",
						key: "cancel",
						variant: "ghost",
					},
				]}
				description="This action cannot be undone"
				open={deleting}
				onOpenChange={setDeleting}
				title="Delete workout?"
			/>
			<ResponsiveDialog
				body={
					<>
						<Textarea
							className="resize-none"
							maxLength={300}
							onChange={e => {
								setNotes(e.target.value)
							}}
							rows={5}
							value={notes}
						/>
						<div className="mb-4 text-right text-sm text-muted-foreground">
							{notes.length}/300
						</div>
					</>
				}
				buttons={[
					{
						children: "Save",
						key: "save",
						loading: isUpdatingWorkout,
						onClick() {
							const trimmedNotes = notes.trim()
							if (trimmedNotes === workout.notes) setIsEditingNotes(false)
							else updateWorkout({ ...workout, notes: trimmedNotes })
						},
					},
					{
						children: "Cancel",
						disabled: isUpdatingWorkout,
						key: "cancel",
						onClick() {
							setNotes(workout.notes ?? "")
						},
						variant: "ghost",
					},
				]}
				open={isEditingNotes}
				onOpenChange={setIsEditingNotes}
				title="Workout Notes"
			/>
		</div>
	)

	/**
	 * Gets workout text we will copy to clipboard
	 */
	function getClipboardText(workout: Workout) {
		return `${getWorkoutNameText(workout.nameId, workoutNames)}
${getDateText(workout.date)}
${groupExercisesByLift(workout.exercises)
	.map(
		exerciseList =>
			`${getExerciseNameText(
				exerciseList[0]!.nameId,
				exerciseNames,
			)}: ${exerciseList.map(getPrintout).join(", ")}`,
	)
	.join("\n")}`
	}
}
