import { useAlerts } from "@/context/AlertContext"
import { updateProfile } from "@/firebase/app"
import { useInvalidateSession } from "@/hooks/useInvalidateSession"
import { useSession } from "@/hooks/useSession"
import { useMutation } from "@tanstack/react-query"

export function useUpdateProfile() {
	const onSettled = useInvalidateSession("profile")
	const { session } = useSession()
	const { showAlert } = useAlerts()

	return useMutation({
		async mutationFn(newFields: Parameters<typeof updateProfile>[1]) {
			if (session) return updateProfile(session.profile.id, newFields)
		},
		mutationKey: ["session", { type: "profile" }],
		onSettled,
		onSuccess() {
			showAlert({
				text: "Profile updated",
				type: "success",
			})
		},
	})
}
