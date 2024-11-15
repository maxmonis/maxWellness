import { BackButton } from "@/components/BackButton"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import {
	CalendarIcon,
	MagnifyingGlassIcon,
	PlusIcon,
} from "@radix-ui/react-icons"
import Link from "next/link"
import { useWorkoutView } from "../hooks/useWorkoutView"
import { Workout } from "../utils/models"

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
		<div className="mx-auto flex h-14 w-full items-center px-4 pt-1 sm:px-6">
			{view === "list" ? (
				<>
					<div className="-mt-1 flex w-full items-center justify-between md:hidden">
						<Link
							className="flex h-10 items-center justify-center gap-1.5 rounded-full bg-blue-700 py-2 pl-3 pr-4 text-white hover:bg-blue-600"
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
					<h1 className="text-lg max-md:hidden">Workouts</h1>
				</>
			) : (
				<div className="flex items-center">
					{(loading || workouts.length > 0) && <BackButton />}
					<h1 className="text-lg">
						{view === "create"
							? `${editingWorkout ? "Edit" : "New"} Workout`
							: "Filters"}
					</h1>
				</div>
			)}
		</div>
	)
}
