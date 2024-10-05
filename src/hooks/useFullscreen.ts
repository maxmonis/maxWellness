import React from "react"

/**
 * @returns whether the viewport is fullscreen
 */
export function useFullscreen() {
	const [fullscreen, setFullscreen] = React.useState(false)

	React.useEffect(() => {
		window.addEventListener("fullscreenchange", updateFullscreen)

		return () => {
			window.addEventListener("fullscreenchange", updateFullscreen)
		}

		function updateFullscreen() {
			setFullscreen(Boolean(document.fullscreenElement))
		}
	}, [])

	return fullscreen
}
