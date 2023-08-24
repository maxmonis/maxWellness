import {useQuery} from "react-query"

import {useAuth} from "~/shared/context/AuthContext"
import {sessionService} from "~/shared/services/SessionService"

/**
 * Attempts to load the current session
 */
export default function useSession() {
  const user = useAuth()
  const userId = user?.uid

  return useQuery({
    queryFn: () => loadSession(userId),
    queryKey: ["session", {userId}],
  })
}

function loadSession(userId?: string) {
  if (userId) {
    return sessionService.getSession(userId)
  }
}
