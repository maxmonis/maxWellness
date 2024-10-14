export function hasChars(string: unknown, minLength = 1): string is string {
	return typeof string === "string" && string.trim().length >= minLength
}
