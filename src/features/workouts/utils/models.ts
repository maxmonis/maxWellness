import { validViews } from "./constants"

export interface Exercise {
	id: string
	nameId: string
	recordEndDate?: string
	recordStartDate?: string
	reps: number
	sets: number
	weight: number
}

export type View = (typeof validViews)[number]

export interface Workout {
	date: string
	exercises: Array<Exercise>
	id: string
	nameId: string
	userId: string
}
