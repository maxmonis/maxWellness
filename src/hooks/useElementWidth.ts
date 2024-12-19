import * as React from "react"

/**
 * @returns the width of the element in px, updated on resize events
 */
export function useElementWidth(ref: React.RefObject<HTMLElement | null>) {
	const [width, setWidth] = React.useState(ref.current?.offsetWidth)

	React.useEffect(() => {
		if (ref?.current) {
			updateWidth()
		}

		window.addEventListener("resize", updateWidth)

		return () => {
			window.removeEventListener("resize", updateWidth)
		}

		function updateWidth() {
			setWidth(ref.current?.offsetWidth)
		}
	}, [ref])

	return width
}
