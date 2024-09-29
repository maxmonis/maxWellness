const now = new Date()
const year = now.getFullYear()
const month = (now.getMonth() + 1).toString().padStart(2, "0")
const day = now.getDate().toString().padStart(2, "0")
export const today = [year, month, day].join("-")

export const validViews = ["calendar", "create", "filters", "list"] as const
