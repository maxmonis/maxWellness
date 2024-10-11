import { useAuth } from "@/context/AuthContext"
import { deleteWorkout } from "@/firebase/app"
import { useToast } from "@/hooks/use-toast"
import { Session } from "@/utils/models"
import { extractErrorMessage } from "@/utils/parsers"
import { useMutation, useQueryClient } from "@tanstack/react-query"

/**
 * Attempts to delete a workout from the database
 */
export function useDeleteWorkout({ onSuccess }: { onSuccess: () => void }) {
	const queryClient = useQueryClient()
	const user = useAuth()
	const { toast } = useToast()
	const queryKey = ["workouts", { userId: user?.uid }]

	return useMutation({
		mutationFn: deleteWorkout,
		mutationKey: ["deleteWorkout"],
		onError(error) {
			toast({
				description: extractErrorMessage(error),
				title: "Delete Workout Error",
				variant: "destructive",
			})
		},
		async onMutate(id) {
			await queryClient.cancelQueries({ queryKey })
			const previousWorkouts = queryClient.getQueryData(queryKey)
			queryClient.setQueryData(queryKey, (workouts: Session["workouts"]) =>
				workouts.filter(w => w.id !== id),
			)
			return { previousWorkouts }
		},
		onSettled() {
			queryClient.invalidateQueries({ queryKey })
		},
		onSuccess,
	})
}
