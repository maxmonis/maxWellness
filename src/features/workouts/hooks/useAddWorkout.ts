import { useAuth } from "@/context/AuthContext"
import { saveWorkout } from "@/firebase/app"
import { useToast } from "@/hooks/use-toast"
import { Session } from "@/utils/models"
import { extractErrorMessage } from "@/utils/parsers"
import { useMutation, useQueryClient } from "@tanstack/react-query"

/**
 * Attempts to save a new workout to the database
 */
export function useAddWorkout({ onSuccess }: { onSuccess: () => void }) {
	const queryClient = useQueryClient()
	const user = useAuth()
	const { toast } = useToast()
	const queryKey = ["workouts", { userId: user?.uid }]

	return useMutation({
		mutationFn: saveWorkout,
		mutationKey: ["addWorkout"],
		onError(error) {
			toast({
				description: extractErrorMessage(error),
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
