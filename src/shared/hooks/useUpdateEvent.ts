import React from "react"

/**
 * Calls a callback if the component is already mounted
 * when a change is detected in the dependencies array
 */
export default function useUpdateEvent(callback: () => void, deps: unknown[]) {
  const mounted = React.useRef(false)

  React.useEffect(() => {
    if (mounted.current) {
      callback()
    } else {
      mounted.current = true
    }
  }, deps)
}
