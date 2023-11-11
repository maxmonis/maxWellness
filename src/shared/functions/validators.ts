import {
  EditableName,
  Exercise,
  Profile,
  UnsavedWorkout,
  Workout,
} from "~/shared/utils/models"

export function hasChars(string: unknown, minLength = 1): string is string {
  return typeof string === "string" && string.trim().length >= minLength
}

export function hasMessage(error: unknown): error is {message: string} {
  return hasChars((error as Error)?.message)
}

function isEditableName(name: unknown): name is EditableName {
  return (
    hasChars((name as EditableName)?.id) &&
    hasChars((name as EditableName).text) &&
    ["undefined", "boolean"].includes(typeof (name as EditableName).canDelete)
  )
}

type Email = `${string}@${string}.${string}`
export function isEmail(email: unknown): email is Email {
  return typeof email === "string" && /^\S+@\S+\.\S+$/.test(email)
}

function isExercise(exercise: unknown): exercise is Exercise {
  return (
    hasChars((exercise as Exercise)?.liftId) &&
    ((exercise as Exercise).reps > 0 || (exercise as Exercise).weight > 0)
  )
}

function isRoutine(routine: unknown): routine is Workout["routine"] {
  return Array.isArray(routine) && routine.every(isExercise)
}

export function isUnsavedWorkout(workout: unknown): workout is UnsavedWorkout {
  return (
    hasChars((workout as Workout)?.date) &&
    hasChars((workout as Workout).nameId) &&
    isRoutine((workout as Workout).routine) &&
    hasChars((workout as Workout).userId)
  )
}

export function isWorkout(workout: unknown): workout is Workout {
  return isUnsavedWorkout(workout) && hasChars((workout as Workout).id)
}

export function isProfile(profile: unknown): profile is Profile {
  return (
    hasChars((profile as Profile)?.id) &&
    hasChars((profile as Profile).userId) &&
    hasChars((profile as Profile).userName) &&
    Array.isArray((profile as Profile).liftNames) &&
    (profile as Profile).liftNames.length > 0 &&
    (profile as Profile).liftNames.every(isEditableName) &&
    Array.isArray((profile as Profile).workoutNames) &&
    (profile as Profile).workoutNames.length > 0 &&
    (profile as Profile).workoutNames.every(isEditableName)
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
