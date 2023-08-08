import {useQuery} from "react-query"

import {useAuth} from "~/shared/context/AuthContext"
import {sessionService} from "~/shared/services/SessionService"

/**
 * @returns a tuple with the session, loading status, and error (if any)
 */
export default function useSession() {
  const user = useAuth()
  const userId = user?.uid

  const {data, error, isLoading} = useQuery(["session", {userId}], () =>
    loadSession(userId),
  )

  const res: [typeof data, boolean, unknown] = [data, isLoading, error]
  return res
}

function loadSession(userId?: string) {
  if (userId) {
    return sessionService.getSession(userId)
  }
}
