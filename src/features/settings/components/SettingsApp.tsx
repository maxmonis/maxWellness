import { BackButton } from "@/components/CTA"
import { ResponsiveDialog } from "@/components/ReponsiveDialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
	ResizableHandle,
	ResizablePanel,
	ResizablePanelGroup,
} from "@/components/ui/resizable"
import { useUpdateNames } from "@/features/settings/hooks/useUpdateNames"
import { useToast } from "@/hooks/use-toast"
import { EditableName, Profile } from "@/utils/models"
import { useIsMutating } from "@tanstack/react-query"
import { isEqual, omit, sortBy } from "lodash"
import { nanoid } from "nanoid"
import { useRouter } from "next/router"
import React from "react"
import { isTextAlreadyInList } from "../utils/functions"
import { EditableListItem } from "./EditableListItem"

/**
 * Displays the user's workout and exercise names, allowing
 * them to add new ones and edit/delete existing ones
 */
export function SettingsApp({ profile }: { profile: Profile }) {
	const router = useRouter()
	const { toast } = useToast()

	const { isPending: updating, mutate: updateSettings } = useUpdateNames({
		onSuccess() {
			toast({ title: "Settings updated" })
		},
	})
	const mutationCount = useIsMutating()
	const mutating = mutationCount > 0

	const [liftNames, setLiftNames] = React.useState(profile.liftNames)
	const [workoutNames, setWorkoutNames] = React.useState(profile.workoutNames)
	const hasChangeOccurred =
		!isEqual(
			workoutNames.map(name => omit(name, "canDelete")),
			profile.workoutNames.map(name => omit(name, "canDelete")),
		) ||
		!isEqual(
			liftNames.map(name => omit(name, "canDelete")),
			profile.liftNames.map(name => omit(name, "canDelete")),
		)

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
		setLiftNames(profile.liftNames)
		setWorkoutNames(profile.workoutNames)
	}, [profile])

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
							<form onSubmit={handleLiftSubmit}>
								<div className="flex items-center justify-center gap-4 text-lg">
									<Input
										name="lift"
										value={lift}
										placeholder="New exercise"
										{...{ onChange }}
									/>
								</div>
								{lift && (
									<>
										{liftNames.some(
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
													variant="secondary"
												>
													Add Name
												</Button>
											</div>
										)}
									</>
								)}
							</form>
							<ul className="h-full overflow-y-scroll pb-6 pt-2">
								{sortBy(
									liftNames.filter(n => !n.isHidden),
									"text",
								).map(liftName => (
									<EditableListItem
										editableName={liftName}
										editableNameList={liftNames}
										key={liftName.id}
										updateOptions={updateLiftNames}
									/>
								))}
								{sortBy(
									liftNames.filter(n => n.isHidden),
									"text",
								).map(liftName => (
									<EditableListItem
										editableName={liftName}
										editableNameList={liftNames}
										key={liftName.id}
										updateOptions={updateLiftNames}
									/>
								))}
							</ul>
						</div>
					</ResizablePanel>
					<ResizableHandle withHandle />
					<ResizablePanel className="flex w-full min-w-[1rem] flex-grow flex-col items-center overflow-hidden sm:min-w-[15rem]">
						<div className="flex w-full flex-grow flex-col justify-center overflow-hidden px-4 pt-4 lg:px-6">
							<h2 className="mx-auto mb-4 text-center font-bold">Workouts</h2>
							<form onSubmit={handleWorkoutSubmit}>
								<div className="flex items-center justify-center gap-4 text-lg">
									<Input
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
													variant="secondary"
												>
													Add Name
												</Button>
											</div>
										)}
									</>
								)}
							</form>
							<ul className="h-full overflow-y-scroll pb-6 pt-2">
								{sortBy(
									workoutNames.filter(n => !n.isHidden),
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
									workoutNames.filter(n => n.isHidden),
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
							setLiftNames(profile.liftNames)
							setWorkoutNames(profile.workoutNames)
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
				...profile,
				liftNames: liftNames.map(({ id, text, isHidden }) => ({
					id,
					text,
					isHidden,
				})),
				workoutNames: workoutNames.map(({ id, text, isHidden }) => ({
					id,
					text,
					isHidden,
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
	function handleLiftSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault()
		if (
			lift &&
			!liftNames.some(
				({ text }) =>
					text.toLowerCase().replace(/\s/g, "") ===
					lift.toLowerCase().replace(/\s/g, ""),
			)
		) {
			setLiftNames([
				...liftNames,
				{
					id: nanoid(),
					text: lift.trim(),
					canDelete: true,
				},
			])
			setValues({ ...values, lift: "" })
		}
	}

	/**
	 * Saves a workout name unless it is a duplicate
	 */
	function handleWorkoutSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault()
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
					id: nanoid(),
					text: workout.trim(),
					canDelete: true,
				},
			])
			setValues({ ...values, workout: "" })
		}
	}

	/**
	 * Handles deleted or updated workout names
	 */
	function updateWorkoutNames(
		{ text, isHidden }: EditableName,
		workoutName: EditableName,
	) {
		if (!text && workoutName.canDelete && workoutNames.length > 1) {
			setWorkoutNames(workoutNames.filter(({ id }) => id !== workoutName.id))
		} else if (text && !isTextAlreadyInList(text, workoutNames)) {
			setWorkoutNames(
				workoutNames.map(name =>
					name.id === workoutName.id ? { ...name, text } : name,
				),
			)
		} else {
			setWorkoutNames(
				workoutNames.map(name =>
					name.id === workoutName.id ? { ...name, isHidden } : name,
				),
			)
		}
	}

	/**
	 * Handles deleted or updated lift names
	 */
	function updateLiftNames(
		{ text, isHidden }: EditableName,
		liftName: EditableName,
	) {
		if (!text && liftName.canDelete && liftNames.length > 1) {
			setLiftNames(liftNames.filter(({ id }) => id !== liftName.id))
		} else if (text && !isTextAlreadyInList(text, liftNames)) {
			setLiftNames(
				liftNames.map(name =>
					name.id === liftName.id ? { ...name, text } : name,
				),
			)
		} else {
			setLiftNames(
				liftNames.map(name =>
					name.id === liftName.id ? { ...name, isHidden } : name,
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
