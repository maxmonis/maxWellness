import {useQuery} from "react-query"

import {useAuth} from "~/context/AuthContext"
import {Session} from "~/resources/models"

export default function useSession() {
  const [user] = useAuth()
  const userId = user?.uid

  const {data, error, isLoading} = useQuery(["session", {userId}], () =>
    loadSession(userId),
  )

  const res: [typeof data, boolean, unknown] = [data, isLoading, error]
  return res
}

async function loadSession(userId?: string): Promise<Session | undefined> {
  if (userId) {
    return fetch(`/api/session/${userId}`).then(res => res.json())
  }
}
