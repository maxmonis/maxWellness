import {useMutation} from "react-query"
import {deleteWorkout} from "~/firebase/client"
import {useInvalidateSession} from "./useInvalidateSession"

/**
 * Attempts to delete a workout from the database
 */
export function useDeleteWorkout({onSuccess}: {onSuccess: () => void}) {
  const onSettled = useInvalidateSession()

  return useMutation({
    mutationFn: deleteWorkout,
    mutationKey: ["session", {type: "delete"}],
    onSettled,
    onSuccess,
  })
}
