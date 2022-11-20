import React from "react"
import { Draggable } from "react-beautiful-dnd"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faX } from "@fortawesome/free-solid-svg-icons"

const Exercise = ({ exercise, index, selectExercise }) => {
  const { id, lift, printout } = exercise
  const handleClick = () => selectExercise(exercise)
  return (
    <Draggable draggableId={id} index={index}>
      {provided => (
        <li
          ref={provided.innerRef}
          {...provided.draggableProps}
          className="flex-row">
          <h4 {...provided.dragHandleProps}>
            {lift}: {printout}
          </h4>
          <button onClick={handleClick}>
            <FontAwesomeIcon icon={faX} />
          </button>
        </li>
      )}
    </Draggable>
  )
}

export default Exercise
