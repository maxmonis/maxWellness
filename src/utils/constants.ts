import { nanoid } from "nanoid"

export const defaultLiftNames = ["Bench Press", "Deadlift", "Squat"].map(
	text => ({
		id: nanoid(),
		text,
	}),
)

export const defaultWorkoutNames = [
	"Full Body",
	"Lower Body",
	"Upper Body",
].map(text => ({ id: nanoid(), text }))
