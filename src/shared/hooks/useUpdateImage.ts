import {useMutation} from "react-query"
import {updateImage} from "~/firebase/client"
import {useAuth} from "../context/AuthContext"
import {useInvalidateSession} from "./useInvalidateSession"

export function useUpdateImage() {
  const onSettled = useInvalidateSession()
  const user = useAuth()

  return useMutation({
    mutationFn: async (photoURL: string) => {
      if (user) return updateImage(user.uid, photoURL)
    },
    mutationKey: ["session", {type: "profile"}],
    onSettled,
  })
}
