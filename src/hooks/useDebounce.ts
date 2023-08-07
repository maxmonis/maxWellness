import React from "react"

export default function useDebounce(
  value: string,
  callback: () => void,
  delay = 300,
) {
  const [debouncedValue, setDebouncedValue] = React.useState(value)

  React.useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(timeout)
    }
  }, [value, delay])

  //eslint-disable-next-line
  React.useEffect(callback, [debouncedValue])
}
