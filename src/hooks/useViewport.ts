import React from "react"

export default function useViewport() {
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
