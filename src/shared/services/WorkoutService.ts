import {UnsavedWorkout, Workout} from "../utils/models"
import {RequestService} from "./RequestService"

class WorkoutService extends RequestService {
  constructor() {
    super("api/workouts")
  }

  /**
   * Saves a new workout to the database
   */
  saveWorkout(workout: UnsavedWorkout) {
    return this.post({body: workout})
  }

  /**
   * Updates a workout in the database
   */
  updateWorkout(workout: Workout) {
    return this.put({body: workout})
  }

  /**
   * Deletes a workout from the database
   */
  deleteWorkout(workoutId: string) {
    return this.delete({route: workoutId})
  }
}

export const workoutService = new WorkoutService()
