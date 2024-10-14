import { useSession } from "@/features/session/hooks/useSession"
import { useRouter } from "next/router"
import { isValidView } from "../utils/functions"
import { View } from "../utils/models"

export function useWorkoutView() {
	const router = useRouter()
	const {
		query: { view },
	} = router
	const { loading, session } = useSession()

	const hasWorkouts = Boolean(session?.workouts.length)
	const defaultView: View = loading || hasWorkouts ? "list" : "create"

	if (view === "list" || (view && !isValidView(view))) {
		changeView(defaultView)
	} else if (!loading && !hasWorkouts && view !== "create") {
		router.replace("/?view=create")
	}

	return {
		changeView,
		defaultView,
		view: isValidView(view) ? view : defaultView,
	}

	function changeView(newView: View) {
		router.push(newView === "list" ? "/" : `/?view=${newView}`, undefined, {
			shallow: true,
		})
	}
}
