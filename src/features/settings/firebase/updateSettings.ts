import { db } from "@/firebase/app"
import { doc, writeBatch } from "firebase/firestore"
import { isSameText } from "../utils/functions"
import { EditableName } from "../utils/models"
import { loadExerciseNames } from "./loadExerciseNames"
import { loadWorkoutNames } from "./loadWorkoutNames"

/**
 * Saves the user's updated settings to the database
 */
export async function updateSettings(
	userId: string,
	{
		exerciseNames,
		workoutNames,
	}: {
		exerciseNames: Array<EditableName>
		workoutNames: Array<EditableName>
	},
) {
	const [originalWorkoutNames, originalExerciseNames] = await Promise.all([
		loadWorkoutNames(userId),
		loadExerciseNames(userId),
	])
	if (!originalWorkoutNames || !originalExerciseNames)
		throw Error("500: Server error")

	const batch = writeBatch(db)

	for (const { id, ...updatedName } of exerciseNames)
		if (
			exerciseNames.filter(n => isSameText(n.text, updatedName.text)).length > 1
		)
			continue
		else if (
			originalExerciseNames.some(
				originalName =>
					originalName.id === id &&
					(originalName.text !== updatedName.text ||
						originalName.deleted !== updatedName.deleted),
			)
		)
			batch.update(doc(db, "users", userId, "exerciseNames", id), updatedName)
		else if (
			!updatedName.deleted &&
			!originalExerciseNames.some(n => n.id === id)
		)
			batch.set(doc(db, "users", userId, "exerciseNames", id), updatedName)

	for (const { id, ...updatedName } of workoutNames)
		if (
			workoutNames.filter(n => isSameText(n.text, updatedName.text)).length > 1
		)
			continue
		else if (
			originalWorkoutNames.some(
				originalName =>
					originalName.id === id &&
					(originalName.text !== updatedName.text ||
						originalName.deleted !== updatedName.deleted),
			)
		)
			batch.update(doc(db, "users", userId, "workoutNames", id), updatedName)
		else if (
			!updatedName.deleted &&
			!originalWorkoutNames.some(n => n.id === id)
		)
			batch.set(doc(db, "users", userId, "workoutNames", id), updatedName)

	await batch.commit()
}
