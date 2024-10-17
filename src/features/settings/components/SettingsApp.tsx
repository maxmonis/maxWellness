import { BackButton } from "@/components/BackButton"
import { Form } from "@/components/Form"
import { Input } from "@/components/Input"
import { ResponsiveDialog } from "@/components/ReponsiveDialog"
import { Button } from "@/components/ui/button"
import {
	ResizableHandle,
	ResizablePanel,
	ResizablePanelGroup,
} from "@/components/ui/resizable"
import { useUpdateNames } from "@/features/settings/hooks/useUpdateNames"
import { EditableName } from "@/features/settings/utils/models"
import { useToast } from "@/hooks/use-toast"
import { useIsMutating } from "@tanstack/react-query"
import { isEqual, sortBy } from "lodash"
import { nanoid } from "nanoid"
import { useRouter } from "next/router"
import * as React from "react"
import { isTextAlreadyInList } from "../utils/functions"
import { EditableListItem } from "./EditableListItem"

/**
 * Displays the user's workout and exercise names, allowing
 * them to add new ones and edit/delete existing ones
 */
export function SettingsApp({
	originalExerciseNames,
	originalWorkoutNames,
}: {
	originalExerciseNames: Array<EditableName>
	originalWorkoutNames: Array<EditableName>
}) {
	const router = useRouter()
	const { toast } = useToast()

	const { isPending: updating, mutate: updateSettings } = useUpdateNames({
		onSuccess() {
			toast({ title: "Settings updated" })
		},
	})
	const mutationCount = useIsMutating()
	const mutating = mutationCount > 0

	const [exerciseNames, setExerciseNames] = React.useState(
		originalExerciseNames,
	)
	const [workoutNames, setWorkoutNames] = React.useState(originalWorkoutNames)
	const hasChangeOccurred =
		!isEqual(workoutNames, originalWorkoutNames) ||
		!isEqual(exerciseNames, originalExerciseNames)

	const [values, setValues] = React.useState({ lift: "", workout: "" })
	const { lift, workout } = values

	const [showLeaveConfirmDialog, setShowLeaveConfirmDialog] =
		React.useState(false)
	const [nextRouterPath, setNextRouterPath] = React.useState("")

	const onRouteChangeStart = React.useCallback(
		(nextPath: string) => {
			if (hasChangeOccurred) {
				setShowLeaveConfirmDialog(true)
				setNextRouterPath(nextPath)
				throw "cancelRouteChange"
			}
		},
		[hasChangeOccurred],
	)

	React.useEffect(() => {
		router.events.on("routeChangeStart", onRouteChangeStart)
		return removeListener
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [onRouteChangeStart])

	React.useEffect(() => {
		setExerciseNames(originalExerciseNames)
		setWorkoutNames(originalWorkoutNames)
	}, [originalExerciseNames, originalWorkoutNames])

	return (
		<div className="flex min-h-screen w-full flex-grow flex-col lg:max-w-3xl lg:border-r">
			<div className="flex h-14 items-end justify-between px-4 pb-2 lg:px-6">
				<div className="flex">
					<BackButton />
					<h1 className="text-lg">Settings</h1>
				</div>
				{hasChangeOccurred && (
					<Button loading={updating} onClick={saveChanges}>
						Save Changes
					</Button>
				)}
			</div>
			<div className="flex flex-grow flex-col border-t">
				<ResizablePanelGroup
					className="flex max-h-[calc(100dvh-7rem)] flex-grow md:max-h-[calc(100dvh-3.5rem)]"
					direction="horizontal"
				>
					<ResizablePanel className="flex w-full min-w-[1rem] flex-grow flex-col items-center overflow-hidden sm:min-w-[15rem]">
						<div className="flex w-full flex-grow flex-col justify-center overflow-hidden px-4 pt-4 lg:px-6">
							<h2 className="mx-auto mb-4 text-center font-bold">Exercises</h2>
							<Form onSubmit={handleLiftSubmit}>
								<div className="flex items-center justify-center gap-4 text-lg">
									<Input
										className="w-full"
										id="lift"
										name="lift"
										value={lift}
										placeholder="New exercise"
										{...{ onChange }}
									/>
								</div>
								{lift && (
									<>
										{exerciseNames.some(
											({ text }) => text.toLowerCase() === lift.toLowerCase(),
										) ? (
											<p className="mt-1 text-center text-red-500">
												Duplicate name
											</p>
										) : (
											<div className="flex justify-center">
												<Button
													className="mt-3 w-fit"
													type="submit"
													variant="outline"
												>
													Add Name
												</Button>
											</div>
										)}
									</>
								)}
							</Form>
							<ul className="h-full overflow-y-scroll pb-6 pt-2">
								{sortBy(
									exerciseNames.filter(n => !n.deleted),
									"text",
								).map(exerciseName => (
									<EditableListItem
										editableName={exerciseName}
										editableNameList={exerciseNames}
										key={exerciseName.id}
										updateOptions={updateExerciseNames}
									/>
								))}
								{sortBy(
									exerciseNames.filter(n => n.deleted),
									"text",
								).map(exerciseName => (
									<EditableListItem
										editableName={exerciseName}
										editableNameList={exerciseNames}
										key={exerciseName.id}
										updateOptions={updateExerciseNames}
									/>
								))}
							</ul>
						</div>
					</ResizablePanel>
					<ResizableHandle withHandle />
					<ResizablePanel className="flex w-full min-w-[1rem] flex-grow flex-col items-center overflow-hidden sm:min-w-[15rem]">
						<div className="flex w-full flex-grow flex-col justify-center overflow-hidden px-4 pt-4 lg:px-6">
							<h2 className="mx-auto mb-4 text-center font-bold">Workouts</h2>
							<Form onSubmit={handleWorkoutSubmit}>
								<div className="flex items-center justify-center gap-4 text-lg">
									<Input
										className="w-full"
										id="workout"
										name="workout"
										value={workout}
										placeholder="New workout"
										{...{ onChange }}
									/>
								</div>
								{workout && (
									<>
										{workoutNames.some(
											({ text }) =>
												text.toLowerCase() === workout.toLowerCase(),
										) ? (
											<p className="mt-1 text-center text-red-500">
												Duplicate name
											</p>
										) : (
											<div className="flex justify-center">
												<Button
													className="mt-3 w-fit"
													type="submit"
													variant="outline"
												>
													Add Name
												</Button>
											</div>
										)}
									</>
								)}
							</Form>
							<ul className="h-full overflow-y-scroll pb-6 pt-2">
								{sortBy(
									workoutNames.filter(n => !n.deleted),
									"text",
								).map(workoutName => (
									<EditableListItem
										key={workoutName.id}
										editableName={workoutName}
										editableNameList={workoutNames}
										updateOptions={updateWorkoutNames}
									/>
								))}
								{sortBy(
									workoutNames.filter(n => n.deleted),
									"text",
								).map(workoutName => (
									<EditableListItem
										key={workoutName.id}
										editableName={workoutName}
										editableNameList={workoutNames}
										updateOptions={updateWorkoutNames}
									/>
								))}
							</ul>
						</div>
					</ResizablePanel>
				</ResizablePanelGroup>
			</div>
			<ResponsiveDialog
				buttons={[
					<Button
						className="text-destructive hover:text-destructive"
						key="discard"
						onClick={() => {
							setExerciseNames(originalExerciseNames)
							setWorkoutNames(originalWorkoutNames)
							onConfirmRouteChange()
						}}
						variant="ghost"
					>
						Discard Changes
					</Button>,
					<Button
						key="continue"
						onClick={() => {
							setNextRouterPath("")
						}}
						variant="ghost"
					>
						Continue Editing
					</Button>,
					<Button
						autoFocus
						className="max-sm:w-full"
						key="save"
						onClick={() => {
							saveChanges()
							onConfirmRouteChange()
						}}
					>
						Save Changes
					</Button>,
				]}
				description="Are you sure you want to leave? Your changes will be lost"
				open={showLeaveConfirmDialog}
				onOpenChange={setShowLeaveConfirmDialog}
				title="Unsaved Changes"
			/>
		</div>
	)

	/**
	 * Saves the profile unless it is unchanged
	 */
	function saveChanges() {
		if (!mutating && hasChangeOccurred) {
			setShowLeaveConfirmDialog(false)
			updateSettings({
				exerciseNames: exerciseNames.map(({ id, text, deleted }) => ({
					id,
					text,
					deleted,
				})),
				workoutNames: workoutNames.map(({ id, text, deleted }) => ({
					id,
					text,
					deleted,
				})),
			})
		}
	}

	/**
	 * Handles updates to the form inputs, sanitizing the values
	 */
	function onChange({
		target: { name, value },
	}: React.ChangeEvent<HTMLInputElement>) {
		if (!value || /^[A-Za-z ]+$/.test(value)) {
			setValues({
				...values,
				[name]: value.trimStart().replace(/\s/, " ").substring(0, 36),
			})
		}
	}

	/**
	 * Saves a lift name unless it is a duplicate
	 */
	function handleLiftSubmit() {
		if (
			lift &&
			!exerciseNames.some(
				({ text }) =>
					text.toLowerCase().replace(/\s/g, "") ===
					lift.toLowerCase().replace(/\s/g, ""),
			)
		) {
			setExerciseNames([
				...exerciseNames,
				{
					deleted: false,
					id: nanoid(),
					text: lift.trim(),
				},
			])
			setValues({ ...values, lift: "" })
		}
	}

	/**
	 * Saves a workout name unless it is a duplicate
	 */
	function handleWorkoutSubmit() {
		if (
			workout &&
			!workoutNames.some(
				({ text }) =>
					text.toLowerCase().replace(/\s/g, "") ===
					workout.toLowerCase().replace(/\s/g, ""),
			)
		) {
			setWorkoutNames([
				...workoutNames,
				{
					deleted: false,
					id: nanoid(),
					text: workout.trim(),
				},
			])
			setValues({ ...values, workout: "" })
		}
	}

	/**
	 * Handles deleted or updated workout names
	 */
	function updateWorkoutNames(
		{ deleted, text }: EditableName,
		workoutName: EditableName,
	) {
		if ((!text || deleted) && workoutNames.length > 1) {
			setWorkoutNames(
				workoutNames.map(name =>
					name.id === workoutName.id ? { ...name, deleted } : name,
				),
			)
		} else if (text && !isTextAlreadyInList(text, workoutNames)) {
			setWorkoutNames(
				workoutNames.map(name =>
					name.id === workoutName.id ? { ...name, text } : name,
				),
			)
		}
	}

	/**
	 * Handles deleted or updated lift names
	 */
	function updateExerciseNames(
		{ text, deleted }: EditableName,
		exerciseName: EditableName,
	) {
		if ((!text || deleted) && exerciseNames.length > 1) {
			setExerciseNames(
				exerciseNames.map(name =>
					name.id === exerciseName.id ? { ...name, deleted } : name,
				),
			)
		} else if (text && !isTextAlreadyInList(text, exerciseNames)) {
			setExerciseNames(
				exerciseNames.map(name =>
					name.id === exerciseName.id ? { ...name, text } : name,
				),
			)
		}
	}

	function onConfirmRouteChange() {
		removeListener()
		router.push(nextRouterPath)
	}

	function removeListener() {
		router.events.off("routeChangeStart", onRouteChangeStart)
	}
}
