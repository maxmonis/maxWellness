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
  const handleCopyClick = () => {
    updateRoutine(routine)
    if (navigator.clipboard) navigator.clipboard.writeText(CLIPBOARD_TEXT)
    toggleMenu(id)
    setAlert('Workout Copied', 'success')
  }
  const handleEditClick = () => {
    toggleMenu(id)
    editWorkout(workout)
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
        <h4 onClick={() => toggleMenu(workout.id)} className='pointer'>
          {`${name} - `}
          {formatDate(date)}
        </h4>
        <section className='mb-4'>
          <ul>
            {organizedRoutine.map(exercise => (
              <li key={exercise.id}>
                <span>{`${exercise.lift}: ${exercise.printout}`}</span>
              </li>
            ))}
          </ul>
          {menuID === workout.id && (
            <>
              <button className='btn-3' onClick={handleCopyClick}>
                Copy
              </button>
              <button className='mt-16 mr-20 ml-20' onClick={handleEditClick}>
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
