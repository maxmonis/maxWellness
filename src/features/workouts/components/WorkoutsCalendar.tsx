import { BackButton } from "@/components/BackButton"
import { Button } from "@/components/ui/button"
import { useSession } from "@/features/session/hooks/useSession"
import { getExerciseNameText } from "@/features/settings/utils/parsers"
import { useElementWidth } from "@/hooks/useElementWidth"
import { useFullscreen } from "@/hooks/useFullscreen"
import { cn } from "@/lib/utils"
import { getDateText } from "@/utils/parsers"
import {
	DoubleArrowLeftIcon,
	DoubleArrowRightIcon,
	EnterFullScreenIcon,
	ExitFullScreenIcon,
	SymbolIcon,
} from "@radix-ui/react-icons"
import * as React from "react"
import { getPrintout, groupExercisesByLift } from "../utils/functions"
import { Workout } from "../utils/models"
import { WorkoutsEmptyState } from "./WorkoutsEmptyState"

/**
 * Displays workout exercises and dates in a calendar
 * which can be filtered and/or have its axes toggled
 */
export function WorkoutsCalendar({
	clearFilters,
	filteredWorkouts,
}: {
	clearFilters: () => void
	filteredWorkouts: Array<Workout>
}) {
	const { loading, session } = useSession()

	const fullscreen = useFullscreen()
	const ref = React.useRef<HTMLDivElement>(null)
	const width = useElementWidth(ref)
	const maxColumns = width ? Math.floor((width - 176) / 176) || 1 : 3

	const exerciseNameIds: Record<string, number> = {}
	for (const { exercises } of filteredWorkouts) {
		for (const { nameId } of exercises) {
			exerciseNameIds[nameId] = exerciseNameIds[nameId]! + 1 || 1
		}
	}
	const liftArray: Array<{
		nameId: string
		total: number
	}> = []
	for (const nameId in exerciseNameIds) {
		liftArray.push({ nameId, total: exerciseNameIds[nameId]! })
	}
	const sortedLifts = liftArray.sort((a, b) => b.total - a.total)

	const [sortByDate, setSortByDate] = React.useState(false)
	const [horizontalIndex, setHorizontalIndex] = React.useState(0)
	const [canIncrement, setCanIncrement] = React.useState(false)

	React.useEffect(() => {
		setHorizontalIndex(0)
	}, [maxColumns, sortByDate])

	React.useEffect(() => {
		setCanIncrement(
			sortByDate
				? horizontalIndex < filteredWorkouts.length - maxColumns
				: horizontalIndex < liftArray.length - maxColumns,
		)
		// eslint-disable-next-line
	}, [liftArray, horizontalIndex])

	React.useEffect(() => {
		return () => {
			if (document.fullscreenElement) {
				document.exitFullscreen()
			}
		}
	}, [])

	if (!loading && session?.workouts.length === 0) {
		return (
			<div className="p-6">
				<WorkoutsEmptyState />
			</div>
		)
	}

	return (
		<div
			className={cn(
				fullscreen
					? "fixed bottom-0 left-0 right-0 top-0 z-10 h-screen w-screen bg-background"
					: "flex min-h-screen w-full justify-center",
			)}
			ref={ref}
		>
			<div className="w-full flex-col divide-x overflow-hidden">
				<div className="flex w-full flex-1 flex-col items-center">
					<div className="flex h-14 w-full items-center justify-between border-b px-4 pt-1 sm:px-6">
						<div className="flex items-center">
							<BackButton />
							<h1 className="text-lg">Calendar</h1>
						</div>
						<div className="flex items-center justify-center">
							<Button
								className="enabled:cursor-pointer disabled:opacity-0"
								onClick={() => {
									horizontalIndex && setHorizontalIndex(horizontalIndex - 1)
								}}
								size="icon"
								variant="ghost"
								{...(!horizontalIndex && { disabled: true })}
							>
								<span className="sr-only">View previous column</span>
								<DoubleArrowLeftIcon className="h-5 w-5" />
							</Button>
							<Button
								onClick={() => {
									setSortByDate(!sortByDate)
								}}
								size="icon"
								variant="ghost"
							>
								<span className="sr-only">Reverse x and y axes</span>
								<SymbolIcon className="h-5 w-5" />
							</Button>
							<Button
								className="enabled:cursor-pointer disabled:opacity-0"
								onClick={() => {
									canIncrement && setHorizontalIndex(horizontalIndex + 1)
								}}
								size="icon"
								variant="ghost"
								{...(!canIncrement && { disabled: true })}
							>
								<span className="sr-only">View next column</span>
								<DoubleArrowRightIcon className="h-5 w-5" />
							</Button>
							{document.fullscreenEnabled && (
								<Button
									className="ml-2 max-md:hidden"
									onClick={toggleFullscreen}
									size="icon"
									variant="ghost"
								>
									<span className="sr-only">Toggle fullscreen</span>
									{fullscreen ? (
										<ExitFullScreenIcon className="h-5 w-5" />
									) : (
										<EnterFullScreenIcon className="h-5 w-5" />
									)}
								</Button>
							)}
						</div>
					</div>
					<div className="h-full w-full">
						<div className="max-h-[calc(100dvh-7rem)] w-full overflow-y-auto md:max-h-[calc(100dvh-3.5rem)]">
							{filteredWorkouts.length > 0 ? (
								<table className="w-full table-fixed border-b bg-background text-center text-sm">
									<thead className="sticky top-0 divide-x bg-background shadow-sm shadow-border">
										<tr className="divide-x shadow-sm shadow-border">
											<th className="p-2 shadow-sm shadow-border">
												{sortByDate ? "Exercise" : "Date"}
											</th>
											{sortByDate
												? filteredWorkouts
														.slice(
															horizontalIndex,
															horizontalIndex + maxColumns,
														)
														.map(workout => (
															<th
																className="p-2 leading-tight shadow-sm shadow-border"
																key={workout.id}
															>
																{getDateText(workout.date)}
															</th>
														))
												: sortedLifts
														.slice(
															horizontalIndex,
															horizontalIndex + maxColumns,
														)
														.map(({ nameId }) => {
															const exerciseNameText = getExerciseNameText(
																nameId,
																session?.exerciseNames ?? [],
															)
															return (
																<th
																	className={cn(
																		"p-2 leading-tight shadow-sm shadow-border",
																		exerciseNameText
																			.split(" ")
																			.some(word => word.length >= 15) &&
																			"break-all",
																	)}
																	translate="no"
																	key={nameId}
																>
																	{exerciseNameText}
																</th>
															)
														})}
										</tr>
									</thead>
									<tbody>
										{sortByDate
											? sortedLifts.map(({ nameId }) => {
													const exerciseNameText = getExerciseNameText(
														nameId,
														session?.exerciseNames ?? [],
													)
													return (
														<tr
															className={cn(
																"divide-x border-t",
																exerciseNameText
																	.split(" ")
																	.some(word => word.length >= 15) &&
																	"break-all",
															)}
															key={nameId}
														>
															<td className="p-2 leading-tight" translate="no">
																{exerciseNameText}
															</td>
															{filteredWorkouts
																.slice(
																	horizontalIndex,
																	horizontalIndex + maxColumns,
																)
																.map(workout => (
																	<td className="p-2" key={nameId + workout.id}>
																		{groupExercisesByLift(
																			workout.exercises.filter(
																				exercise => exercise.nameId === nameId,
																			),
																		).map(exerciseList =>
																			exerciseList
																				.map(exercise =>
																					getPrintout(exercise).split(" "),
																				)
																				.join(", "),
																		)}
																	</td>
																))}
														</tr>
													)
											  })
											: filteredWorkouts.map(workout => (
													<tr className="divide-x border-t" key={workout.id}>
														<td className="p-2 leading-tight">
															{getDateText(workout.date)}
														</td>
														{sortedLifts
															.slice(
																horizontalIndex,
																horizontalIndex + maxColumns,
															)
															.map(({ nameId }) => (
																<td className="p-2" key={nameId + workout.id}>
																	{groupExercisesByLift(
																		workout.exercises.filter(
																			exercise => exercise.nameId === nameId,
																		),
																	).map(exerciseList =>
																		exerciseList
																			.map(exercise =>
																				getPrintout(exercise).split(" "),
																			)
																			.join(", "),
																	)}
																</td>
															))}
													</tr>
											  ))}
									</tbody>
								</table>
							) : (
								<div className="flex items-center gap-4 p-4 sm:p-6">
									<p>No results</p>
									<Button onClick={clearFilters} variant="outline">
										Clear Filters
									</Button>
								</div>
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	)

	function toggleFullscreen() {
		if (fullscreen) {
			document.exitFullscreen()
		} else {
			document.documentElement.requestFullscreen()
		}
	}
}
