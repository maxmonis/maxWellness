import React from "react"

export function useOutsideClick(callback: () => void) {
  const ref = React.useRef<HTMLDivElement | null>(null)

  React.useEffect(() => {
    document.addEventListener("click", handleClick)
    return () => {
      document.removeEventListener("click", handleClick)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return ref

  function handleClick(e: MouseEvent) {
    if (ref.current && !ref.current.contains(e.target as Node)) {
      callback()
    }
  }
}
