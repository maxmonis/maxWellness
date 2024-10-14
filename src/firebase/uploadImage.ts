import { getDownloadURL, ref, uploadBytes } from "firebase/storage"
import { storage } from "./app"

/**
 * Uploads an image to Firebase Storage
 * @returns the URL of the uploaded image
 */
export async function uploadImage(file: File, path: string) {
	if (file.size > 2 * 1024 * 1024) {
		throw Error("Max size is 2MB")
	}
	const storageRef = ref(storage, `images/${path}`)
	await uploadBytes(storageRef, file)
	return getDownloadURL(storageRef)
}
