import React from "react"
import {useQueryClient} from "react-query"

/**
 * Subscribes to the mutation cache to return info about
 * loading mutations (if any) which match the mutationKey
 */
export default function useMutating({key}: {key: string}) {
  const queryClient = useQueryClient()

  const [count, setCount] = React.useState(0)

  React.useEffect(() => {
    queryClient.getMutationCache().subscribe(mutation => {
      if (mutation?.options.mutationKey?.[0] === key) {
        setCount(
          mutation.state.status === "loading"
            ? count + 1
            : count > 0
            ? count - 1
            : 0,
        )
      }
    })
  })

  return {count, mutating: count > 0}
}
