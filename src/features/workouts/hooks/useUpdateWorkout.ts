import { useAuth } from "@/context/AuthContext"
import { updateWorkout } from "@/firebase/app"
import { useToast } from "@/hooks/use-toast"
import { Session } from "@/utils/models"
import { extractErrorMessage } from "@/utils/parsers"
import { useMutation, useQueryClient } from "@tanstack/react-query"

/**
 * Attempts to update a workout in the database
 */
export function useUpdateWorkout({ onSuccess }: { onSuccess: () => void }) {
	const queryClient = useQueryClient()
	const user = useAuth()
	const { toast } = useToast()
	const queryKey = ["workouts", { userId: user?.uid }]

	return useMutation({
		mutationFn: updateWorkout,
		mutationKey: ["updateWorkout"],
		onError(error) {
			toast({
				description: extractErrorMessage(error),
				title: "Add Workout Error",
				variant: "destructive",
			})
		},
		async onMutate(updatedWorkout) {
			await queryClient.cancelQueries({ queryKey })
			const previousWorkouts = queryClient.getQueryData(queryKey)
			queryClient.setQueryData(
				queryKey,
				(workouts: Session["workouts"]) =>
					workouts.map(workout =>
						workout.id === updatedWorkout.id ? updatedWorkout : workout,
					) satisfies Session["workouts"],
			)
			return { previousWorkouts }
		},
		onSettled() {
			queryClient.invalidateQueries({ queryKey })
		},
		onSuccess,
	})
}
