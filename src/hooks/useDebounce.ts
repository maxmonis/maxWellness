import React from "react"

export default function useDebounce(value: string, delay = 300) {
  const [debouncedValue, setDebouncedValue] = React.useState(value)

  React.useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(timeout)
    }
  }, [value, delay])

  return debouncedValue
}
