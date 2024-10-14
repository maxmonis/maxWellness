import { db } from "@/firebase/app"
import { doc, updateDoc } from "firebase/firestore"
import { Profile } from "../utils/models"

/**
 * Updates the user's profile in the database
 */
export async function updateProfile(
	profileId: string,
	newFields: Partial<Profile>,
) {
	return updateDoc(doc(db, "profile", profileId), newFields)
}
