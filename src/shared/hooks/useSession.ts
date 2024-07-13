import {useQuery} from "react-query"
import {getSession} from "~/firebase/client"
import {useAuth} from "~/shared/context/AuthContext"

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
    queryKey: ["session", {userId}],
  })
}
