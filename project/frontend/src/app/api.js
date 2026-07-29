import axios from 'axios'

const api = axios.create({ baseURL: '/api' })

api.interceptors.request.use((config) => {
  const stored = localStorage.getItem('user')

  if (stored) {
    const { token } = JSON.parse(stored)
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
  }

  return config
})

export const extractError = (error) =>
  error.response?.data?.message || error.message || 'Something went wrong'

export default api
