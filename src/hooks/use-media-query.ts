import * as React from "react"

export function useMediaQuery(query: string) {
	const [matches, setMatches] = React.useState(false)

	React.useEffect(() => {
		const mediaQueryList = matchMedia(query)
		setMatches(mediaQueryList.matches)

		function onChange(event: MediaQueryListEvent) {
			setMatches(event.matches)
		}

		mediaQueryList.addEventListener("change", onChange)
		return () => {
			mediaQueryList.removeEventListener("change", onChange)
		}
	}, [query])

	return matches
}
