import {useQuery} from "react-query"
import {useAuth} from "~/context/AuthContext"
import {getSession} from "~/firebase/client"

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
