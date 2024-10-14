import { db } from "@/firebase/app"
import { collection, getDocs, query, where } from "firebase/firestore"
import { isProfile } from "../utils/validators"

/**
 * @returns the user's profile from the database
 */
export async function loadProfile(userId: string) {
	const { docs } = await getDocs(
		query(collection(db, "profile"), where("userId", "==", userId)),
	)
	const profile = { ...docs[0]?.data(), id: docs[0]?.id }
	return isProfile(profile) ? profile : null
}
