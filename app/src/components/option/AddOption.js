import React from "react"
import { Input } from "../layout/UI"
import useInputState from "../../hooks/useInputState"
import { strInput } from "../../functions/helpers"

const AddOption = ({ updateOptions, optionName }) => {
  const [value, handleChange, reset] = useInputState("")
  return (
    <form
      noValidate
      onSubmit={e => {
        e.preventDefault()
        if (value) updateOptions(value.trim())
        reset()
      }}>
      <Input
        value={strInput(value)}
        handleChange={handleChange}
        label={`Add ${optionName}`}
      />
    </form>
  )
}

export default AddOption
