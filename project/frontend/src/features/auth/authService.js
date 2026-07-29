import api from '../../app/api'

const register = async (userData) => {
  const { data } = await api.post('/users', userData)

  if (data.token) {
    localStorage.setItem('user', JSON.stringify(data))
  }

  return data
}

const login = async (userData) => {
  const { data } = await api.post('/users/login', userData)

  if (data.token) {
    localStorage.setItem('user', JSON.stringify(data))
  }

  return data
}

const updateProfile = async (payload) => {
  const { data } = await api.put('/users/me', payload)
  const stored = JSON.parse(localStorage.getItem('user'))
  const merged = { ...stored, ...data }
  localStorage.setItem('user', JSON.stringify(merged))

  return merged
}

const logout = () => {
  localStorage.removeItem('user')
}

export default { register, login, logout, updateProfile }
