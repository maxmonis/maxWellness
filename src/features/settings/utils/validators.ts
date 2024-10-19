import { EditableName } from "@/features/settings/utils/models"
import { hasChars } from "@/utils/validators"

export function isEditableName(value: unknown): value is EditableName {
	if (!value || typeof value !== "object") return false
	const name = value as EditableName
	return hasChars(name.id) && hasChars(name.text)
}
