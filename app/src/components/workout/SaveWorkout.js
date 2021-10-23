import React, { useState, useEffect } from 'react'
import { Input, Modal } from '../layout/UI'
import { strInput } from '../../functions/helpers'
import organizeRoutine from '../../functions/organizeRoutine'
import useToggle from '../../hooks/useToggle'

const SaveWorkout = ({
  name,
  date,
  handleChange,
  saveWorkout,
  routine,
  updateRoutine,
}) => {
  const INITIAL_ERRORS = { name: null, date: null }
  const [errors, setErrors] = useState(INITIAL_ERRORS)
  const [isFormOpen, toggleForm] = useToggle(false)
  const validateDate = date =>
    /^\d{4}-([0]\d|1[0-2])-([0-2]\d|3[01])$/.test(date)
  const handleSubmit = e => {
    e.preventDefault()
    if (routine.length) {
      const isDateValid = validateDate(date)
      if (name && isDateValid) {
        setErrors(INITIAL_ERRORS)
        saveWorkout()
      } else {
        const nameError = !name ? 'Workout name is required' : null
        const dateError = !isDateValid
          ? 'Date must be in format yyyy-mm-dd'
          : null
        setErrors({ name: nameError, date: dateError })
      }
    }
  }
  const handleBlur = () => name && setErrors({ ...errors, name: null })
  useEffect(() => {
    if (routine.length === 0) toggleForm(false)
    // eslint-disable-next-line
  }, [routine])
  return (
    <form onSubmit={handleSubmit} noValidate>
      {isFormOpen && (
        <Modal handleClose={toggleForm}>
          <h2>Save Workout</h2>
          <Input
            name='name'
            label='Workout Name'
            value={strInput(name)}
            handleChange={handleChange}
            handleBlur={handleBlur}
            error={errors.name}
          />
          <Input
            name='date'
            label='Workout Date'
            type='date'
            value={date}
            handleChange={handleChange}
            error={errors.date}
            persistentLabel
          />
          <ul className='mb-24'>
            {organizeRoutine(routine).map(({ id, lift, printout }) => (
              <li key={id}>
                <h4>{`${lift}: ${printout}`}</h4>
              </li>
            ))}
          </ul>
          <button className='btn-1 mr-8' type='submit'>
            Confirm
          </button>
          <button onClick={toggleForm}>Cancel</button>
        </Modal>
      )}
      {routine.length > 0 && (
        <>
          <button className='btn-1 mr-8' onClick={toggleForm} type='button'>
            Save Workout
          </button>
          <button onClick={() => updateRoutine()}>Clear</button>
        </>
      )}
    </form>
  )
}

export default SaveWorkout
