import { db } from "@/firebase/app"
import { doc, writeBatch } from "firebase/firestore"
import { nanoid } from "nanoid"

export async function createDefaultSettings(userId: string) {
	const batch = writeBatch(db)
	for (const text of ["Bench Press", "Deadlift", "Squat"])
		batch.set(doc(db, "users", userId, "exerciseNames", nanoid()), { text })
	for (const text of ["Full Body", "Lower Body", "Upper Body"])
		batch.set(doc(db, "users", userId, "workoutNames", nanoid()), { text })
	await batch.commit()
}
