import { ToastMessage } from "@/components/ToastMessage"
import { updateProfile } from "@/firebase/app"
import { useInvalidateSession } from "@/hooks/useInvalidateSession"
import { useSession } from "@/hooks/useSession"
import { useMutation } from "@tanstack/react-query"
import { useToast } from "./use-toast"

export function useUpdateProfile() {
	const onSettled = useInvalidateSession("profile")
	const { session } = useSession()
	const { toast } = useToast()

	return useMutation({
		async mutationFn(newFields: Parameters<typeof updateProfile>[1]) {
			if (session) return updateProfile(session.profile.id, newFields)
		},
		mutationKey: ["session", { type: "profile" }],
		onSettled,
		onSuccess() {
			toast({
				description: ToastMessage(),
				title: "Profile updated",
			})
		},
	})
}
