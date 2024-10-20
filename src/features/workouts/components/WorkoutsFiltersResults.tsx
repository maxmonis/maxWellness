import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion"
import { buttonVariants } from "@/components/ui/button"
import { Session } from "@/features/session/utils/models"
import { getExerciseNameText } from "@/features/settings/utils/parsers"
import { cn } from "@/lib/utils"
import { getDateText } from "@/utils/parsers"
import Link from "next/link"
import { getPrintout } from "../utils/functions"
import { Workout } from "../utils/models"

export function WorkoutsFiltersResults({
	appliedFilters,
	filteredWorkouts,
	exerciseNames,
}: {
	appliedFilters: Session["filters"]
	filteredWorkouts: Array<Workout>
	exerciseNames: Session["exerciseNames"]
}) {
	const personalBests = filteredWorkouts.flatMap(w =>
		w.exercises.filter(e => e.recordStartDate),
	)
	const previousPersonalBests = personalBests.filter(e => e.recordEndDate)
	const currentPersonalBests = personalBests.filter(e => !e.recordEndDate)

	return (
		<div>
			<h1 className="mb-2 font-bold">Results</h1>
			<p className="text-xs leading-snug text-muted-foreground">
				Filters will also be applied to the workouts list and calendar
			</p>
			<Accordion
				className="w-full"
				collapsible
				defaultValue="currentPersonalBests"
				type="single"
			>
				<AccordionItem value="workoutsAndExercises">
					<AccordionTrigger>
						{filteredWorkouts.reduce((acc, w) => acc + w.exercises.length, 0)}{" "}
						exercises in {filteredWorkouts.length} workouts
					</AccordionTrigger>
					<AccordionContent className="flex flex-wrap gap-4">
						<Link
							className={cn(buttonVariants({ variant: "secondary" }))}
							href="/"
						>
							View list
						</Link>
						<Link
							className={cn(buttonVariants({ variant: "secondary" }))}
							href="/?view=calendar"
						>
							View calendar
						</Link>
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
			</Accordion>
		</div>
	)
}
