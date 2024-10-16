import { ToastMessage } from "@/components/ToastMessage"
import { useAuth } from "@/features/auth/hooks/useAuth"
import { useToast } from "@/hooks/use-toast"
import { getErrorMessage } from "@/utils/parsers"
import { useMutation } from "@tanstack/react-query"
import { updateProfile, User } from "firebase/auth"

export function useUpdateProfile(user: User) {
	const { setUser } = useAuth()
	const { toast } = useToast()

	return useMutation({
		async mutationFn(newFields: Parameters<typeof updateProfile>[1]) {
			await updateProfile(user, newFields)
			setUser({
				...user,
				displayName: newFields.displayName ?? user.displayName,
				photoURL: newFields.photoURL ?? user.photoURL,
			})
		},
		mutationKey: ["updateProfile"],
		onError(error) {
			toast({
				description: getErrorMessage(error),
				title: "Profile Update Error",
				variant: "destructive",
			})
		},
		onSuccess() {
			toast({
				description: ToastMessage(),
				title: "Profile updated",
			})
		},
	})
}
