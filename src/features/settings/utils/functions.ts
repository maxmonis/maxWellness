import { EditableName } from "@/features/settings/utils/models"

/**
 * Evaluates whether text exists in a list of names (case insensitive)
 */
export function isTextAlreadyInList(
	newText: string,
	nameList: Array<EditableName>,
) {
	return nameList.some(
		({ text }) =>
			text.toLowerCase().replace(/\s/g, "") ===
			newText.toLowerCase().replace(/\s/g, ""),
	)
}
