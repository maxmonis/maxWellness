import { Page } from "~/components/Page"
import { WorkoutsApp } from "~/features/workouts/components/WorkoutsApp"
import { WorkoutsLoader } from "~/features/workouts/components/WorkoutsLoader"
import { useSession } from "~/hooks/useSession"

/**
 * Landing page which allows user to view and manage workouts
 */
export default function WorkoutsPage() {
	const { data, isLoading, error } = useSession()

	return (
		<Page
			component={WorkoutsApp}
			Loader={WorkoutsLoader}
			loading={isLoading}
			mustBeLoggedIn
			props={data}
			title="Workouts"
			{...{ error }}
		/>
	)
}
