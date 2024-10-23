import { BackButton } from "@/components/BackButton"
import { cn } from "@/lib/utils"
import { DotsHorizontalIcon } from "@radix-ui/react-icons"
import { useWorkoutView } from "../hooks/useWorkoutView"
import { WorkoutsHeader } from "./WorkoutsHeader"

/**
 * Displays a loading skeleton for the root route
 */
export function WorkoutsLoader() {
	const { view } = useWorkoutView()
	return (
		<div className="min-h-screen lg:max-w-3xl lg:border-r">
			{view === "calendar" ? (
				<div className="mx-auto flex h-14 w-full items-center justify-between px-4 pb-2 pt-1 sm:px-6">
					<div className="flex w-full items-center">
						<BackButton />
						<h1 className="text-lg">Calendar</h1>
					</div>
				</div>
			) : (
				<WorkoutsHeader loading />
			)}
			<div className="mx-auto flex h-full max-h-[calc(100dvh-7rem)] w-full justify-center border-t md:max-h-[calc(100dvh-3.5rem)]">
				{view === "list" ? (
					<div className="flex flex-1 flex-col overflow-hidden">
						<div className="h-full divide-y">
							{Array.from({ length: 5 }).map((_, i) => (
								<div
									key={i}
									className="flex justify-between gap-6 px-4 pb-6 pt-5 sm:px-6"
								>
									<div className="flex flex-col">
										<span
											className={cn(
												"mb-2 h-4 animate-pulse rounded bg-slate-300 dark:bg-slate-700",
												i % 2 ? "w-32" : "w-24",
											)}
										/>
										<span className="mb-4 h-2.5 w-16 animate-pulse rounded bg-slate-300 dark:bg-slate-700" />
										<span className="mb-2 h-3.5 w-28 animate-pulse rounded bg-slate-300 dark:bg-slate-700" />
										{i % 2 === 0 && (
											<span className="mb-2 h-3.5 w-20 animate-pulse rounded bg-slate-300 dark:bg-slate-700" />
										)}
										<span className="h-3.5 w-36 animate-pulse rounded bg-slate-300 dark:bg-slate-700" />
									</div>
									<DotsHorizontalIcon className="mr-1 h-5 w-5 lg:mt-1" />
								</div>
							))}
						</div>
					</div>
				) : (
					<span
						aria-busy="true"
						className="mt-20 h-20 w-20 animate-spin rounded-full border-4 border-r-transparent"
					/>
				)}
			</div>
		</div>
	)
}
