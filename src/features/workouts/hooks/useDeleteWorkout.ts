import { deleteWorkout } from "@/firebase/app"
import { useInvalidateSession } from "@/hooks/useInvalidateSession"
import { useMutation } from "@tanstack/react-query"

/**
 * Attempts to delete a workout from the database
 */
export function useDeleteWorkout({ onSuccess }: { onSuccess: () => void }) {
	const onSettled = useInvalidateSession("workouts")

	return useMutation({
		mutationFn: deleteWorkout,
		mutationKey: ["session", { type: "delete" }],
		onSettled,
		onSuccess,
	})
}
