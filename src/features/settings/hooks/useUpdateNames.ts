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
	const user = useAuth()
	const { toast } = useToast()
	const queryKey = ["profile", { userId: user?.uid }]

	return useMutation({
		mutationFn: updateSettings,
		mutationKey: ["updateNames"],
		onError(error) {
			toast({
				description: getErrorMessage(error),
				title: "Settings Update Error",
				variant: "destructive",
			})
		},
		async onMutate(newProfile) {
			await queryClient.cancelQueries({ queryKey })
			const previousProfile = queryClient.getQueryData(queryKey)
			queryClient.setQueryData(queryKey, newProfile)
			return { previousProfile }
		},
		onSettled() {
			queryClient.invalidateQueries({ queryKey })
		},
		onSuccess,
	})
}
