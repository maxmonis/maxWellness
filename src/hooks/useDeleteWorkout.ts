import {useMutation} from "react-query"

import {workoutService} from "~/services/WorkoutService"

import useInvalidateSession from "./useInvalidateSession"

export default function useDeleteWorkout({
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
    mutationFn: (...args: Parameters<typeof workoutService.deleteWorkout>) =>
      workoutService.deleteWorkout(...args),
    onMutate,
    onSettled() {
      invalidateSession()
      onSettled?.()
    },
    onSuccess,
  })

  return mutate
}
