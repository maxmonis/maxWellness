import {useMutation} from "react-query"
import {updateProfile} from "~/firebase/client"
import {useInvalidateSession} from "./useInvalidateSession"

/**
 * Attempts to update a user's profile in the database
 */
export function useUpdateProfile({onSuccess}: {onSuccess: () => void}) {
  const onSettled = useInvalidateSession()

  return useMutation({
    mutationFn: updateProfile,
    mutationKey: ["session", {type: "profile"}],
    onSettled,
    onSuccess,
  })
}
