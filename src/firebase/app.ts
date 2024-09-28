import { initializeApp } from "firebase/app"
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
	deleteDoc,
	doc,
	getDocs,
	getFirestore,
	orderBy,
	query,
	updateDoc,
	where,
} from "firebase/firestore"
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage"
import omit from "lodash/omit"
import { defaultLiftNames, defaultWorkoutNames } from "~/utils/constants"
import { Profile, UnsavedWorkout, Workout } from "~/utils/models"
import { generateSession } from "~/utils/session"
import { isProfile, isWorkout } from "~/utils/validators"

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
const storage = getStorage(app)

/**
 * Deletes a workout from the database using its ID
 */
export async function deleteWorkout(id: string) {
	await deleteDoc(doc(db, "workouts", id))
}

/**
 * @returns a session for the current user
 */
export async function getSession(userId: string) {
	const [profile, workouts] = await Promise.all([
		loadProfile(userId),
		loadWorkouts(userId),
	])
	if (profile && workouts) {
		return generateSession(profile, workouts)
	}
}

/**
 * Opens a popup which prompts the user for their Google
 * credentials, then logs them in if they have an account
 * or creates a new account for them if not
 * @returns whether this is a new user
 */
export async function googleLogin() {
	const { user } = await signInWithPopup(auth, new GoogleAuthProvider())
	const { docs } = await getDocs(
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
 * @returns the user's profile from the database
 */
export async function loadProfile(userId: string) {
	const {
		docs: [doc],
	} = await getDocs(
		query(collection(db, "profile"), where("userId", "==", userId)),
	)
	if (!doc) return
	const profile = { ...doc.data(), id: doc.id }
	if (isProfile(profile)) {
		return profile
	}
}

/**
 * Uploads an image to Firebase Storage
 * @returns the URL of the uploaded image
 */
export async function uploadImage(file: File, path: string) {
	if (file.size > 5 * 1024 * 1024) {
		throw Error("Max size is 5MB")
	}
	const storageRef = ref(storage, `images/${path}`)
	await uploadBytes(storageRef, file)
	return getDownloadURL(storageRef)
}

/**
 * Updates the user's profile image in the database
 */
export async function updateImage(profileId: string, photoURL: string) {
	return updateDoc(doc(db, "profile", profileId), { photoURL })
}

/**
 * @returns the user's workouts from the database
 */
export async function loadWorkouts(userId: string) {
	const { docs } = await getDocs(
		query(
			collection(db, "workouts"),
			where("userId", "==", userId),
			orderBy("date", "desc"),
		),
	)
	const workouts = docs.map(doc => ({ ...doc.data(), id: doc.id }))
	if (workouts.every(isWorkout)) {
		return workouts
	}
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
 * Saves a new workout to the database
 */
export async function saveWorkout({ date, ...workout }: UnsavedWorkout) {
	const [year, month, day] = date.split("T")[0].split("-").map(Number)
	await addDoc(collection(db, "workouts"), {
		...workout,
		date: new Date(year, month - 1, day).toISOString(),
		routine: workout.routine.map(exercise =>
			omit(exercise, ["recordStartDate", "recordEndDate"]),
		),
	})
}

/**
 * Creates a new account using the provided name, email, and password
 */
export async function signUp(name: string, email: string, password: string) {
	const { user } = await createUserWithEmailAndPassword(auth, email, password)
	await addDoc(collection(db, "profile"), {
		liftNames: defaultLiftNames,
		photoURL: "",
		userId: user.uid,
		userName: name,
		workoutNames: defaultWorkoutNames,
	})
	return user
}

/**
 * Saves the user's updated profile to the database,
 * ensuring that no name is deleted if currently in use
 */
export async function updateProfile({
	liftNames,
	userId,
	workoutNames,
}: Profile) {
	const profile = await loadProfile(userId)
	const workouts = await loadWorkouts(userId)
	if (!profile || !workouts) return
	const updatedLiftNames = [...liftNames]
	const updatedWorkoutNames = [...workoutNames]
	const liftIds = new Set<string>()
	const nameIds = new Set<string>()
	for (const { nameId, routine } of workouts) {
		nameIds.add(nameId)
		for (const { liftId } of routine) {
			liftIds.add(liftId)
		}
	}
	for (const liftId of Array.from(liftIds)) {
		if (!updatedLiftNames.some(({ id }) => id === liftId)) {
			const liftName = profile.liftNames.find(({ id }) => id === liftId)
			if (
				liftName &&
				!updatedLiftNames.some(({ text }) => text === liftName.text)
			) {
				updatedLiftNames.push(liftName)
			}
		}
	}
	for (const nameId of Array.from(nameIds)) {
		if (!updatedWorkoutNames.some(({ id }) => id === nameId)) {
			const workoutName = profile.workoutNames.find(({ id }) => id === nameId)
			if (
				workoutName &&
				!updatedWorkoutNames.some(({ text }) => text === workoutName.text)
			) {
				updatedWorkoutNames.push(workoutName)
			}
		}
	}
	for (const liftName of updatedLiftNames) {
		liftName.isHidden ??= false
	}
	for (const workoutName of updatedWorkoutNames) {
		workoutName.isHidden ??= false
	}
	await updateDoc(doc(db, "profile", profile.id), {
		...profile,
		liftNames: updatedLiftNames,
		workoutNames: updatedWorkoutNames,
	})
}

/**
 * Updates an existing workout in the database
 */
export async function updateWorkout({ date, id, ...workout }: Workout) {
	const [year, month, day] = date.split("T")[0].split("-").map(Number)
	await updateDoc(doc(db, "workouts", id), {
		...workout,
		date: new Date(year, month - 1, day).toISOString(),
		routine: workout.routine.map(exercise =>
			omit(exercise, ["recordStartDate", "recordEndDate"]),
		),
	})
}
