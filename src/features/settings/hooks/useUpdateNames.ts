import { useAuth } from "@/context/AuthContext"
import { updateSettings } from "@/firebase/app"
import { useToast } from "@/hooks/use-toast"
import { extractErrorMessage } from "@/utils/parsers"
import { useMutation, useQueryClient } from "@tanstack/react-query"

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
				description: extractErrorMessage(error),
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
