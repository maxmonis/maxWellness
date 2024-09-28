import {useMutation} from "react-query"
import {saveWorkout} from "~/firebase/client"
import {useInvalidateSession} from "~/hooks/useInvalidateSession"

/**
 * Attempts to save a new workout to the database
 */
export function useAddWorkout({onSuccess}: {onSuccess: () => void}) {
  const onSettled = useInvalidateSession()

  return useMutation({
    mutationFn: saveWorkout,
    mutationKey: ["session", {type: "add"}],
    onSettled,
    onSuccess,
  })
}
