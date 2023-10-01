import {useMutation} from "react-query"
import {profileService} from "~/shared/services/ProfileService"
import useInvalidateSession from "./useInvalidateSession"

/**
 * Attempts to update a user's profile in the database
 */
export default function useUpdateProfile({onSuccess}: {onSuccess: () => void}) {
  const onSettled = useInvalidateSession()

  return useMutation({
    mutationFn: (...args: Parameters<typeof profileService.updateProfile>) =>
      profileService.updateProfile(...args),
    mutationKey: ["session", {type: "profile"}],
    onSettled,
    onSuccess,
  })
}
