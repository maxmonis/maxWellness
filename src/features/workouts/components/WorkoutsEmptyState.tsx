import { useAuth } from "@/features/auth/hooks/useAuth"

/**
 * Contains a greeting and instructions on managing workouts
 */
export function WorkoutsEmptyState() {
	const { user } = useAuth()
	return (
		<div className="mx-auto mt-2 flex max-w-prose flex-col gap-2">
			<h2>Hi {user!.displayName}, welcome to maxWellness!</h2>
			<p>The New Workout page allows you to create and upload workouts.</p>
			<p>
				Visit the Settings page if you&apos;d like to update the names
				you&apos;ll use for your exercises and workouts.
			</p>
			<p>The About page contains an overview of the site.</p>
			<p>Get started by entering your first workout now 💪</p>
		</div>
	)
}
