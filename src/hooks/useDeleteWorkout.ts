import {useMutation} from "react-query"

import {workoutService} from "~/services/WorkoutService"

import useInvalidateSession from "./useInvalidateSession"

export default function useDeleteWorkout({
  onSettled,
  ...callbacks
}: {
  [key in "onMutate" | "onSettled" | "onSuccess"]?: () => void
} = {}) {
  const invalidateSession = useInvalidateSession()

  const {mutate} = useMutation({
    ...callbacks,
    mutationFn: (...args: Parameters<typeof workoutService.deleteWorkout>) =>
      workoutService.deleteWorkout(...args),
    onSettled() {
      invalidateSession()
      onSettled?.()
    },
  })

  return mutate
}
