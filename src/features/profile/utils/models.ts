import { EditableName } from "@/features/settings/utils/models"

export interface Profile {
	id: string
	liftNames: Array<EditableName>
	photoURL: string
	workoutNames: Array<EditableName>
	userId: string
	userName: string
}
