import { updateWorkout } from "@/firebase/app"
import { useInvalidateSession } from "@/hooks/useInvalidateSession"
import { useMutation } from "@tanstack/react-query"

/**
 * Attempts to update a workout in the database
 */
export function useUpdateWorkout({ onSuccess }: { onSuccess: () => void }) {
	const onSettled = useInvalidateSession()

	return useMutation({
		mutationFn: updateWorkout,
		mutationKey: ["session", { type: "update" }],
		onSettled,
		onSuccess,
	})
}
