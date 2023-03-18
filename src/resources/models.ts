import {generateSession} from "../utils/session"

export interface EditableName {
  canDelete?: boolean
  id: string
  text: string
}

export interface Exercise {
  id: string
  liftId: string
  recordEndDate?: string
  recordStartDate?: string
  reps: number
  sets: number
  weight: number
}

export interface Profile {
  id: string
  liftNames: EditableName[]
  photoURL: string
  workoutNames: EditableName[]
  userId: string
  userName: string
}

export type Session = ReturnType<typeof generateSession>

export interface UnsavedWorkout {
  date: string
  nameId: string
  routine: Exercise[]
  userId: string
}

export interface Workout extends UnsavedWorkout {
  id: string
}
