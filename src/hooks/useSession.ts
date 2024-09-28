import { useAuth } from "@/context/AuthContext"
import { loadProfile, loadWorkouts } from "@/firebase/app"
import { generateSession } from "@/utils/session"
import { useQueries } from "@tanstack/react-query"

/**
 * Attempts to load the current session
 */
export function useSession() {
	const user = useAuth()
	const userId = user?.uid

	return useQueries({
		queries: [
			{
				queryFn: () => {
					if (!userId) {
						return null
					}
					return loadProfile(userId)
				},
				queryKey: ["profile", { userId }],
			},
			{
				queryFn: () => {
					if (!userId) {
						return null
					}
					return loadWorkouts(userId)
				},
				queryKey: ["workouts", { userId }],
			},
		],
		combine(results) {
			const profile = results[0].data
			const workouts = results[1].data
			return {
				error: results.find(result => result.error),
				loading: results.some(result => result.isPending),
				session:
					profile && workouts ? generateSession(profile, workouts) : null,
			}
		},
	})
}
