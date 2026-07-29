export const formatMinutes = (minutes) => {
  if (!minutes) {
    return '0 min'
  }

  const hours = Math.floor(minutes / 60)
  const rest = minutes % 60

  if (hours === 0) {
    return rest + ' min'
  }

  if (rest === 0) {
    return hours + ' h'
  }

  return hours + ' h ' + rest + ' min'
}

export const formatDate = (value) => {
  return new Date(value).toLocaleDateString('en-GB')
}
