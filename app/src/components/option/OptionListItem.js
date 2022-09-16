import React from 'react'
import useInputState from '../../hooks/useInputState'
import useToggle from '../../hooks/useToggle'
import { strInput } from '../../functions/helpers'

const CurrentOption = ({ option, updateOptions }) => {
  const [isEditing, toggle] = useToggle(false)
  const [value, handleChange] = useInputState(option)
  const handleSubmit = e => {
    e.preventDefault()
    updateOptions(value.trim(), option)
    toggle()
  }
  return (
    <li>
      {isEditing ? (
        <form onSubmit={handleSubmit}>
          <input
            value={strInput(value)}
            onChange={handleChange}
            onBlur={toggle}
            autoFocus
          />
        </form>
      ) : (
        <span aria-label={`Edit ${option}`} onClick={toggle}>
          {option}
        </span>
      )}
    </li>
  )
}

export default CurrentOption
