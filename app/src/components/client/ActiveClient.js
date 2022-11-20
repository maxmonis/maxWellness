import React from "react"
import { Link } from "react-router-dom"
import useToggle from "../../hooks/useToggle"

const ActiveClient = ({
  name,
  id,
  toggleDrawer,
  handleEdit,
  handleDeactivate,
}) => {
  const [optionsShown, toggleOptions] = useToggle(false)
  return (
    <div
      onMouseEnter={() => toggleOptions(true)}
      onMouseLeave={() => toggleOptions(false)}>
      {optionsShown ? (
        <Link to={id} title="Workouts">
          <button className="hover-underline" onClick={toggleDrawer}>
            {name}
          </button>
        </Link>
      ) : (
        <button onClick={toggleDrawer}>{name}</button>
      )}
      {optionsShown && (
        <div>
          <button onClick={handleEdit}>Edit</button>
          <button className="red mt-1 ml-5" onClick={handleDeactivate}>
            Remove
          </button>
        </div>
      )}
    </div>
  )
}

export default ActiveClient
