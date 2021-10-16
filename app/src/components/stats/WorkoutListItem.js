import React, { useContext } from 'react'
import organizeRoutine from '../../functions/organizeRoutine'
import useToggle from '../../hooks/useToggle'
import AlertContext from '../../context/alert/alertContext'
import { formatDate } from '../../functions/helpers'
import { Modal } from '../layout/UI'

const WorkoutListItem = ({
  workout,
  editWorkout,
  updateRoutine,
  updateWorkouts,
  menuID,
  toggleMenu,
}) => {
  const { setAlert } = useContext(AlertContext)
  const { id, date, name, routine } = workout
  const [showDeleteModal, toggleDeleteModal] = useToggle(false)
  const handleDelete = () => {
    updateWorkouts(id)
    setAlert('Workout Deleted', 'success')
    toggleDeleteModal()
  }
  const organizedRoutine = organizeRoutine(routine)
  const CLIPBOARD_TEXT = `
  ${name}
  ${formatDate(date)}
  ${organizedRoutine.map(
    exercise => `
  ${exercise.lift}: ${exercise.printout}`
  )}
  `
  const handleClick = () => {
    updateRoutine(routine)
    if (navigator.clipboard) navigator.clipboard.writeText(CLIPBOARD_TEXT)
    toggleMenu(id)
    setAlert('Workout Copied', 'success')
  }
  return (
    routine.length > 0 && (
      <div className='mb-24 pb-4'>
        {showDeleteModal && (
          <Modal handleClose={toggleDeleteModal}>
            <h2>Delete Workout?</h2>
            <h5 className='mt-8 mb-24'>This action cannot be undone</h5>
            <button onClick={toggleDeleteModal}>Cancel</button>
            <button className='red ml-20' onClick={handleDelete}>
              Delete
            </button>
          </Modal>
        )}
        <h3>
          {`${name} - `}
          {formatDate(date)}
        </h3>
        <section className='mb-4'>
          <ul onClick={() => toggleMenu(workout.id)}>
            {organizedRoutine.map(exercise => (
              <li key={exercise.id}>
                <h4>{`${exercise.lift}: ${exercise.printout}`}</h4>
              </li>
            ))}
          </ul>
          {menuID === workout.id && (
            <>
              <button className='btn-3' onClick={handleClick}>
                Copy
              </button>
              <button
                className='mt-16 mr-20 ml-20'
                onClick={() => editWorkout(workout)}>
                Edit
              </button>
              <button className='red' onClick={toggleDeleteModal}>
                Delete
              </button>
            </>
          )}
        </section>
      </div>
    )
  )
}

export default WorkoutListItem
