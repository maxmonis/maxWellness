import { useAuth } from "@/features/auth/hooks/useAuth"
import { Session } from "@/features/session/utils/models"
import { useToast } from "@/hooks/use-toast"
import { getErrorMessage } from "@/utils/parsers"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { saveWorkout } from "../firebase/saveWorkout"

/**
 * Attempts to save a new workout to the database
 */
export function useAddWorkout({ onSuccess }: { onSuccess: () => void }) {
	const queryClient = useQueryClient()
	const { user } = useAuth()
	const { toast } = useToast()
	const queryKey = ["workouts", { userId: user?.uid }]

	return useMutation({
		mutationFn: (newWorkout: Parameters<typeof saveWorkout>[1]) =>
			saveWorkout(user!.uid, newWorkout),
		mutationKey: ["addWorkout"],
		onError(error) {
			toast({
				description: getErrorMessage(error),
				title: "Add Workout Error",
				variant: "destructive",
			})
		},
		async onMutate(newWorkout) {
			await queryClient.cancelQueries({ queryKey })
			const previousWorkouts = queryClient.getQueryData(queryKey)
			queryClient.setQueryData(
				queryKey,
				(workouts: Session["workouts"]) =>
					[
						{ ...newWorkout, id: Date.now().toString() },
						...workouts,
					] satisfies Session["workouts"],
			)
			return { previousWorkouts }
		},
		onSettled() {
			queryClient.invalidateQueries({ queryKey })
		},
		onSuccess,
	})
}
