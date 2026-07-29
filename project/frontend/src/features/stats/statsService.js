import axios from 'axios'

const API_URL = '/api/stats/'

const getSummary = async (days, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }

  const response = await axios.get(API_URL + 'summary?days=' + days, config)
  return response.data
}

const statsService = { getSummary }

export default statsService
