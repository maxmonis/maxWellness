import { loadProfile } from "@/features/profile/firebase/loadProfile"
import { Profile } from "@/features/profile/utils/models"
import { loadWorkouts } from "@/features/workouts/firebase/loadWorkouts"
import { db } from "@/firebase/app"
import { doc, updateDoc } from "firebase/firestore"

/**
 * Saves the user's updated profile to the database,
 * ensuring that no name is deleted if currently in use
 */
export async function updateSettings({
	liftNames,
	userId,
	workoutNames,
}: Profile) {
	const profile = await loadProfile(userId)
	const workouts = await loadWorkouts(userId)
	if (!profile || !workouts) {
		return
	}
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
	return updateDoc(doc(db, "profile", profile.id), {
		...profile,
		liftNames: updatedLiftNames,
		workoutNames: updatedWorkoutNames,
	})
}
