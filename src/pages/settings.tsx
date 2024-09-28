import { Page } from "@/components/Page"
import { SettingsApp } from "@/features/settings/components/SettingsApp"
import { SettingsLoader } from "@/features/settings/components/SettingsLoader"
import { useSession } from "@/hooks/useSession"

/**
 * Allows the user to manage the names of workouts and exercises
 */
export default function SettingsPage() {
	const { error, loading, session } = useSession()

	return (
		<Page
			component={SettingsApp}
			Loader={SettingsLoader}
			mustBeLoggedIn
			props={session && { profile: session.profile }}
			title="Settings"
			{...{ error, loading }}
		/>
	)
}
