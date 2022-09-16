import { useState } from 'react'
import eliminateRedundancy from '../functions/eliminateRedundancy'
import updateLifts from '../functions/updateLifts'
import updateRoutine from '../functions/updateRoutine'
import updateWorkouts from '../functions/updateWorkouts'
import updateWorkoutNames from '../functions/updateWorkoutNames'

const useClientState = initialClient => {
  const [client, setClient] = useState(initialClient)
  const defaultRoutine =
    JSON.parse(window.localStorage.getItem(client._id)) || []
  const [routine, setRoutine] = useState(defaultRoutine)
  const [editingRoutine, setEditingRoutine] = useState([])
  const saveRoutine = updated => {
    window.localStorage.setItem(client._id, JSON.stringify(updated))
    setRoutine(updated)
  }
  return {
    client,
    routine,
    editingRoutine,
    updateRoutine: value =>
      saveRoutine(eliminateRedundancy(updateRoutine(value, routine))),
    updateEditingRoutine: value =>
      setEditingRoutine(
        eliminateRedundancy(updateRoutine(value, editingRoutine))
      ),
    updateLifts: (newName, oldName) => {
      const updated = updateLifts(newName, oldName, client, routine)
      if (updated)
        if (updated.length) setClient({ ...client, lifts: updated })
        else {
          saveRoutine(updated.routine)
          const { lifts, workouts } = updated
          setClient({ ...client, lifts, workouts })
        }
    },
    updateWorkoutNames: (newName, oldName) => {
      const updated = updateWorkoutNames(newName, oldName, client)
      if (updated)
        if (updated.length) setClient({ ...client, workoutNames: updated })
        else {
          const { workoutNames, workouts } = updated
          setClient({ ...client, workoutNames, workouts })
        }
    },
    updateWorkouts: value => {
      const workouts = updateWorkouts(value, client.workouts)
      setClient({ ...client, workouts })
    },
  }
}

export default useClientState
