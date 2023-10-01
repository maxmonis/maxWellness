import {useMutation} from "react-query"
import {workoutService} from "~/shared/services/WorkoutService"
import useInvalidateSession from "./useInvalidateSession"

/**
 * Attempts to delete a workout from the database
 */
export default function useDeleteWorkout({onSuccess}: {onSuccess: () => void}) {
  const onSettled = useInvalidateSession()

  return useMutation({
    mutationFn: (...args: Parameters<typeof workoutService.deleteWorkout>) =>
      workoutService.deleteWorkout(...args),
    mutationKey: ["session", {type: "delete"}],
    onSettled,
    onSuccess,
  })
}
