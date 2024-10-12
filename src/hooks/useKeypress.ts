import * as React from "react"

export function useKeypress(key: string, callback: () => void) {
	React.useEffect(() => {
		window.addEventListener("keyup", handleKeyup)
		return () => {
			window.removeEventListener("keyup", handleKeyup)
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	function handleKeyup(e: KeyboardEvent) {
		if (e.key === key) {
			callback()
		}
	}
}
