import { BackButton } from "@/components/CTA"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Workout } from "@/utils/models"
import {
	CalendarIcon,
	MagnifyingGlassIcon,
	PlusIcon,
} from "@radix-ui/react-icons"
import Link from "next/link"
import { useWorkoutView } from "../hooks/useWorkoutView"

/**
 * Displays the title of the selected view
 * and allows the user to choose a new one
 */
export function WorkoutsHeader({
	editingWorkout,
	loading,
	workouts,
}:
	| {
			editingWorkout: Workout | null
			loading?: never
			workouts: Array<Workout>
	  }
	| {
			editingWorkout?: never
			loading: true
			workouts?: never
	  }) {
	const { view } = useWorkoutView()
	return (
		<div className="mx-auto flex h-14 w-full items-end px-4 pb-2 xl:px-6">
			{view === "list" ? (
				<>
					<div className="flex w-full items-end justify-between md:hidden">
						<Link
							className={cn(
								"flex gap-1.5",
								buttonVariants({ variant: "default" }),
							)}
							href="/?view=create"
							shallow
						>
							<PlusIcon className="h-5 w-5" />
							<span className="font-bold">Create</span>
						</Link>
						{(loading || workouts.length > 0) && (
							<div className="flex gap-4">
								<Link
									className={cn(
										"flex w-full gap-1.5",
										buttonVariants({ variant: "outline" }),
									)}
									href="/?view=filters"
									shallow
								>
									<MagnifyingGlassIcon className="h-5 w-5" />
									<span className="font-bold max-xs:sr-only">Filters</span>
								</Link>
								<Link
									className={cn(
										"flex w-full gap-1.5",
										buttonVariants({ variant: "outline" }),
									)}
									href="/?view=calendar"
									shallow
								>
									<CalendarIcon className="h-5 w-5" />
									<span className="font-bold max-xs:sr-only">Calendar</span>
								</Link>
							</div>
						)}
					</div>
					<h1 className="text-xl font-bold max-md:hidden">Workouts</h1>
				</>
			) : (
				<>
					{(loading || workouts.length > 0) && <BackButton />}
					<h1 className="text-xl font-bold">
						{view === "create"
							? `${editingWorkout ? "Edit" : "New"} Workout`
							: "Filters"}
					</h1>
				</>
			)}
		</div>
	)
}
