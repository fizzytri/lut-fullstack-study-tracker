import api from '../../app/api'

const getSummary = async (days = 30) => {
  const { data } = await api.get('/stats/summary', { params: { days } })
  return data
}

export default { getSummary }
