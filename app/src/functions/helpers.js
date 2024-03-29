export function alphabetize(array, property) {
  return array.sort((a, b) => {
    const textA = property ? a[property].toUpperCase() : a.toUpperCase()
    const textB = property ? b[property].toUpperCase() : b.toUpperCase()
    return textA < textB ? -1 : textA > textB ? 1 : 0
  })
}

export function chronologize(array) {
  return array.sort((a, b) => {
    const dateA = parseInt(a.date.replace(/-/g, ""))
    const dateB = parseInt(b.date.replace(/-/g, ""))
    return dateA - dateB
  })
}

export function numInput(value) {
  return value.toString().replace(/[^\d]/g, "")
}

export function standardize(string) {
  return string.replace(/[^a-z]/gi, "").toUpperCase()
}

export function strInput(string) {
  return string.replace(/[^a-z\s]/gi, "").replace(/[\s]+/, " ")
}

export function formatDate(date) {
  if (typeof date !== "string") return ""
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ]
  const weekday = days[new Date(`${date.replace(/-/g, "/")}`).getDay()]
  const year = date.slice(0, 4)
  const currentYear = new Date().getFullYear().toString()
  const month = months[parseInt(date.slice(5, 7)) - 1]
  const day = parseInt(date.slice(8))
  return `${weekday}, ${month} ${day}${year !== currentYear ? `, ${year}` : ""}`
}

export function getDate(daysAdded = 0) {
  const date = new Date()
  date.setDate(date.getDate() + daysAdded)
  return formatDate(date.toISOString().slice(0, 10))
}
