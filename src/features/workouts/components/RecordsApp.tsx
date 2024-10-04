import { useSession } from "@/hooks/useSession"
import { cn } from "@/lib/utils"
import { getDateText, getLiftNameText } from "@/utils/parsers"
import { getPrintout } from "../utils/functions"

/**
 * Displays the user's personal records (if any exist)
 */
export function RecordsApp() {
	const { loading, session } = useSession()
	const records =
		session?.workouts.flatMap(w => w.routine.filter(e => e.recordStartDate)) ??
		[]
	return (
		<div className="h-full max-h-screen w-96 max-w-xs overflow-hidden border-l px-4 pb-6 max-lg:hidden xl:w-full xl:px-6">
			<div className="h-full overflow-hidden pb-14">
				<h2 className="mb-2 ml-1 mt-6 text-lg font-bold leading-tight">
					Personal Bests
				</h2>
				<ul className="flex h-full flex-col gap-4 overflow-y-auto rounded-lg bg-secondary px-4 py-4 xl:px-6">
					{loading ? (
						<p>Loading records...</p>
					) : records.length === 0 ? (
						<p>
							Personal bests will be marked with two asterisks (**) if
							they&apos;re unbroken, and with a single asterisk (*) if
							you&apos;ve subsequently surpassed them.
						</p>
					) : (
						records.map(exercise => {
							const liftNameText = getLiftNameText(
								exercise.liftId,
								session?.profile.liftNames ?? [],
							)
							return (
								<li key={exercise.id}>
									<p
										className={cn(
											liftNameText.split(" ").some(word => word.length >= 12) &&
												"break-all",
										)}
										translate="no"
									>
										{liftNameText}: {getPrintout(exercise)}
									</p>
									<p className="text-sm text-muted-foreground">
										{getDateText(exercise.recordStartDate ?? "")}
									</p>
								</li>
							)
						})
					)}
				</ul>
			</div>
		</div>
	)
}
