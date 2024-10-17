import { useAuth } from "@/features/auth/hooks/useAuth"
import { Session } from "@/features/session/utils/models"
import { useToast } from "@/hooks/use-toast"
import { getErrorMessage } from "@/utils/parsers"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { deleteWorkout } from "../firebase/deleteWorkout"

/**
 * Attempts to delete a workout from the database
 */
export function useDeleteWorkout({ onSuccess }: { onSuccess: () => void }) {
	const queryClient = useQueryClient()
	const { user } = useAuth()
	const { toast } = useToast()
	const queryKey = ["workouts", { userId: user?.uid }]

	return useMutation({
		mutationFn: (id: string) => deleteWorkout(user!.uid, id),
		mutationKey: ["deleteWorkout"],
		onError(error) {
			toast({
				description: getErrorMessage(error),
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
