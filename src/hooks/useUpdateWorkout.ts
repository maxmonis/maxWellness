import {useMutation} from "react-query"
import {updateWorkout} from "~/firebase/client"
import {useInvalidateSession} from "./useInvalidateSession"

/**
 * Attempts to update a workout in the database
 */
export function useUpdateWorkout({onSuccess}: {onSuccess: () => void}) {
  const onSettled = useInvalidateSession()

  return useMutation({
    mutationFn: updateWorkout,
    mutationKey: ["session", {type: "update"}],
    onSettled,
    onSuccess,
  })
}
