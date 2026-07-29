import api from '../../app/api'

const getSessions = async (params = {}) => {
  const { data } = await api.get('/sessions', { params })
  return data
}

const createSession = async (payload) => {
  const { data } = await api.post('/sessions', payload)
  return data
}

const updateSession = async (id, payload) => {
  const { data } = await api.put(`/sessions/${id}`, payload)
  return data
}

const deleteSession = async (id) => {
  const { data } = await api.delete(`/sessions/${id}`)
  return data
}

export default { getSessions, createSession, updateSession, deleteSession }
