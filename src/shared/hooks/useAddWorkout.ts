import {useMutation} from "react-query"
import {workoutService} from "~/shared/services/WorkoutService"
import useInvalidateSession from "./useInvalidateSession"

/**
 * Attempts to save a new workout to the database
 */
export default function useAddWorkout({onSuccess}: {onSuccess: () => void}) {
  const onSettled = useInvalidateSession()

  return useMutation({
    mutationFn: (...args: Parameters<typeof workoutService.saveWorkout>) =>
      workoutService.saveWorkout(...args),
    mutationKey: ["session", {type: "add"}],
    onSettled,
    onSuccess,
  })
}
