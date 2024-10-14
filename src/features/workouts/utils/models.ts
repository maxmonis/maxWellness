import { validViews } from "./constants"

export interface Exercise {
	id: string
	liftId: string
	recordEndDate?: string
	recordStartDate?: string
	reps: number
	sets: number
	weight: number
}

export type View = (typeof validViews)[number]

export interface Workout {
	date: string
	id: string
	nameId: string
	routine: Array<Exercise>
	userId: string
}
