import { saveWorkout } from "@/firebase/app"
import { useInvalidateSession } from "@/hooks/useInvalidateSession"
import { useMutation } from "react-query"

/**
 * Attempts to save a new workout to the database
 */
export function useAddWorkout({ onSuccess }: { onSuccess: () => void }) {
	const onSettled = useInvalidateSession()

	return useMutation({
		mutationFn: saveWorkout,
		mutationKey: ["session", { type: "add" }],
		onSettled,
		onSuccess,
	})
}
