import { generateSession } from "./session"

export interface EditableName {
	canDelete?: boolean
	id: string
	isHidden?: boolean
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
	liftNames: Array<EditableName>
	photoURL: string
	workoutNames: Array<EditableName>
	userId: string
	userName: string
}

export type Session = ReturnType<typeof generateSession>

export interface UnsavedWorkout {
	date: string
	nameId: string
	routine: Array<Exercise>
	userId: string
}

export interface Workout extends UnsavedWorkout {
	id: string
}
