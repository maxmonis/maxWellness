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
				Results -{" "}
				{filteredWorkouts.reduce((acc, w) => acc + w.exercises.length, 0)}{" "}
				exercises in {filteredWorkouts.length} workouts
			</h1>
			<p className="text-xs leading-snug text-muted-foreground">
				Filters will also be applied to the workouts list and calendar
			</p>
			<Accordion className="w-full" collapsible type="single">
				<AccordionItem value="currentPersonalBests">
					<AccordionTrigger>
						{currentPersonalBests.length} current personal bests
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
						{previousPersonalBests.length} previous personal bests
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
