import {useMutation} from "react-query"

import {workoutService} from "~/shared/services/WorkoutService"

import useInvalidateSession from "./useInvalidateSession"

/**
 * @returns a function for adding a new workout
 */
export default function useAddWorkout({
  onSettled,
  ...callbacks
}: {
  [key in "onMutate" | "onSettled" | "onSuccess"]?: () => void
} = {}) {
  const invalidateSession = useInvalidateSession()

  const {mutate} = useMutation({
    ...callbacks,
    mutationFn: (...args: Parameters<typeof workoutService.saveWorkout>) =>
      workoutService.saveWorkout(...args),
    onSettled() {
      invalidateSession()
      onSettled?.()
    },
  })

  return mutate
}
