import React, { useState, useEffect, useContext } from 'react'
import EditWorkout from './EditWorkout'
import StatsApp from '../stats/StatsApp'
import UpdateOptions from '../option/UpdateOptions'
import ExerciseHistory from '../exercise/ExerciseHistory'
import AlertContext from '../../context/alert/alertContext'
import WorkoutContext from '../../context/workout/workoutContext'
import useClientState from '../../hooks/useClientState'
import useToggle from '../../hooks/useToggle'
import { ActionableAlert, Modal, Spinner } from '../layout/UI'

const WorkoutApp = ({ selectedClient, updateClient }) => {
  const { setAlert } = useContext(AlertContext)
  const {
    setAllWorkouts,
    filteredWorkouts,
    appliedFilterCount,
    clearWorkoutsFilters,
    records,
    filteredRecords,
  } = useContext(WorkoutContext)
  const {
    client,
    routine,
    editingRoutine,
    updateRoutine,
    updateEditingRoutine,
    updateLifts,
    updateWorkoutNames,
    updateWorkouts,
  } = useClientState(selectedClient)
  const { lifts, workouts, name, workoutNames } = client
  useEffect(() => {
    setAllWorkouts(workouts || null)
    // eslint-disable-next-line
  }, [workouts])
  const DEFAULT_EXERCISE = {
    lift: lifts[0],
    sets: '',
    reps: '',
    weight: '',
  }
  const [exercise, setExercise] = useState(DEFAULT_EXERCISE)
  const [editingExercise, setEditingExercise] = useState(DEFAULT_EXERCISE)
  const DEFAULT_WORKOUT = {
    name: workoutNames[0],
    date: new Date().toISOString().slice(0, 10),
  }
  const [workout, setWorkout] = useState(DEFAULT_WORKOUT)
  const [editingWorkout, setEditingWorkout] = useState(null)
  const [isEditingLifts, toggleLiftForm] = useToggle(false)
  const handleChange = e => {
    const { name, value } = e.target
    if (['name', 'date'].includes(name))
      editingWorkout
        ? setEditingWorkout({ ...editingWorkout, [name]: value })
        : setWorkout({ ...workout, [name]: value })
    else if (value === '#liftName') toggleLiftForm()
    else
      editingWorkout
        ? setEditingExercise({ ...editingExercise, [name]: value })
        : setExercise({ ...exercise, [name]: value })
  }
  const selectExercise = exercise => {
    if (editingWorkout) {
      setEditingExercise(exercise)
      updateEditingRoutine(exercise.id)
    } else {
      setExercise(exercise)
      updateRoutine(exercise.id)
    }
  }
  const editWorkout = workout => {
    if (workout) {
      setEditingWorkout(workout)
      updateEditingRoutine(workout.routine)
    } else setEditingWorkout(null)
  }
  const saveWorkout = () => {
    if (editingWorkout) {
      updateWorkouts({ ...editingWorkout, routine: editingRoutine })
      setEditingExercise(DEFAULT_EXERCISE)
      setEditingWorkout(null)
      updateEditingRoutine([])
      setAlert('Workout Updated', 'success')
    } else {
      updateWorkouts({ ...workout, routine })
      setExercise(DEFAULT_EXERCISE)
      setWorkout(DEFAULT_WORKOUT)
      updateRoutine()
      setAlert('Workout Saved', 'success')
    }
  }
  const title = name[0] === '#' ? name.slice(2) : name
  useEffect(() => {
    document.title = `maxWellness | ${title}`
    // eslint-disable-next-line
  }, [])
  useEffect(() => {
    updateClient(client)
    // eslint-disable-next-line
  }, [client])
  return filteredWorkouts ? (
    <div className='workout-app'>
      {editingWorkout && (
        <Modal handleClose={() => editWorkout(null)}>
          <h2 className='mb-12'>Edit Workout</h2>
          <EditWorkout
            exercise={editingExercise}
            workout={editingWorkout}
            lifts={lifts}
            routine={editingRoutine}
            workouts={workouts}
            records={records}
            workoutNames={workoutNames}
            handleChange={handleChange}
            saveWorkout={saveWorkout}
            updateRoutine={updateEditingRoutine}
            selectExercise={selectExercise}
            setExercise={setEditingExercise}
            updateWorkoutNames={updateWorkoutNames}
          />
        </Modal>
      )}
      {isEditingLifts && (
        <Modal handleClose={toggleLiftForm}>
          <UpdateOptions
            options={lifts}
            updateOptions={updateLifts}
            toggleOptionForm={toggleLiftForm}
            optionName='Exercise'
          />
        </Modal>
      )}
      <h1 className='p-12'>
        {title}
      </h1>
      {appliedFilterCount > 0 && (
        <ActionableAlert
          text={
            filteredWorkouts.length
              ? `${appliedFilterCount} filter${
                  appliedFilterCount === 1 ? '' : 's'
                } applied`
              : 'No Results'
          }
          btnText='Clear Filters'
          handleClick={clearWorkoutsFilters}
          classes={filteredWorkouts.length ? '' : 'critical'}
        />
      )}
      <>
        <main>
          <section>
            <h3>New Workout</h3>
            <EditWorkout
              exercise={exercise}
              workout={workout}
              lifts={lifts}
              routine={routine}
              workouts={workouts}
              records={records}
              workoutNames={workoutNames}
              handleChange={handleChange}
              saveWorkout={saveWorkout}
              updateRoutine={updateRoutine}
              selectExercise={selectExercise}
              setExercise={setExercise}
              updateWorkoutNames={updateWorkoutNames}
              isNewWorkout
            />
          </section>
          <StatsApp
            workouts={filteredWorkouts}
            records={filteredRecords}
            appliedFilterCount={appliedFilterCount}
            updateWorkouts={updateWorkouts}
            editWorkout={editWorkout}
            updateRoutine={updateRoutine}
            selectExercise={selectExercise}
          />
        </main>
        <ExerciseHistory
          workouts={filteredWorkouts}
          appliedFilterCount={appliedFilterCount}
        />
      </>
    </div>
  ) : (
    <Spinner />
  )
}

export default WorkoutApp
