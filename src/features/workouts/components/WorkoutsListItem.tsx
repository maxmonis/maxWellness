import { ResponsiveDialog } from "@/components/ReponsiveDialog"
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
	Pencil2Icon,
	TrashIcon,
} from "@radix-ui/react-icons"
import omit from "lodash/omit"
import { nanoid } from "nanoid"
import * as React from "react"
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

	return (
		<div
			key={workout.id}
			className={cn(
				"h-min justify-between gap-6 border-t first:border-t-0 sm:gap-10",
				editingWorkout?.id === workout.id && "italic",
				view === "list" ? "flex px-4 pb-6 pt-4 sm:px-6" : "p-2 sm:flex",
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
								workoutNameText.split(" ").some(word => word.length >= 12) &&
									"break-all",
								view === "list" && "max-xl:font-bold",
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
											className="-mx-2 flex h-auto whitespace-normal text-left leading-tight"
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
												"leading-tight xl:text-sm",
												exerciseNameText
													.split(" ")
													.some(word => word.length >= 12) && "break-all",
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
			</div>
			<ResponsiveDialog
				buttons={[
					<Button key="cancel" variant="ghost">
						Cancel
					</Button>,
					<Button
						className="max-sm:w-full"
						key="delete"
						onClick={() => {
							handleDelete(workout.id)
						}}
						variant="destructive"
					>
						Yes, delete
					</Button>,
				]}
				description="This action cannot be undone"
				open={deleting}
				onOpenChange={setDeleting}
				title="Delete workout?"
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
