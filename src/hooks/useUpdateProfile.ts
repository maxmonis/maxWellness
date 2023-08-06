import {useMutation} from "react-query"

import {profileService} from "~/services/ProfileService"

import useInvalidateSession from "./useInvalidateSession"

export default function useUpdateProfile({
  onMutate,
  onSettled,
  onSuccess,
}: {
  onMutate?: () => void
  onSettled?: () => void
  onSuccess?: () => void
} = {}) {
  const invalidateSession = useInvalidateSession()

  const {mutate} = useMutation({
    mutationFn: (...args: Parameters<typeof profileService.updateProfile>) =>
      profileService.updateProfile(...args),
    onMutate,
    onSettled() {
      invalidateSession()
      onSettled?.()
    },
    onSuccess,
  })

  return mutate
}
