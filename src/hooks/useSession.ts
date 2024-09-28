import { useAuth } from "@/context/AuthContext"
import { getSession } from "@/firebase/app"
import { useQuery } from "@tanstack/react-query"

/**
 * Attempts to load the current session
 */
export function useSession() {
	const user = useAuth()
	const userId = user?.uid

	return useQuery({
		queryFn: () => {
			if (userId) {
				return getSession(userId)
			}
		},
		queryKey: ["session", { userId }],
	})
}
