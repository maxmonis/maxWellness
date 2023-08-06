import {useMutation} from "react-query"

import {workoutService} from "~/services/WorkoutService"

import useInvalidateSession from "./useInvalidateSession"

/**
 * @returns a function for updating a workout
 */
export default function useUpdateWorkout({
  onSettled,
  ...callbacks
}: {
  [key in "onMutate" | "onSettled" | "onSuccess"]?: () => void
} = {}) {
  const invalidateSession = useInvalidateSession()

  const {mutate} = useMutation({
    ...callbacks,
    mutationFn: (...args: Parameters<typeof workoutService.updateWorkout>) =>
      workoutService.updateWorkout(...args),
    onSettled() {
      invalidateSession()
      onSettled?.()
    },
  })

  return mutate
}
