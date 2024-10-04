import { BackButton } from "@/components/CTA"
import { Button } from "@/components/ui/button"
import { useSession } from "@/hooks/useSession"
import { useViewport } from "@/hooks/useViewport"
import { cn } from "@/lib/utils"
import { Workout } from "@/utils/models"
import { getDateText, getLiftNameText } from "@/utils/parsers"
import {
	SymbolIcon,
	ThickArrowLeftIcon,
	ThickArrowRightIcon,
} from "@radix-ui/react-icons"
import React from "react"
import { getPrintout, groupExercisesByLift } from "../utils/functions"
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
	const width = useViewport()
	const { loading, session } = useSession()

	const maxColumns = width < 550 ? 1 : width < 1000 ? 2 : width < 1200 ? 3 : 4

	const liftIds: Record<string, number> = {}
	for (const { routine } of filteredWorkouts) {
		for (const { liftId } of routine) {
			liftIds[liftId] = liftIds[liftId] + 1 || 1
		}
	}
	const liftArray: Array<{
		liftId: string
		total: number
	}> = []
	for (const liftId in liftIds) {
		liftArray.push({ liftId, total: liftIds[liftId] })
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

	if (!loading && session?.workouts.length === 0) {
		return (
			<div className="p-6">
				<WorkoutsEmptyState />
			</div>
		)
	}

	return (
		<div className="flex min-h-screen w-full justify-center xl:max-w-5xl xl:border-r">
			<div className="w-full flex-col divide-x overflow-hidden">
				<div className="flex w-full flex-1 flex-col items-center">
					<div className="flex h-14 w-full items-end justify-between border-b px-4 pb-2 xl:px-6">
						<div className="flex">
							<BackButton />
							<h1 className="text-xl font-bold">Calendar</h1>
						</div>
						<div className="-mb-1 flex items-end justify-center">
							<Button
								aria-label="View previous column"
								className={cn(
									horizontalIndex
										? "cursor-pointer"
										: "cursor-default opacity-0",
								)}
								onClick={() => {
									horizontalIndex && setHorizontalIndex(horizontalIndex - 1)
								}}
								size="icon"
								variant="ghost"
							>
								<ThickArrowLeftIcon className="h-5 w-5" />
							</Button>
							<Button
								aria-label="Reverse x and y axes of calendar"
								onClick={() => {
									setSortByDate(!sortByDate)
								}}
								size="icon"
								variant="ghost"
							>
								<SymbolIcon className="h-5 w-5" />
							</Button>
							<Button
								aria-label="View next column"
								className={cn(
									canIncrement ? "cursor-pointer" : "cursor-default opacity-0",
								)}
								onClick={() => {
									canIncrement && setHorizontalIndex(horizontalIndex + 1)
								}}
								size="icon"
								variant="ghost"
							>
								<ThickArrowRightIcon className="h-5 w-5" />
							</Button>
						</div>
					</div>
					<div className="h-full w-full">
						<div className="max-h-[calc(100dvh-7rem)] w-full overflow-y-auto md:max-h-[calc(100dvh-3.5rem)]">
							{filteredWorkouts.length > 0 ? (
								<table className="w-full table-fixed border-b bg-background text-center">
									<thead className="sticky top-0 divide-x bg-background shadow-sm shadow-secondary">
										<tr className="divide-x shadow-sm shadow-secondary">
											<th className="px-4 py-2 text-lg shadow-sm shadow-secondary">
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
																className="px-4 py-2 text-lg leading-tight shadow-sm shadow-secondary"
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
														.map(({ liftId }) => {
															const liftNameText = getLiftNameText(
																liftId,
																session?.profile.liftNames ?? [],
															)
															return (
																<th
																	className={cn(
																		"px-4 py-2 text-lg leading-tight shadow-sm shadow-secondary",
																		liftNameText
																			.split(" ")
																			.some(word => word.length >= 12) &&
																			"break-all",
																	)}
																	translate="no"
																	key={liftId}
																>
																	{liftNameText}
																</th>
															)
														})}
										</tr>
									</thead>
									<tbody>
										{sortByDate
											? sortedLifts.map(({ liftId }) => {
													const liftNameText = getLiftNameText(
														liftId,
														session?.profile.liftNames ?? [],
													)
													return (
														<tr
															className={cn(
																"divide-x border-t",
																liftNameText
																	.split(" ")
																	.some(word => word.length >= 12) &&
																	"break-all",
															)}
															key={liftId}
														>
															<td
																className="px-4 py-2 leading-tight"
																translate="no"
															>
																{liftNameText}
															</td>
															{filteredWorkouts
																.slice(
																	horizontalIndex,
																	horizontalIndex + maxColumns,
																)
																.map(workout => (
																	<td
																		className="px-4 py-2"
																		key={liftId + workout.id}
																	>
																		{groupExercisesByLift(
																			workout.routine.filter(
																				exercise => exercise.liftId === liftId,
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
														<td className="px-4 py-2 leading-tight">
															{getDateText(workout.date)}
														</td>
														{sortedLifts
															.slice(
																horizontalIndex,
																horizontalIndex + maxColumns,
															)
															.map(({ liftId }) => (
																<td
																	className="px-4 py-2"
																	key={liftId + workout.id}
																>
																	{groupExercisesByLift(
																		workout.routine.filter(
																			exercise => exercise.liftId === liftId,
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
								<div className="flex items-center justify-center gap-4 p-6">
									<p className="font-bold text-red-500">No results</p>
									<Button onClick={clearFilters} variant="secondary">
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
}
