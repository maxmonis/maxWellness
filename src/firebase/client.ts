import {initializeApp} from "firebase/app"
import {
  createUserWithEmailAndPassword,
  getAuth,
  GoogleAuthProvider,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from "firebase/auth"
import {
  addDoc,
  collection,
  getDocs,
  getFirestore,
  query,
  where,
} from "firebase/firestore"

import {
  defaultLiftNames,
  defaultWorkoutNames,
} from "~/shared/resources/constants"

const app = initializeApp({
  apiKey: process.env.NEXT_PUBLIC_API_KEY,
  appId: process.env.NEXT_PUBLIC_APP_ID,
  authDomain: process.env.NEXT_PUBLIC_AUTH_DOMAIN,
  messagingSenderId: process.env.NEXT_PUBLIC_MESSAGING_SENDER_ID,
  projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_STORAGE_BUCKET,
})

export const auth = getAuth(app)
const db = getFirestore(app)

/**
 * Opens a popup which prompts the user for their Google
 * credentials, then logs them in if they have an account
 * or creates a new account for them if not
 * @returns whether this is a new user
 */
export async function googleLogin() {
  const {user} = await signInWithPopup(auth, new GoogleAuthProvider())
  const {docs} = await getDocs(
    query(collection(db, "profile"), where("userId", "==", user.uid)),
  )
  const isNewUser = docs.length === 0
  if (isNewUser) {
    await addDoc(collection(db, "profile"), {
      liftNames: defaultLiftNames,
      photoURL: user.photoURL,
      userId: user.uid,
      userName: user.displayName,
      workoutNames: defaultWorkoutNames,
    })
  }
  return isNewUser
}

/**
 * Logs a user in using their email and password
 */
export function logIn(email: string, password: string) {
  return signInWithEmailAndPassword(auth, email, password)
}

/**
 * Logs the user out
 */
export function logOut() {
  return signOut(auth)
}

/**
 * Sends an email to the user allowing them to reset their password
 */
export function resetPassword(email: string) {
  return sendPasswordResetEmail(auth, email)
}

/**
 * Creates a new account using the provided name, email, and password
 */
export async function signUp(name: string, email: string, password: string) {
  const {user} = await createUserWithEmailAndPassword(auth, email, password)
  await addDoc(collection(db, "profile"), {
    liftNames: defaultLiftNames,
    photoURL: "",
    userId: user.uid,
    userName: name,
    workoutNames: defaultWorkoutNames,
  })
  return user
}
