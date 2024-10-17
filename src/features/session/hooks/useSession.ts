import { useAuth } from "@/features/auth/hooks/useAuth"
import { generateSession } from "@/features/session/utils/functions"
import { loadExerciseNames } from "@/features/settings/firebase/loadExerciseNames"
import { loadWorkoutNames } from "@/features/settings/firebase/loadWorkoutNames"
import { loadWorkouts } from "@/features/workouts/firebase/loadWorkouts"
import { useQueries } from "@tanstack/react-query"

/**
 * Attempts to load the current session
 */
export function useSession() {
	const { user } = useAuth()
	const userId = user?.uid

	return useQueries({
		queries: [
			{
				queryFn() {
					return userId ? loadWorkouts(userId) : null
				},
				queryKey: ["workouts", { userId }],
			},
			{
				queryFn() {
					return userId ? loadWorkoutNames(userId) : null
				},
				queryKey: ["workoutNames", { userId }],
			},
			{
				queryFn() {
					return userId ? loadExerciseNames(userId) : null
				},
				queryKey: ["exerciseNames", { userId }],
			},
		],
		combine(results) {
			const workouts = results[0].data
			const workoutNames = results[1].data
			const exerciseNames = results[2].data
			return {
				error: results.find(result => result.error)?.error,
				loading: results.some(result => result.isPending),
				session:
					workouts && workoutNames && exerciseNames
						? generateSession(workouts, workoutNames, exerciseNames)
						: null,
			}
		},
	})
}
