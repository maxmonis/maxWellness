import { ToastMessage } from "@/components/ToastMessage"
import { useAuth } from "@/features/auth/hooks/useAuth"
import { useSession } from "@/features/session/hooks/useSession"
import { useToast } from "@/hooks/use-toast"
import { getErrorMessage } from "@/utils/parsers"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { updateProfile } from "../firebase/updateProfile"

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
				description: getErrorMessage(error),
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
