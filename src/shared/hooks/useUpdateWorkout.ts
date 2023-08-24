import {useMutation} from "react-query"

import {workoutService} from "~/shared/services/WorkoutService"

import useInvalidateSession from "./useInvalidateSession"

/**
 * Attempts to update a workout in the database
 */
export default function useUpdateWorkout({onSuccess}: {onSuccess: () => void}) {
  const onSettled = useInvalidateSession()

  return useMutation({
    mutationFn: (...args: Parameters<typeof workoutService.updateWorkout>) =>
      workoutService.updateWorkout(...args),
    mutationKey: ["session", {type: "update"}],
    onSettled,
    onSuccess,
  })
}
