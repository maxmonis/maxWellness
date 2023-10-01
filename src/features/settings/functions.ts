import {EditableName} from "~/shared/resources/models"

/**
 * Evaluates whether text exists in a list of names (case insensitive)
 */
export function isTextAlreadyInList(newText: string, allNames: EditableName[]) {
  return allNames.some(
    ({text}) =>
      text.toLowerCase().replace(/\s/g, "") ===
      newText.toLowerCase().replace(/\s/g, ""),
  )
}
