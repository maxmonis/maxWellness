import { ToastMessage } from "@/components/ToastMessage"
import { useAuth } from "@/context/AuthContext"
import { updateProfile } from "@/firebase/app"
import { useSession } from "@/hooks/useSession"
import { extractErrorMessage } from "@/utils/parsers"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useToast } from "./use-toast"

export function useUpdateProfile() {
	const queryClient = useQueryClient()
	const user = useAuth()
	const { session } = useSession()
	const { toast } = useToast()
	const queryKey = ["profile", { userId: user?.uid }]

	return useMutation({
		async mutationFn(newFields: Parameters<typeof updateProfile>[1]) {
			if (session) return updateProfile(session.profile.id, newFields)
		},
		mutationKey: ["updateProfile"],
		onError(error) {
			toast({
				description: extractErrorMessage(error),
				title: "Profile Update Error",
				variant: "destructive",
			})
		},
		async onMutate(newFields) {
			await queryClient.cancelQueries({ queryKey })
			const previousProfile = queryClient.getQueryData(queryKey)
			queryClient.setQueryData(
				queryKey,
				(profile: NonNullable<typeof session>["profile"]) => {
					return { ...profile, ...newFields }
				},
			)
			return { previousProfile }
		},
		onSettled() {
			queryClient.invalidateQueries({ queryKey })
		},
		onSuccess() {
			toast({
				description: ToastMessage(),
				title: "Profile updated",
			})
		},
	})
}
