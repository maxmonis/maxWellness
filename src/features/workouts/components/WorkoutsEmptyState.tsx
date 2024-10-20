import { useAuth } from "@/features/auth/hooks/useAuth"

/**
 * Contains a greeting and instructions on managing workouts
 */
export function WorkoutsEmptyState() {
	const { user } = useAuth()
	return (
		<div className="flex flex-col gap-4 p-4 text-sm sm:p-6">
			<h2 className="text-base">
				Hi {user!.displayName}, welcome to maxWellness!
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
