import * as React from "react"

/**
 * Calls a callback if the component is already mounted
 * when a change is detected in the dependencies array
 */
export function useUpdateEvent(callback: () => void, deps: Array<unknown>) {
	const mounted = React.useRef(false)

	React.useEffect(() => {
		if (mounted.current) {
			callback()
		} else {
			mounted.current = true
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, deps)
}
