import {UnsavedWorkout, Workout} from "../resources/models"

import RequestService from "./RequestService"

class WorkoutService extends RequestService {
  constructor() {
    super("api/workouts")
  }

  saveWorkout(workout: UnsavedWorkout) {
    return this.post({body: workout})
  }

  updateWorkout(workout: Workout) {
    return this.put({body: workout})
  }

  deleteWorkout(workoutId: string) {
    return this.delete({route: workoutId})
  }
}

export const workoutService = new WorkoutService()
