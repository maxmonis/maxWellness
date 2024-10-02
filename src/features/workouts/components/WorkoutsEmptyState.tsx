import { useSession } from "@/hooks/useSession"

/**
 * Contains a greeting and instructions on managing workouts
 */
export function WorkoutsEmptyState() {
	const { session } = useSession()
	return (
		<div className="flex flex-col gap-4 p-4 sm:p-6 sm:text-lg">
			<h2 className="text-lg font-bold sm:text-xl">
				Hi {session?.profile.userName}, welcome to maxWellness!
			</h2>
			<p>
				The New Workout page allows you to create and upload workouts, and they
				will be displayed here in an editable list.
			</p>
			<p>
				Visit the Settings page if you&apos;d like to update the names
				you&apos;ll use for your exercises and workouts.
			</p>
			<p>
				The About page contains helpful videos and additional tips and tricks.
			</p>
			<p>Get started by entering your first workout now 💪</p>
		</div>
	)
}
