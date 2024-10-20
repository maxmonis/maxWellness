/**
 * Evaluates whether text exists in a list of names (case insensitive)
 */
export function isSameText(text1: string, text2: string) {
	return (
		text1.toLowerCase().replace(/\s/g, "") ===
		text2.toLowerCase().replace(/\s/g, "")
	)
}
