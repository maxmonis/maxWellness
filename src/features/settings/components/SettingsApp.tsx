import { BackButton } from "@/components/BackButton"
import { Form } from "@/components/Form"
import { Input } from "@/components/Input"
import { ResponsiveDialog } from "@/components/ReponsiveDialog"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Session } from "@/features/session/utils/models"
import { useUpdateNames } from "@/features/settings/hooks/useUpdateNames"
import { EditableName } from "@/features/settings/utils/models"
import { Workout } from "@/features/workouts/utils/models"
import { useToast } from "@/hooks/use-toast"
import { hasChars } from "@/utils/validators"
import { useIsMutating } from "@tanstack/react-query"
import { isEqual, sortBy } from "lodash"
import { nanoid } from "nanoid"
import { useRouter } from "next/router"
import * as React from "react"
import { isSameText } from "../utils/functions"
import { EditableListItem } from "./EditableListItem"

/**
 * Displays the user's workout and exercise names, allowing
 * them to add new ones and edit/delete existing ones
 */
export function SettingsApp(props: Session) {
	const router = useRouter()
	const { toast } = useToast()

	const { isPending: updating, mutate: updateSettings } = useUpdateNames({
		onSuccess() {
			toast({ title: "Settings updated" })
		},
	})
	const mutationCount = useIsMutating()
	const mutating = mutationCount > 0

	const [exerciseNames, setExerciseNames] = React.useState(props.exerciseNames)
	const [workoutNames, setWorkoutNames] = React.useState(props.workoutNames)
	const hasChangeOccurred =
		!isEqual(workoutNames, props.workoutNames) ||
		!isEqual(exerciseNames, props.exerciseNames)

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

	return (
		<div className="flex min-h-screen w-full flex-grow flex-col lg:max-w-3xl lg:border-r">
			<div className="flex h-14 items-end justify-between border-b px-4 pb-2 sm:px-6">
				<div className="flex">
					<BackButton />
					<h1 className="text-lg">Settings</h1>
				</div>
				{(hasChangeOccurred || updating) && (
					<Button loading={updating} onClick={saveChanges}>
						Save Changes
					</Button>
				)}
			</div>
			<Tabs defaultValue="exercises">
				<div className="w-full px-4 pt-4 sm:px-6">
					<TabsList className="w-full">
						<TabsTrigger className="w-full" value="exercises">
							Exercises
						</TabsTrigger>
						<TabsTrigger className="w-full" value="workouts">
							Workouts
						</TabsTrigger>
					</TabsList>
				</div>
				<SettingsTab
					setUpdatedNames={setExerciseNames}
					updatedNames={exerciseNames}
					value="exercises"
					workouts={props.workouts}
				/>
				<SettingsTab
					setUpdatedNames={setWorkoutNames}
					updatedNames={workoutNames}
					value="workouts"
					workouts={props.workouts}
				/>
			</Tabs>
			<ResponsiveDialog
				buttons={[
					{
						children: "Save Changes",
						key: "save",
						onClick() {
							saveChanges()
							onConfirmRouteChange()
						},
					},
					{
						children: "Continue Editing",
						key: "continue",
						onClick() {
							setNextRouterPath("")
						},
						variant: "ghost",
					},
					{
						children: "Discard Changes",
						key: "discard",
						onClick: onConfirmRouteChange,
						variant: "ghost",
					},
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
			updateSettings({ exerciseNames, workoutNames })
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

function SettingsTab({
	setUpdatedNames,
	updatedNames,
	value,
	workouts,
}: {
	setUpdatedNames: (names: Array<EditableName>) => void
	updatedNames: Array<EditableName>
	value: "exercises" | "workouts"
	workouts: Array<Workout>
}) {
	const [newName, setNewName] = React.useState("")

	function handleSubmit() {
		if (!newName) return
		if (!updatedNames.some(n => isSameText(n.text, newName))) {
			setUpdatedNames([
				...updatedNames,
				{ deleted: false, id: nanoid(), text: newName.trim() },
			])
		} else {
			const existingDeletedName = updatedNames.find(
				name => name.deleted && isSameText(name.text, newName),
			)
			if (existingDeletedName) {
				setUpdatedNames(
					updatedNames.map(name =>
						name.id === existingDeletedName.id
							? {
									deleted: false,
									id: existingDeletedName.id,
									text: newName.trim(),
							  }
							: name,
					),
				)
			}
		}
		setNewName("")
	}

	function handleNameChange({ deleted, id, text }: EditableName) {
		if (!hasChars(text) || deleted) {
			setUpdatedNames(
				updatedNames.map(name =>
					name.id === id ? { ...name, deleted: true } : name,
				),
			)
		} else if (
			hasChars(text) &&
			!updatedNames.some(name => isSameText(name.text, text) && name.id !== id)
		) {
			setUpdatedNames(
				updatedNames.map(name =>
					name.id === id ? { ...name, deleted, text: text.trim() } : name,
				),
			)
		} else {
			const existingDeletedName = updatedNames.find(
				name => name.deleted && isSameText(name.text, text),
			)
			if (existingDeletedName) {
				setUpdatedNames(
					updatedNames.map(name =>
						name.id === existingDeletedName.id
							? { ...name, deleted: false, text: text.trim() }
							: name,
					),
				)
			}
		}
	}

	return (
		<TabsContent value={value}>
			<div className="flex w-full flex-grow flex-col justify-center overflow-hidden px-4 pt-2 sm:px-6">
				<Form onSubmit={handleSubmit}>
					<div className="flex items-center justify-center gap-4 text-lg">
						<Input
							className="w-full"
							id="newWorkout"
							maxLength={40}
							name="newWorkout"
							onChange={({ target: { value } }) => {
								if (!value || /^[A-Za-z ]+$/.test(value)) {
									setNewName(value.trimStart().replace(/\s+/, " "))
								}
							}}
							placeholder={
								"New " + (value === "exercises" ? "exercise" : "workout")
							}
							value={newName}
						/>
					</div>
					{newName && (
						<div className="flex justify-center">
							<Button className="mt-3 w-fit" type="submit" variant="outline">
								Add Name
							</Button>
						</div>
					)}
				</Form>
				<ScrollArea className="h-[calc(100dvh-13.5rem)] md:h-[calc(100dvh-10rem)]">
					<ul className="h-full overflow-y-scroll pb-6 pt-2">
						{sortBy(
							updatedNames.filter(n => !n.deleted),
							"text",
						).map(workoutName => (
							<EditableListItem
								key={workoutName.id}
								editableName={workoutName}
								editableNameList={updatedNames}
								updateOptions={handleNameChange}
							/>
						))}
						{sortBy(
							updatedNames.filter(
								({ deleted, id }) =>
									deleted &&
									workouts.some(w => w.exercises.some(e => e.nameId === id)),
							),
							"text",
						).map(workoutName => (
							<EditableListItem
								key={workoutName.id}
								editableName={workoutName}
								editableNameList={updatedNames}
								updateOptions={handleNameChange}
							/>
						))}
					</ul>
				</ScrollArea>
			</div>
		</TabsContent>
	)
}
