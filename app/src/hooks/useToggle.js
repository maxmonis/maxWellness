import { useState } from 'react'

const useToggle = initialState => {
  const [state, setState] = useState(initialState)
  const toggle = bool => setState(typeof bool === 'boolean' ? bool : !state)
  return [state, toggle]
}

export default useToggle
