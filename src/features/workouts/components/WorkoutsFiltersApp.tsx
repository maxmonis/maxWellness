import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion"
import { Session } from "@/features/session/utils/models"
import { getExerciseNameText } from "@/features/settings/utils/parsers"
import { getDateText } from "@/utils/parsers"
import { getPrintout } from "../utils/functions"
import { WorkoutsFilters } from "./WorkoutsFilters"

export function WorkoutsFiltersApp({
	appliedFilters,
	clearFilters,
	filteredWorkouts,
	filters,
	exerciseNames,
	setAppliedFilters,
	setFilteredWorkouts,
	workoutNames,
	workouts,
}: {
	appliedFilters: typeof filters
	clearFilters: () => void
	filters: Session["filters"]
	filteredWorkouts: Session["workouts"]
	exerciseNames: Session["exerciseNames"]
	setAppliedFilters: React.Dispatch<React.SetStateAction<typeof filters>>
	setFilteredWorkouts: React.Dispatch<React.SetStateAction<typeof workouts>>
	workoutNames: Session["workoutNames"]
	workouts: Session["workouts"]
}) {
	const exerciseCount = filteredWorkouts.reduce(
		(count, w) => count + w.exercises.length,
		0,
	)
	const personalBests = filteredWorkouts.flatMap(w =>
		w.exercises.filter(e => e.recordStartDate),
	)
	const previousPersonalBests = personalBests.filter(e => e.recordEndDate)
	const currentPersonalBests = personalBests.filter(e => !e.recordEndDate)

	return (
		<div>
			<WorkoutsFilters
				appliedFilters={appliedFilters}
				clearFilters={clearFilters}
				filters={filters}
				exerciseNames={exerciseNames}
				setAppliedFilters={setAppliedFilters}
				setFilteredWorkouts={setFilteredWorkouts}
				workoutNames={workoutNames}
				workouts={workouts}
			/>
			<h1 className="mb-2 mt-8 border-t pt-6 font-bold">
				Results - {exerciseCount} exercise{exerciseCount === 1 ? "" : "s"} in{" "}
				{filteredWorkouts.length} workout
				{filteredWorkouts.length === 1 ? "" : "s"}
			</h1>
			<p className="text-xs leading-snug text-muted-foreground">
				Filters will also be applied to the workouts list and calendar
			</p>
			<Accordion className="w-full" collapsible type="single">
				<AccordionItem value="currentPersonalBests">
					<AccordionTrigger>
						{currentPersonalBests.length} current personal best
						{currentPersonalBests.length === 1 ? "" : "s"}
					</AccordionTrigger>
					<AccordionContent>
						<ul className="flex flex-col gap-3">
							{currentPersonalBests.map(e => (
								<li className="flex flex-wrap gap-x-2" key={e.id}>
									{appliedFilters.exerciseNameIds.filter(l => l.checked)
										.length !== 1
										? `${getExerciseNameText(e.nameId, exerciseNames)}: `
										: ""}
									{getPrintout(e).replace(/\*/g, "")}
									<span className="text-muted-foreground">
										{getDateText(e.recordStartDate!)}
									</span>
								</li>
							))}
						</ul>
					</AccordionContent>
				</AccordionItem>
				<AccordionItem value="previousPersonalBests">
					<AccordionTrigger>
						{previousPersonalBests.length} previous personal best
						{previousPersonalBests.length === 1 ? "" : "s"}
					</AccordionTrigger>
					<AccordionContent>
						<ul className="flex flex-col gap-3">
							{previousPersonalBests.map(e => (
								<li className="flex flex-wrap gap-x-2" key={e.id}>
									{appliedFilters.exerciseNameIds.filter(l => l.checked)
										.length !== 1
										? `${getExerciseNameText(e.nameId, exerciseNames)}: `
										: ""}
									{getPrintout(e).replace(/\*/g, "")}
									<span className="text-muted-foreground">
										{getDateText(e.recordStartDate!)} -{" "}
										{getDateText(e.recordEndDate!)}
									</span>
								</li>
							))}
						</ul>
					</AccordionContent>
				</AccordionItem>
			</Accordion>
		</div>
	)
}
