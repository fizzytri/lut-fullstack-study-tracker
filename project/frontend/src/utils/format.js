export const formatMinutes = (minutes) => {
  if (!minutes) return '0 min'

  const hours = Math.floor(minutes / 60)
  const rest = minutes % 60

  if (!hours) return `${rest} min`
  if (!rest) return `${hours} h`

  return `${hours} h ${rest} min`
}

export const formatDate = (value) =>
  new Date(value).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })

export const daysUntil = (value) => {
  const diff = new Date(value).getTime() - Date.now()
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
}
