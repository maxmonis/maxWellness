import { useAuth } from "@/features/auth/hooks/useAuth"
import { loadProfile } from "@/features/profile/firebase/loadProfile"
import { generateSession } from "@/features/session/utils/functions"
import { loadWorkouts } from "@/features/workouts/firebase/loadWorkouts"
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
				queryFn() {
					return userId ? loadProfile(userId) : null
				},
				queryKey: ["profile", { userId }],
			},
			{
				queryFn() {
					return userId ? loadWorkouts(userId) : null
				},
				queryKey: ["workouts", { userId }],
			},
		],
		combine(results) {
			const profile = results[0].data
			const workouts = results[1].data
			return {
				error: results.find(result => result.error)?.error,
				loading: results.some(result => result.isPending),
				session:
					profile && workouts ? generateSession(profile, workouts) : null,
			}
		},
	})
}
