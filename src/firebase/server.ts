import admin from "firebase-admin"
import omit from "lodash/omit"
import {isProfile, isWorkout} from "~/shared/functions/validators"
import {Profile, UnsavedWorkout, Workout} from "~/shared/utils/models"

if (admin.apps.length === 0) {
  admin.initializeApp({
    credential: admin.credential.cert({
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
    }),
  })
}

const db = admin.firestore()

/**
 * Deletes a workout from the database using its ID
 */
export function deleteWorkout(id: string) {
  return db.collection("workouts").doc(id).delete()
}

/**
 * Loads the corresponding profile for a user ID
 */
export async function getUserProfile(userId: string) {
  const {
    docs: [doc],
  } = await db.collection("profile").where("userId", "==", userId).get()

  const profile = {...doc.data(), id: doc.id}

  if (isProfile(profile)) {
    return profile
  }
}

/**
 * Loads the corresponding workouts for a user ID
 */
export async function getUserWorkouts(userId: string) {
  const {docs} = await db
    .collection("workouts")
    .where("userId", "==", userId)
    .get()

  const workouts = docs.map(doc => ({...doc.data(), id: doc.id}))

  if (workouts.every(isWorkout)) {
    return workouts
  }
}

/**
 * Saves a workout to the database
 */
export function saveWorkout(workout: UnsavedWorkout) {
  const [year, month, day] = workout.date.split("T")[0].split("-").map(Number)

  return db.collection("workouts").add({
    ...workout,
    date: new Date(year, month - 1, day).toISOString(),
    routine: workout.routine.map(exercise =>
      omit(exercise, ["recordStartDate", "recordEndDate"]),
    ),
  })
}

/**
 * Updates the user's profile in the database
 */
export function updateProfile({id, ...profile}: Profile) {
  return db
    .collection("profile")
    .doc(id)
    .set({
      ...profile,
      liftNames: profile.liftNames.map(name => omit(name, ["canDelete"])),
      workoutNames: profile.workoutNames.map(name => omit(name, ["canDelete"])),
    })
}

/**
 * Updates a workout in the database
 */
export function updateWorkout({id, ...workout}: Workout) {
  const [year, month, day] = workout.date.split("T")[0].split("-").map(Number)

  return db
    .collection("workouts")
    .doc(id)
    .set({
      ...workout,
      date: new Date(year, month - 1, day).toISOString(),
      routine: workout.routine.map(exercise =>
        omit(exercise, ["recordStartDate", "recordEndDate"]),
      ),
    })
}
