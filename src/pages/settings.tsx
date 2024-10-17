import { Page } from "@/components/Page"
import { useSession } from "@/features/session/hooks/useSession"
import { SettingsApp } from "@/features/settings/components/SettingsApp"
import { SettingsLoader } from "@/features/settings/components/SettingsLoader"

/**
 * Allows the user to manage the names of workouts and exercises
 */
export default function SettingsPage() {
	const { error, loading, session } = useSession()

	return (
		<Page mustBeLoggedIn title="Settings" {...{ error }}>
			{loading ? (
				<SettingsLoader />
			) : session ? (
				<SettingsApp
					originalExerciseNames={session.exerciseNames}
					originalWorkoutNames={session.workoutNames}
				/>
			) : null}
		</Page>
	)
}
