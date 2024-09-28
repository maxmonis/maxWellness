import { updateProfile } from "@/firebase/app"
import { useInvalidateSession } from "@/hooks/useInvalidateSession"
import { useMutation } from "@tanstack/react-query"

/**
 * Attempts to update a user's profile in the database
 */
export function useUpdateNames({ onSuccess }: { onSuccess: () => void }) {
	const onSettled = useInvalidateSession()

	return useMutation({
		mutationFn: updateProfile,
		mutationKey: ["session", { type: "profile" }],
		onSettled,
		onSuccess,
	})
}
