import { Page } from "@/components/Page"
import { useSession } from "@/features/session/hooks/useSession"
import { WorkoutsApp } from "@/features/workouts/components/WorkoutsApp"
import { WorkoutsLoader } from "@/features/workouts/components/WorkoutsLoader"

/**
 * Landing page which allows user to view and manage workouts
 */
export default function WorkoutsPage() {
	const { error, loading, session } = useSession()

	return (
		<Page mustBeLoggedIn title="Workouts" {...{ error }}>
			{loading ? (
				<WorkoutsLoader />
			) : session ? (
				<WorkoutsApp {...session} />
			) : null}
		</Page>
	)
}
