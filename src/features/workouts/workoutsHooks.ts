import {useRouter} from "next/router"
import {useSession} from "~/shared/hooks/useSession"
import {isValidView} from "./workoutsFunctions"
import {View} from "./workoutsModels"

export function useWorkoutView() {
  const router = useRouter()
  const {
    query: {view},
  } = router
  const {data: session} = useSession()
  const defaultView: View = session?.workouts.length ? "list" : "create"
  if (view === "list" || (view && !isValidView(view))) {
    changeView(defaultView)
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
