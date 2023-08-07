import React from "react"

export default function useKeypress(key: string, callback: () => void) {
  React.useEffect(() => {
    window.addEventListener("keyup", handleKeyup)
    return () => {
      window.removeEventListener("keyup", handleKeyup)
    }
  }, [])

  function handleKeyup(e: KeyboardEvent) {
    if (e.key === key) {
      callback()
    }
  }
}
