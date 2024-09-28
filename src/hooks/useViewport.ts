import React from "react"

/**
 * @returns the width of the window in px, updated on resize
 */
export function useViewport() {
  const [width, setWidth] = React.useState(window.innerWidth)

  React.useEffect(() => {
    window.addEventListener("resize", handleWindowResize)

    return () => {
      window.removeEventListener("resize", handleWindowResize)
    }
  }, [])

  return width

  function handleWindowResize() {
    setWidth(window.innerWidth)
  }
}
