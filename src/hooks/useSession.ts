import {useQuery} from "react-query"

import {useAuth} from "~/context/AuthContext"
import {sessionService} from "~/services/SessionService"

export default function useSession() {
  const [user] = useAuth()
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
