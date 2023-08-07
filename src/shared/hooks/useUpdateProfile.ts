import {useMutation} from "react-query"

import {profileService} from "~/shared/services/ProfileService"

import useInvalidateSession from "./useInvalidateSession"

/**
 * @returns a function for updating a user's profile
 */
export default function useUpdateProfile({
  onSettled,
  ...callbacks
}: {
  [key in "onMutate" | "onSettled" | "onSuccess"]?: () => void
} = {}) {
  const invalidateSession = useInvalidateSession()

  const {mutate} = useMutation({
    ...callbacks,
    mutationFn: (...args: Parameters<typeof profileService.updateProfile>) =>
      profileService.updateProfile(...args),
    onSettled() {
      invalidateSession()
      onSettled?.()
    },
  })

  return mutate
}
