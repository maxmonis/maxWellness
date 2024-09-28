import { useAuth } from "@/context/AuthContext"
import { useQueryClient } from "@tanstack/react-query"

/**
 * @returns a function which invalidates the user's session query
 */
export function useInvalidateSession(key: "profile" | "workouts") {
	const user = useAuth()
	const queryClient = useQueryClient()

	return () =>
		queryClient.invalidateQueries({
			predicate: ({ queryKey }) => {
				if (queryKey[0] !== key) {
					return false
				}
				const params = queryKey[1]
				if (typeof params === "object" && params !== null) {
					if ("userId" in params && params.userId !== user?.uid) {
						return false
					}
				}
				return true
			},
		})
}
