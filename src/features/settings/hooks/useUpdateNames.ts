import { useAuth } from "@/features/auth/hooks/useAuth"
import { useToast } from "@/hooks/use-toast"
import { getErrorMessage } from "@/utils/parsers"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { updateSettings } from "../firebase/updateSettings"

/**
 * Attempts to update a user's profile in the database
 */
export function useUpdateNames({ onSuccess }: { onSuccess: () => void }) {
	const queryClient = useQueryClient()
	const { user } = useAuth()
	const { toast } = useToast()
	const exerciseQueryKey = ["exerciseNames", { userId: user?.uid }]
	const workoutQueryKey = ["workoutNames", { userId: user?.uid }]

	return useMutation({
		mutationFn: (newNames: Parameters<typeof updateSettings>[1]) =>
			updateSettings(user!.uid, newNames),
		mutationKey: ["updateNames"],
		onError(error) {
			toast({
				description: getErrorMessage(error),
				title: "Settings Update Error",
				variant: "destructive",
			})
		},
		async onMutate(newNames) {
			await queryClient.cancelQueries({ queryKey: exerciseQueryKey })
			await queryClient.cancelQueries({ queryKey: workoutQueryKey })
			const previousExercises = queryClient.getQueryData(exerciseQueryKey)
			queryClient.setQueryData(exerciseQueryKey, newNames.exerciseNames)
			const previousWorkouts = queryClient.getQueryData(workoutQueryKey)
			queryClient.setQueryData(workoutQueryKey, newNames.workoutNames)
			return { previousExercises, previousWorkouts }
		},
		onSettled() {
			queryClient.invalidateQueries({ queryKey: exerciseQueryKey })
			queryClient.invalidateQueries({ queryKey: workoutQueryKey })
		},
		onSuccess,
	})
}
