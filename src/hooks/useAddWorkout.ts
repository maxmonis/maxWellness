import {useMutation} from "react-query"

import {workoutService} from "~/services/WorkoutService"

import useInvalidateSession from "./useInvalidateSession"

export default function useAddWorkout({
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
    mutationFn: (...args: Parameters<typeof workoutService.saveWorkout>) =>
      workoutService.saveWorkout(...args),
    onMutate,
    onSettled() {
      invalidateSession()
      onSettled?.()
    },
    onSuccess,
  })

  return mutate
}
