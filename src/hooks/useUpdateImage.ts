import {useMutation} from "react-query"
import {updateImage} from "~/firebase/app"
import {useInvalidateSession} from "~/hooks/useInvalidateSession"
import {useSession} from "~/hooks/useSession"

export function useUpdateImage() {
  const onSettled = useInvalidateSession()
  const {data: session} = useSession()

  return useMutation({
    mutationFn: async (photoURL: string) => {
      if (session) return updateImage(session.profile.id, photoURL)
    },
    mutationKey: ["session", {type: "profile"}],
    onSettled,
  })
}
