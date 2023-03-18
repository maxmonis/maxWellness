import React from "react"

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
