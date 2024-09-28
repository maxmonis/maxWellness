import { EditableName, Exercise, Profile, Workout } from "./models"

export function hasChars(string: unknown, minLength = 1): string is string {
	return typeof string === "string" && string.trim().length >= minLength
}

export function hasMessage(error: unknown): error is { message: string } {
	return hasChars((error as Error)?.message)
}

function isEditableName(value: unknown): value is EditableName {
	const name = value as EditableName | null
	return (
		hasChars(name?.id) &&
		hasChars(name.text) &&
		["undefined", "boolean"].includes(typeof name.canDelete)
	)
}

type Email = `${string}@${string}.${string}`
export function isEmail(email: unknown): email is Email {
	return typeof email === "string" && /^\S+@\S+\.\S+$/.test(email)
}

function isExercise(value: unknown): value is Exercise {
	const exercise = value as Exercise | null
	return (
		hasChars(exercise?.liftId) && (exercise.reps > 0 || exercise.weight > 0)
	)
}

export function isProfile(value: unknown): value is Profile {
	const profile = value as Profile | null
	return (
		hasChars(profile?.id) &&
		hasChars(profile.userId) &&
		hasChars(profile.userName) &&
		Array.isArray(profile.liftNames) &&
		profile.liftNames.length > 0 &&
		profile.liftNames.every(isEditableName) &&
		Array.isArray(profile.workoutNames) &&
		profile.workoutNames.length > 0 &&
		profile.workoutNames.every(isEditableName)
	)
}

function isRoutine(routine: unknown): routine is Workout["routine"] {
	return Array.isArray(routine) && routine.every(isExercise)
}

function isWorkout(value: unknown): value is Workout {
	const workout = value as Workout | null
	return (
		hasChars(workout?.date) &&
		hasChars(workout.nameId) &&
		isRoutine(workout.routine) &&
		hasChars(workout.userId) &&
		hasChars(workout.id)
	)
}

export function isWorkoutList(
	workoutList: unknown,
): workoutList is Array<Workout> {
	return Array.isArray(workoutList) && workoutList.every(isWorkout)
}

type AuthFormValues =
	| {
			email: string
			page: "login"
			password: string
			password2?: never
			userName?: never
	  }
	| {
			email: string
			page: "register"
			password: string
			password2: string
			userName: string
	  }
	| {
			email: string
			page: "reset-password"
			password?: never
			password2?: never
			userName?: never
	  }

export function validateAuthForm({
	email,
	page,
	password,
	password2,
	userName,
}: AuthFormValues) {
	const inputErrors: Partial<AuthFormValues> = {}

	if (!hasChars(email)) {
		inputErrors.email = "Email is required"
	} else if (!isEmail(email)) {
		inputErrors.email = "Invalid email"
	}

	if (["login", "register"].includes(page)) {
		if (!hasChars(password)) {
			inputErrors.password = "Password is required"
		} else if (!hasChars(password, 6)) {
			inputErrors.password = "Password is too short"
		}
	}

	if (page === "register") {
		if (!hasChars(userName)) {
			inputErrors.userName = "Name is required"
		} else if (!hasChars(userName, 3)) {
			inputErrors.password = "Name is too short"
		}

		if (!hasChars(password2)) {
			inputErrors.password2 = "Password confirmation is required"
		} else if (!hasChars(password2, 6)) {
			inputErrors.password2 = "Password is too short"
		} else if (password2 !== password) {
			inputErrors.password2 = "Passwords must match"
		}
	}
	return inputErrors
}
