import axios from 'axios'

const api = axios.create({ baseURL: '/api' })

api.interceptors.request.use((config) => {
  const stored = localStorage.getItem('mern-user')

  if (stored) {
    config.headers.Authorization = `Bearer ${JSON.parse(stored).token}`
  }

  return config
})

export default api
