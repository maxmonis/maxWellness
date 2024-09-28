import { Page } from "@/components/Page"
import { WorkoutsApp } from "@/features/workouts/components/WorkoutsApp"
import { WorkoutsLoader } from "@/features/workouts/components/WorkoutsLoader"
import { useSession } from "@/hooks/useSession"

/**
 * Landing page which allows user to view and manage workouts
 */
export default function WorkoutsPage() {
	const { error, loading, session } = useSession()

	return (
		<Page
			component={WorkoutsApp}
			Loader={WorkoutsLoader}
			mustBeLoggedIn
			props={session}
			title="Workouts"
			{...{ error, loading }}
		/>
	)
}
