import React from "react"

/**
 * Calls a callback if a text value does not change
 * for at least the duration of a delay in ms
 */
export function useDebounce(value: string, callback: () => void, delay = 300) {
	const [debouncedValue, setDebouncedValue] = React.useState(value)

	React.useEffect(() => {
		const timeout = setTimeout(() => {
			setDebouncedValue(value)
		}, delay)

		return () => {
			clearTimeout(timeout)
		}
	}, [value, delay])

	//eslint-disable-next-line
	React.useEffect(callback, [debouncedValue])
}
