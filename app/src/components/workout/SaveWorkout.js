import React, { useState, useEffect } from 'react'
import { Input, Modal } from '../layout/UI'
import UpdateOptions from '../option/UpdateOptions'
import organizeRoutine from '../../functions/organizeRoutine'
import useToggle from '../../hooks/useToggle'

const SaveWorkout = ({
  name,
  date,
  handleChange,
  saveWorkout,
  routine,
  updateRoutine,
  workoutNames,
  updateWorkoutNames,
  isNewWorkout,
}) => {
  const INITIAL_ERRORS = { name: null, date: null }
  const [errors, setErrors] = useState(INITIAL_ERRORS)
  const [isFormOpen, toggleForm] = useToggle(false)
  const [isEditingNames, toggleNameEdit] = useToggle(false)
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
  const handleSelection = e =>
    e.target.value === '#workoutName' ? toggleNameEdit() : handleChange(e)
  const handleBlur = () => name && setErrors({ ...errors, name: null })
  useEffect(() => {
    if (routine.length === 0) toggleForm(false)
    // eslint-disable-next-line
  }, [routine])
  return (
    <>
      {isFormOpen && (
        <Modal handleClose={toggleForm}>
          {isEditingNames ? (
            <>
              <UpdateOptions
                options={workoutNames}
                updateOptions={updateWorkoutNames}
                toggleOptionForm={toggleNameEdit}
                optionName={'Workout'}
              />
            </>
          ) : (
            <form onSubmit={handleSubmit} noValidate>
              <h2>Save Workout</h2>
              <select
                className='mt-3'
                name='name'
                value={name}
                onBlur={handleBlur}
                onChange={handleSelection}>
                {workoutNames.map(workoutName => (
                  <option key={workoutName} value={workoutName}>
                    {workoutName}
                  </option>
                ))}
                {isNewWorkout && (
                  <option key='#workoutName' value='#workoutName'>
                    {'<<< Add/Edit >>>'}
                  </option>
                )}
              </select>
              {errors.name && <p className='input-error'>{errors.name}</p>}
              <Input
                name='date'
                label='Workout Date'
                type='date'
                value={date}
                handleChange={handleChange}
                error={errors.date}
                persistentLabel
              />
              <ul className='mb-6'>
                {organizeRoutine(routine).map(({ id, lift, printout }) => (
                  <li key={id}>
                    <h4>{`${lift}: ${printout}`}</h4>
                  </li>
                ))}
              </ul>
              <button className='btn-1 mr-3' type='submit'>
                Confirm
              </button>
              <button onClick={toggleForm}>Cancel</button>
            </form>
          )}
        </Modal>
      )}
      {routine.length > 0 && (
        <>
          <button className='btn-1 mr-3' onClick={toggleForm} type='button'>
            Save Workout
          </button>
          <button onClick={() => updateRoutine()}>Clear</button>
        </>
      )}
    </>
  )
}

export default SaveWorkout
