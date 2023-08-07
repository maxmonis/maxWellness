import React from "react"

export default function useOutsideClick(callback: () => void) {
  const ref = React.useRef<HTMLDivElement | null>(null)

  React.useEffect(() => {
    document.addEventListener("click", handleClick)
    return () => {
      document.removeEventListener("click", handleClick)
    }
  }, [])

  return ref

  function handleClick(e: MouseEvent) {
    if (ref.current && !ref.current.contains(e.target as Node)) {
      callback()
    }
  }
}
