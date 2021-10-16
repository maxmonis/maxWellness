import React, { useEffect, useState } from 'react'
import LiftRecords from '../lift/LiftRecords'
import { Input } from '../layout/UI'
import { numInput } from '../../functions/helpers'

const AddExercise = ({
  lifts,
  handleChange,
  exercise,
  records,
  updateRoutine,
  setExercise,
  isNewWorkout,
  toggleExerciseHistory,
}) => {
  const { lift, sets, reps, weight } = exercise
  const [blurred, setBlurred] = useState(false)
  const [error, setError] = useState(false)
  const handleSubmit = e => {
    e.preventDefault()
    if (weight > 0 || reps > 0) {
      setBlurred(false)
      setError(false)
      updateRoutine(exercise)
    } else {
      setError(true)
    }
  }
  const reset = () => {
    setExercise({ ...exercise, sets: '', reps: '', weight: '' })
    setError(false)
  }
  useEffect(() => {
    setError(blurred && !weight && !reps)
    // eslint-disable-next-line
  }, [reps, weight])
  return (
    <>
      <select
        className='mt-12'
        name='lift'
        value={lift}
        onChange={handleChange}>
        {lifts.map(lift => (
          <option key={lift} value={lift}>
            {lift}
          </option>
        ))}
        {isNewWorkout && (
          <option key='#' value='#'>
            {'<<< Edit Exercises >>>'}
          </option>
        )}
      </select>
      {isNewWorkout && (
        <div>
          <button className='btn-3 mt-16' onClick={toggleExerciseHistory}>
            Exercise History
          </button>
        </div>
      )}
      <LiftRecords
        records={records}
        lift={exercise.lift}
        setExercise={setExercise}
      />
      <form onSubmit={handleSubmit} noValidate>
        <div className='new-exercise-inputs'>
          <Input
            name='sets'
            label='Sets'
            type='number'
            value={numInput(sets)}
            handleChange={handleChange}
          />
          <Input
            name='reps'
            label='Reps'
            type='number'
            value={numInput(reps)}
            handleChange={handleChange}
          />
          <Input
            name='weight'
            label='Weight'
            type='number'
            value={numInput(weight)}
            handleChange={handleChange}
          />
        </div>
        <button className='btn-2 mr-8' type='submit'>
          Enter Exercise
        </button>
        {(sets || reps || weight) && <button onClick={reset}>Reset</button>}
        {error && <p className='red'>Invalid exercise</p>}
      </form>
    </>
  )
}

export default AddExercise
